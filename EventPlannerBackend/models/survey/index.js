// BaseQuestion Klasse
class BaseQuestion {
    constructor(id, questionText, type) {
        this.id = id;
        this.questionText = questionText;
        this.type = type;
    }

    validate(answer) {
        throw new Error('validate() must be implemented by subclass');
    }

    toJSON() {
        return {
            id: this.id,
            questionText: this.questionText,
            type: this.type
        };
    }

    static createFromData(questionData) {
        switch (questionData.type) {
            case 'multiple':
                return new MultipleChoiceQuestion(
                    questionData.id,
                    questionData.questionText,
                    questionData.options,
                    questionData.multipleSelection
                );
            case 'scale':
                return new ScaleQuestion(
                    questionData.id,
                    questionData.questionText,
                    questionData.minValue,
                    questionData.maxValue
                );
            case 'text':
                return new TextQuestion(
                    questionData.id,
                    questionData.questionText,
                    questionData.maxLength
                );
            default:
                throw new Error(`Unknown question type: ${questionData.type}`);
        }
    }
}

// QuestionOption Klasse
class QuestionOption {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text
        };
    }
}

// MultipleChoiceQuestion Klasse
class MultipleChoiceQuestion extends BaseQuestion {
    constructor(id, questionText, options = [], multipleSelection = false) {
        super(id, questionText, 'multiple');
        this.options = options.map((opt, index) => new QuestionOption(index, opt));
        this.multipleSelection = multipleSelection;
    }

    validate(answer) {
        if (this.multipleSelection) {
            return Array.isArray(answer) && 
                   answer.every(value => this.options.some(opt => opt.id === value));
        } else {
            return this.options.some(opt => opt.id === answer);
        }
    }

    addOption(optionText) {
        const newId = this.options.length;
        this.options.push(new QuestionOption(newId, optionText));
    }

    toJSON() {
        return {
            ...super.toJSON(),
            options: this.options.map(opt => opt.toJSON()),
            multipleSelection: this.multipleSelection
        };
    }
}

// TextQuestion Klasse
class TextQuestion extends BaseQuestion {
    constructor(id, questionText, maxLength = 500) {
        super(id, questionText, 'text');
        this.maxLength = maxLength;
    }

    validate(answer) {
        return typeof answer === 'string' && answer.length <= this.maxLength;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            maxLength: this.maxLength
        };
    }
}

// ScaleQuestion Klasse
class ScaleQuestion extends BaseQuestion {
    constructor(id, questionText, minValue = 1, maxValue = 5) {
        super(id, questionText, 'scale');
        this.minValue = minValue;
        this.maxValue = maxValue;
    }

    validate(answer) {
        return typeof answer === 'number' && 
               answer >= this.minValue && 
               answer <= this.maxValue;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            minValue: this.minValue,
            maxValue: this.maxValue
        };
    }
}

// Survey Klasse
class Survey {
    constructor(id, title, description, createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
        this.questions = [];
        this.active = true;
        this.createdAt = new Date();
    }

    addQuestion(question) {
        if (!(question instanceof BaseQuestion)) {
            throw new Error('Only BaseQuestion instances can be added');
        }
        this.questions.push(question);
    }

    removeQuestion(questionId) {
        this.questions = this.questions.filter(q => q.id !== questionId);
    }

    validate(answers) {
        return this.questions.every(question => {
            const answer = answers[question.id];
            return answer === undefined || question.validate(answer);
        });
    }

    getQuestion(questionId) {
        return this.questions.find(q => q.id === questionId);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            createdBy: this.createdBy,
            questions: this.questions.map(q => q.toJSON()),
            active: this.active,
            createdAt: this.createdAt
        };
    }

    static fromJSON(json) {
        const survey = new Survey(json.id, json.title, json.description, json.createdBy);
        survey.active = json.active;
        survey.createdAt = new Date(json.createdAt);
        
        json.questions.forEach(questionData => {
            const question = BaseQuestion.createFromData(questionData);
            survey.addQuestion(question);
        });
        
        return survey;
    }
}

// SurveyResponse Klasse
class SurveyResponse {
    constructor(id, surveyId, userId, answers) {
        this.id = id;
        this.surveyId = surveyId;
        this.userId = userId;
        this.answers = answers;
        this.submittedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            surveyId: this.surveyId,
            userId: this.userId,
            answers: this.answers,
            submittedAt: this.submittedAt
        };
    }
}

// Exportiere alle Klassen
module.exports = {
    BaseQuestion,
    MultipleChoiceQuestion,
    TextQuestion,
    ScaleQuestion,
    QuestionOption,
    Survey,
    SurveyResponse
};