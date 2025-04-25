// Repräsentiert eine einzelne Frage in einer Umfrage
export interface Question {
  // Der Fragetext, der dem Nutzer angezeigt wird
  text: string;

  // Der Typ der Antwort: 
  // 'checkbox' = Mehrfachauswahl,
  // 'open' = Freitextantwort,
  // 'scale' = Skala (z. B. 1 bis 5)
  answerType: 'checkbox' | 'open' | 'scale';

  // Optional: Liste möglicher Antwortoptionen (nur bei 'checkbox')
  options?: string[];

  // Optional: Prozentuale Verteilung der Antworten für jede Option
  // (z. B. für Ergebnisanzeige bei Checkbox-Fragen)
  optionPercentages?: number[];

  // Optional: Skalenwert (z. B. 4 bei Bewertung von 1 bis 5)
  // Gilt nur für Fragen vom Typ 'scale'
  scaleValue?: number;

  // Optional: Prozentualer Anteil einer bestimmten Skalenantwort
  // (z. B. 35% haben die Skala mit 4 bewertet)
  answerPercentage?: number;

  // Optional: Array von tatsächlichen Antworten bei offenen Fragen
  // oder gewählten Optionen bei Checkbox-Fragen
  answerField?: string[];
}

// Repräsentiert eine gesamte Umfrage, die mehrere Fragen enthält
export interface Survey {
  // Der Titel der Umfrage
  title: string;

  // Liste der Fragen in dieser Umfrage
  questions: Question[];

  // Optional: Der aktuelle Status der Umfrage
  // 'ongoing' = läuft noch,
  // 'completed' = abgeschlossen
  status?: 'ongoing' | 'completed';
}