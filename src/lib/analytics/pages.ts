import { trackEvent } from "./index";

export const trackCatalogViewed = (filters?: Record<string, any>) => {
  trackEvent("Catalog Viewed", {
    filters,
    timestamp: new Date().toISOString()
  });
};

export const trackDashboardViewed = () => {
  trackEvent("Dashboard Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackProfileViewed = () => {
  trackEvent("Profile Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackProjectsViewed = () => {
  trackEvent("Projects Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackProjectDetailsViewed = (projectId: string) => {
  trackEvent("Project Details Viewed", {
    projectId,
    timestamp: new Date().toISOString()
  });
};

export const trackProductsViewed = () => {
  trackEvent("Products Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackProductDetailsViewed = (productId: string) => {
  trackEvent("Product Details Viewed", {
    productId,
    timestamp: new Date().toISOString()
  });
};

export const trackDocumentsViewed = () => {
  trackEvent("Documents Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackSampleOrdersViewed = () => {
  trackEvent("Sample Orders Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackProfitCalculatorViewed = () => {
  trackEvent("Profit Calculator Viewed", {
    timestamp: new Date().toISOString()
  });
};

export const trackStartHereViewed = () => {
  trackEvent("Start Here Viewed", {
    timestamp: new Date().toISOString()
  });
};