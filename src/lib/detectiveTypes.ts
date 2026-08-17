export type DetectiveCase = {
  title: string;
  location: string;
  time: string;
  image: string;
  imageAlt: string;
  people: Array<{ name: string; role: string; statement: string }>;
  scene: string;
  clues: string[];
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};
