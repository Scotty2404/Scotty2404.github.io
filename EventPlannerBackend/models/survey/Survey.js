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
