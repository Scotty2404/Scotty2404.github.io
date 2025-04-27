// EventPlannerBackend/services/SurveyService.js
const { 
    Survey, 
    MultipleChoiceQuestion, 
    TextQuestion, 
    ScaleQuestion,
    SurveyResponse 
} = require('../models/survey/index');

class SurveyService {
    constructor(db) {
        this.db = db;
    }

    async createSurvey(surveyData, userId) {
        return new Promise((resolve, reject) => {
            this.db.beginTransaction(async (err) => {
                if (err) return reject(err);

                try {
                    // Erstelle Survey-Objekt
                    const survey = new Survey(
                        null, // ID wird von der DB generiert
                        surveyData.title || 'Neue Umfrage',
                        surveyData.description,
                        userId
                    );

                    // 1. Survey in DB speichern
                    const surveyResult = await this.insertSurvey(survey);
                    survey.id = surveyResult.insertId;

                    // 2. Fragen verarbeiten und speichern
                    for (const questionData of surveyData.questions) {
                        let question;
                        
                        // Frage basierend auf Typ erstellen
                        switch (questionData.type) {
                            case 'multiple':
                                question = new MultipleChoiceQuestion(
                                    null,
                                    questionData.question_text,
                                    questionData.answers,
                                    questionData.multipleSelection || false
                                );
                                break;
                            case 'scale':
                                question = new ScaleQuestion(
                                    null,
                                    questionData.question_text,
                                    questionData.minValue || 1,
                                    questionData.maxValue || 5
                                );
                                break;
                            case 'text':
                                question = new TextQuestion(
                                    null,
                                    questionData.question_text,
                                    questionData.maxLength || 500
                                );
                                break;
                            default:
                                question = new TextQuestion(
                                    null,
                                    questionData.question_text
                                );
                        }

                        const questionResult = await this.insertQuestion(question);
                        question.id = questionResult.insertId;

                        // Verknüpfung zwischen Survey und Frage
                        await this.linkSurveyQuestion(survey.id, question.id);

                        // Bei Multiple Choice: Optionen speichern
                        if (question instanceof MultipleChoiceQuestion) {
                            for (const option of question.options) {
                                const optionResult = await this.insertOption(option);
                                option.id = optionResult.insertId; // ID aktualisieren
                                await this.linkQuestionOption(question.id, optionResult.insertId);
                            }
                        }

                        survey.addQuestion(question);
                    }

                    // Transaktion committen
                    this.db.commit((err) => {
                        if (err) {
                            return this.db.rollback(() => reject(err));
                        }
                        resolve(survey);
                    });
                } catch (error) {
                    this.db.rollback(() => reject(error));
                }
            });
        });
    }

    async getSurvey(surveyId) {
        return new Promise((resolve, reject) => {
            // Survey mit allen verknüpften Daten laden
            const query = `
                SELECT s.*, q.question_id, q.question_text, q.type, q.min_value, q.max_value, q.multiple_selection,
                       o.offered_answers_id, o.answer_text
                FROM survey s
                LEFT JOIN survey_question sq ON s.survey_id = sq.survey_id
                LEFT JOIN question q ON sq.question_id = q.question_id
                LEFT JOIN question_offeredanswers qo ON q.question_id = qo.question_id
                LEFT JOIN offeredanswers o ON qo.offered_answers_id = o.offered_answers_id
                WHERE s.survey_id = ?
                ORDER BY q.question_id, o.offered_answers_id
            `;
    
            this.db.query(query, [surveyId], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
    
                // Daten zu Survey-Objekt zusammenführen
                const survey = new Survey(
                    results[0].survey_id,
                    results[0].title,
                    results[0].description,
                    results[0].created_by
                );
    
                const questionMap = new Map();
    
                results.forEach(row => {
                    if (!row.question_id) return;
    
                    if (!questionMap.has(row.question_id)) {
                        let question;
                        switch (row.type) {
                            case 'multiple':
                                question = new MultipleChoiceQuestion(
                                    row.question_id,
                                    row.question_text,
                                    [],
                                    row.multiple_selection === 1 // Konvertiere 1/0 zu boolean
                                );
                                break;
                            case 'scale':
                                question = new ScaleQuestion(
                                    row.question_id,
                                    row.question_text,
                                    row.min_value,
                                    row.max_value
                                );
                                break;
                            default:
                                question = new TextQuestion(
                                    row.question_id,
                                    row.question_text
                                );
                        }
                        questionMap.set(row.question_id, question);
                        survey.addQuestion(question);
                    }
    
                    // Optionen für Multiple Choice hinzufügen
                    if (row.offered_answers_id && row.type === 'multiple') {
                        const question = questionMap.get(row.question_id);
                        if (question instanceof MultipleChoiceQuestion) {
                            question.addOption(row.answer_text);
                        }
                    }
                });
    
                resolve(survey);
            });
        });
    }

    async submitResponse(surveyId, userId, answers) {
        return new Promise(async (resolve, reject) => {
            try {
                // Survey laden und validieren
                const survey = await this.getSurvey(surveyId);
                if (!survey) {
                    return reject(new Error('Survey not found'));
                }

                if (!survey.validate(answers)) {
                    return reject(new Error('Invalid answers'));
                }

                // Antworten speichern
                const response = new SurveyResponse(null, surveyId, userId, answers);
                
                this.db.beginTransaction(async (err) => {
                    if (err) return reject(err);

                    try {
                        // Für jede Antwort einen Eintrag erstellen
                        for (const [questionId, answer] of Object.entries(answers)) {
                            await this.insertAnswer(surveyId, questionId, userId, answer);
                        }

                        this.db.commit((err) => {
                            if (err) {
                                return this.db.rollback(() => reject(err));
                            }
                            resolve(response);
                        });
                    } catch (error) {
                        this.db.rollback(() => reject(error));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Hilfsmethoden für DB-Operationen
    insertSurvey(survey) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO survey (title, description, created_by, active) VALUES (?, ?, ?, ?)';
            this.db.query(query, [survey.title, survey.description, survey.createdBy, survey.active], 
                (err, result) => err ? reject(err) : resolve(result));
        });
    }

    insertQuestion(question) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO question (question_text, type, min_value, max_value, multiple_selection) VALUES (?, ?, ?, ?, ?)';
            const params = [
                question.questionText, 
                question.type,
                question instanceof ScaleQuestion ? question.minValue : null,
                question instanceof ScaleQuestion ? question.maxValue : null,
                question instanceof MultipleChoiceQuestion ? (question.multipleSelection ? 1 : 0) : 0
            ];
            this.db.query(query, params, (err, result) => err ? reject(err) : resolve(result));
        });
    }

    insertOption(option) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO offeredanswers (answer_text) VALUES (?)';
            this.db.query(query, [option.text], (err, result) => err ? reject(err) : resolve(result));
        });
    }

    linkSurveyQuestion(surveyId, questionId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO survey_question (survey_id, question_id) VALUES (?, ?)';
            this.db.query(query, [surveyId, questionId], (err, result) => err ? reject(err) : resolve(result));
        });
    }

    linkQuestionOption(questionId, optionId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO question_offeredanswers (question_id, offered_answers_id) VALUES (?, ?)';
            this.db.query(query, [questionId, optionId], (err, result) => err ? reject(err) : resolve(result));
        });
    }

    insertAnswer(surveyId, questionId, userId, answer) {
        return new Promise((resolve, reject) => {
            // Zuerst alte Antworten löschen
            const deleteQuery = 'DELETE FROM answer WHERE survey_id = ? AND question_id = ? AND user_id = ?';
            
            this.db.query(deleteQuery, [surveyId, questionId, userId], (deleteErr) => {
                if (deleteErr) return reject(deleteErr);
                
                // Bei Multiple Choice mit Mehrfachauswahl: Mehrere Einträge
                if (Array.isArray(answer)) {
                    if (answer.length === 0) {
                        // Keine Antworten ausgewählt
                        return resolve(null);
                    }
                    
                    const promises = answer.map(optionIndex => {
                        // Erst die korrekte offered_answers_id für den Index finden
                        return new Promise((res, rej) => {
                            const query = `
                                SELECT oa.offered_answers_id 
                                FROM offeredanswers oa
                                JOIN question_offeredanswers qoa ON oa.offered_answers_id = qoa.offered_answers_id
                                WHERE qoa.question_id = ?
                                ORDER BY oa.offered_answers_id
                                LIMIT 1 OFFSET ?
                            `;
                            this.db.query(query, [questionId, optionIndex], (err, results) => {
                                if (err) {
                                    return rej(err);
                                }
                                if (results.length === 0) {
                                    return rej(new Error(`No option found at index ${optionIndex}`));
                                }
                                
                                const correctOptionId = results[0].offered_answers_id;
                                const insertQuery = 'INSERT INTO answer (survey_id, question_id, user_id, offered_answers_id) VALUES (?, ?, ?, ?)';
                                this.db.query(insertQuery, [surveyId, questionId, userId, correctOptionId], 
                                    (err, result) => err ? rej(err) : res(result));
                            });
                        });
                    });
                    Promise.all(promises).then(resolve).catch(reject);
                } else if (typeof answer === 'number' && !Number.isNaN(answer) && questionId) {
                    // Für einzelne Multiple-Choice-Antworten
                    // Erst die korrekte offered_answers_id für den Index finden
                    const query = `
                        SELECT oa.offered_answers_id 
                        FROM offeredanswers oa
                        JOIN question_offeredanswers qoa ON oa.offered_answers_id = qoa.offered_answers_id
                        WHERE qoa.question_id = ?
                        ORDER BY oa.offered_answers_id
                        LIMIT 1 OFFSET ?
                    `;
                    this.db.query(query, [questionId, answer], (err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        if (results.length === 0) {
                            return reject(new Error(`No option found at index ${answer}`));
                        }
                        
                        const correctOptionId = results[0].offered_answers_id;
                        const insertQuery = 'INSERT INTO answer (survey_id, question_id, user_id, offered_answers_id) VALUES (?, ?, ?, ?)';
                        this.db.query(insertQuery, [surveyId, questionId, userId, correctOptionId], 
                            (err, result) => err ? reject(err) : resolve(result));
                    });
                } else {
                    // Für Textantworten und Skala
                    const query = 'INSERT INTO answer (survey_id, question_id, user_id, text_answer, scale_answer) VALUES (?, ?, ?, ?, ?)';
                    const params = [
                        surveyId,
                        questionId,
                        userId,
                        typeof answer === 'string' ? answer : null, // für Textantworten
                        typeof answer === 'number' ? answer : null // für Skala
                    ];
                    this.db.query(query, params, (err, result) => err ? reject(err) : resolve(result));
                }
            });
        });
    }

    async getSurveyResults(surveyId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    a.answer_id,
                    a.user_id,
                    a.offered_answers_id,
                    a.text_answer,
                    a.scale_answer,
                    q.question_id,
                    q.question_text,
                    q.type,
                    o.answer_text as option_text,
                    u.firstname,
                    u.lastname
                FROM answer a
                JOIN question q ON a.question_id = q.question_id
                LEFT JOIN offeredanswers o ON a.offered_answers_id = o.offered_answers_id
                JOIN user u ON a.user_id = u.user_id
                WHERE a.survey_id = ?
                ORDER BY a.user_id, q.question_id
            `;

            this.db.query(query, [surveyId], (err, results) => {
                if (err) return reject(err);

                // Gruppiere Ergebnisse nach Benutzer und Frage
                const responsesByUser = {};
                
                results.forEach(row => {
                    if (!responsesByUser[row.user_id]) {
                        responsesByUser[row.user_id] = {
                            userId: row.user_id,
                            userName: `${row.firstname} ${row.lastname}`,
                            answers: {}
                        };
                    }

                    if (!responsesByUser[row.user_id].answers[row.question_id]) {
                        responsesByUser[row.user_id].answers[row.question_id] = {
                            questionId: row.question_id,
                            questionText: row.question_text,
                            type: row.type,
                            answer: null
                        };
                    }

                    // Setze die Antwort basierend auf dem Typ
                    switch (row.type) {
                        case 'multiple':
                            if (!responsesByUser[row.user_id].answers[row.question_id].answer) {
                                responsesByUser[row.user_id].answers[row.question_id].answer = [];
                            }
                            responsesByUser[row.user_id].answers[row.question_id].answer.push({
                                optionId: row.offered_answers_id,
                                optionText: row.option_text
                            });
                            break;
                        case 'text':
                            responsesByUser[row.user_id].answers[row.question_id].answer = row.text_answer;
                            break;
                        case 'scale':
                            responsesByUser[row.user_id].answers[row.question_id].answer = row.scale_answer;
                            break;
                    }
                });

                // Konvertiere zu Array
                const formattedResults = Object.values(responsesByUser);
                resolve(formattedResults);
            });
        });
    }
}

module.exports = SurveyService;