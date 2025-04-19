export interface Question {
  text: string;
  answerType: 'checkbox' | 'open' | 'scale';
  options?: string[];                 // z. B. ['Option A', 'Option B']
  optionPercentages?: number[];      // z. B. [45, 55] → Prozentwerte passend zu den Optionen
  answerPercentage?: number;         // Nur für 'scale' Fragen
  answerField?: string[];            // Nur für 'open' Fragen
}

export interface Survey {
  title: string;
  questions: Question[];
}