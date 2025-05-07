class BaseQuestion {
    constructor(id, questionText, type) {
        this.id = id;
        this.questionText = questionText;
        this.type = type;
    }

    // Abstrakte Methode - muss von Unterklassen implementiert werden
    validate(answer) {
        throw new Error('validate() must be implemented by subclass');
    }

    // Gemeinsame Methode für alle Fragen
    toJSON() {
        return {
            id: this.id,
            questionText: this.questionText,
            type: this.type
        };
    }

    // Factory-Methode für Polymorphismus
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