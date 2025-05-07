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