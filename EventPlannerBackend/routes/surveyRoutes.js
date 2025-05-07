// EventPlannerBackend/routes/surveyRoutes.js
const express = require('express');
const router = express.Router();
const SurveyService = require('../services/SurveyService');
const { authMiddleware } = require('./authRoutes');

// Survey erstellen
router.post('/create', authMiddleware, async (req, res) => {
    try {
        // Initialisiere Survey-Service mit der globalen Datenbankverbindung bei jedem Request
        const surveyService = new SurveyService(global.db);
        
        const surveyData = req.body;
        const userId = req.user;

        // Transformiere Frontend-Daten in das benötigte Format
        const transformedData = {
            title: surveyData.title || 'Neue Umfrage',
            description: surveyData.description || '',
            questions: surveyData.questions.map(q => {
                // Erkenne den Fragentyp basierend auf den Daten
                let type = 'text'; // Standard
                if (q.answerType === 'multiple') {
                    type = 'multiple';
                } else if (q.answerType === 'scale') {
                    type = 'scale';
                } else if (q.answerType === 'open') {
                    type = 'text';
                }

                return {
                    question_text: q.question,
                    type: type,
                    answers: q.answers || [],
                    multipleSelection: q.multipleSelection || false,
                    minValue: q.minValue || 1,
                    maxValue: q.maxValue || 5,
                    maxLength: q.maxLength || 500
                };
            })
        }; 

        const survey = await surveyService.createSurvey(transformedData, userId);
        res.status(201).json({
            success: true,
            survey_id: survey.id,
            data: survey.toJSON()
        });
    } catch (error) {
        console.error('Error creating survey:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create survey',
            message: error.message 
        });
    }
});

// Survey abrufen
router.get('/:surveyId', async (req, res) => {
    try {
        const surveyService = new SurveyService(global.db);
        const surveyId = req.params.surveyId;
        const survey = await surveyService.getSurvey(surveyId);
        
        if (!survey) {
            return res.status(404).json({ 
                success: false,
                error: 'Survey not found' 
            });
        }

        res.json({
            success: true,
            data: survey.toJSON()
        });
    } catch (error) {
        console.error('Error getting survey:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to get survey',
            message: error.message 
        });
    }
});

// Survey beantworten
router.post('/:surveyId/response', authMiddleware, async (req, res) => {
    try {
        const surveyService = new SurveyService(global.db);
        const surveyId = req.params.surveyId;
        const userId = req.user;
        const answers = req.body.answers;

        const response = await surveyService.submitResponse(surveyId, userId, answers);
        res.status(201).json({
            success: true,
            message: 'Response submitted successfully',
            data: response.toJSON()
        });
    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to submit response',
            message: error.message 
        });
    }
});

// Ergebnisse einer Umfrage abrufen
router.get('/:surveyId/results', authMiddleware, async (req, res) => {
    try {
        const surveyService = new SurveyService(global.db);
        const surveyId = req.params.surveyId;
        
        // Lade die Umfrage
        const survey = await surveyService.getSurvey(surveyId);
        if (!survey) {
            return res.status(404).json({ 
                success: false,
                error: 'Survey not found' 
            });
        }

        // Prüfe, ob der Benutzer der Ersteller ist
        if (survey.createdBy !== req.user) {
            return res.status(403).json({ 
                success: false,
                error: 'Not authorized to view results' 
            });
        }

        // Lade die Antworten
        const results = await surveyService.getSurveyResults(surveyId);
        res.json({
            success: true,
            data: {
                survey: survey.toJSON(),
                results: results
            }
        });
    } catch (error) {
        console.error('Error getting survey results:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to get survey results',
            message: error.message 
        });
    }
});

router.post('/:surveyId/complete', authMiddleware, async (req, res) => {
    try {
        const surveyService = new SurveyService(global.db);
        const surveyId = req.params.surveyId;
        
        // Check if the user has permission to complete this survey
        const survey = await surveyService.getSurvey(surveyId);
        if (!survey) {
            return res.status(404).json({ 
                success: false,
                error: 'Survey not found' 
            });
        }

        // Check if the user is the creator of the survey
        if (survey.createdBy !== req.user) {
            return res.status(403).json({ 
                success: false,
                error: 'Not authorized to complete this survey' 
            });
        }

        // Mark the survey as completed
        await surveyService.completeSurvey(surveyId);
        
        res.json({
            success: true,
            message: 'Survey marked as completed'
        });
    } catch (error) {
        console.error('Error completing survey:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to complete survey',
            message: error.message 
        });
    }
});

module.exports = router;