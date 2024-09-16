import { RubricType } from "./RubricType";

export type QuestionType = {
  question: string;
  image: File | null;
  deadline: string;
  diagramType: string;
  rubric: RubricType;
};
