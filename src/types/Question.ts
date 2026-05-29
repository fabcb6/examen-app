export type QuestionType = 'multiple_choice' | 'short_answer' | 'coding';

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  enunciado: string;
  puntos: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  opciones: string[];
  respuestaCorrecta?: number;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer';
}

export interface CodingQuestion extends BaseQuestion {
  type: 'coding';
  starterCode?: string;
}

export type Question = MultipleChoiceQuestion | ShortAnswerQuestion | CodingQuestion;

export interface StudentInfo {
  nombre: string;
  carnet: string;
}
