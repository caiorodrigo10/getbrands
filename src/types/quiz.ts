export type QuizStep = {
  id: string;
  question: string;
  options: string[];
  type: "single" | "multiple";
};

export type OnboardingQuizData = {
  product_interest: string[];
  profile_type: string;
  brand_status: string;
  launch_urgency: string;
  phone: string;
};