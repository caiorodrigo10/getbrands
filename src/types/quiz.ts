export type QuizAnswer = {
  questionId: string;
  answer: string | string[];
};

export type QuizStep = {
  id: string;
  title: string;
  description?: string;
  type: 'single' | 'multiple';
  options?: {
    id: string;
    label: string;
    description?: string;
  }[];
};