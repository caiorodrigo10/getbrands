// Empty implementations to maintain API compatibility
export const trackOnboardingStarted = (userId: string) => {};
export const trackOnboardingStepCompleted = (
  step: number,
  stepName: string,
  data?: Record<string, any>
) => {};
export const trackOnboardingCompleted = (userId: string) => {};
export const trackOnboardingAbandoned = (step: number) => {};