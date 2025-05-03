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