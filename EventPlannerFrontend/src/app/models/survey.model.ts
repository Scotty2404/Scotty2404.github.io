export interface Question {
  text: string;
  answerType: 'checkbox' | 'open' | 'scale';

  options?: string[];
  optionPercentages?: number[];

  scaleValue?: number;
  answerPercentage?: number;

  answerField?: string[];
}

export interface Survey {
  title: string;
  questions: Question[];
  status?: 'ongoing' | 'completed';
}