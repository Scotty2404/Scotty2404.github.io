// Repräsentiert eine einzelne Frage in einer Umfrage
export interface Question {
  text: string;
  answerType: 'checkbox' | 'open' | 'scale';
  options?: string[];
  optionPercentages?: number[];
  scaleValue?: number;
  minValue?: number;
  maxValue?: number;
  answerPercentage?: number;
  answerField?: string[];
  multipleSelection?: number;
}

export interface Survey {
  id?: any;       
  survey_id?: any;
  title: string;
  questions: Question[];
  status?: 'ongoing' | 'completed';
}