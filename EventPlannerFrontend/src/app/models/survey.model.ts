export interface Question {
    question: string; // Der Text der Frage
    options: string[]; // Ein Array von Antwortmöglichkeiten
  }
  
  export interface Survey {
    title: string; // Der Titel der Umfrage
    questions: Question[]; // Ein Array von Fragen
  }