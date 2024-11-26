import { trackEvent } from "./core";

export const trackButtonClick = (buttonId: string, buttonName: string, location: string) => {
  trackEvent("Button Clicked", {
    button_id: buttonId,
    button_name: buttonName,
    location: location,
  });
};

export const trackFormSubmitted = (formName: string, formData: Record<string, any>) => {
  trackEvent("Form Submitted", {
    form_name: formName,
    ...formData,
  });
};

export const trackError = (errorType: string, errorMessage: string, location: string) => {
  trackEvent("Error Encountered", {
    error_type: errorType,
    error_message: errorMessage,
    location: location,
  });
};

export const trackFeatureUsed = (featureName: string, details: Record<string, any>) => {
  trackEvent("Feature Used", {
    feature_name: featureName,
    ...details,
  });
};