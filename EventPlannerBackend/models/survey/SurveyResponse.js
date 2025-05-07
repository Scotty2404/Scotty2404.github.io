class SurveyResponse {
    constructor(id, surveyId, userId, answers) {
        this.id = id;
        this.surveyId = surveyId;
        this.userId = userId;
        this.answers = answers; // { questionId: answer }
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

module.exports = {
    BaseQuestion,
    MultipleChoiceQuestion,
    TextQuestion,
    ScaleQuestion,
    QuestionOption,
    Survey,
    SurveyResponse
};