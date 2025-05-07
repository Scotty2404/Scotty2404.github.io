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