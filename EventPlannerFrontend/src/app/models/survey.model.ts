export interface Question {
  text: string; // Die Frage selbst (früher als 'question' bezeichnet)
  answerType: 'checkbox' | 'open' | 'scale'; // Der Typ der Antwort (Checkboxen, offene Antwort, Skala)
  options?: string[]; // Für 'checkbox' Fragen, z. B. ['Option A', 'Option B']
  optionPercentages?: number[]; // Für 'checkbox' Fragen, z. B. [45, 55] → Prozentwerte passend zu den Optionen
  answerPercentage?: number; // Nur für 'scale' Fragen, z. B. 75
  answerField?: string[]; // Nur für 'open' Fragen, hier kommen die Antwort-Felder rein
  scaleValue?: number; // Wert für Skala (optional, um für 'scale' Antworten zu verwenden)
}

export interface Survey {
  title: string;
  questions: Question[];
  status?: 'ongoing' | 'draft' | 'completed';
}