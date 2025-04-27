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