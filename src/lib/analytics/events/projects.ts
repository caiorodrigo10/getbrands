import { trackEvent } from "../index";

interface ProjectEvent {
  projectId: string;
  projectName: string;
  packType?: string;
  status?: string;
}

interface ProjectProductEvent extends ProjectEvent {
  productId: string;
  productName: string;
  sellingPrice?: number;
}

export const trackProjectCreated = (data: ProjectEvent) => {
  trackEvent("Project Created", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectUpdated = (data: ProjectEvent) => {
  trackEvent("Project Updated", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectProductAdded = (data: ProjectProductEvent) => {
  trackEvent("Project Product Added", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectProductRemoved = (data: ProjectProductEvent) => {
  trackEvent("Project Product Removed", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectProductPriceUpdated = (data: ProjectProductEvent) => {
  trackEvent("Project Product Price Updated", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectStageCompleted = (data: ProjectEvent & { stageName: string }) => {
  trackEvent("Project Stage Completed", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectPointsUsed = (data: ProjectEvent & { pointsUsed: number, remainingPoints: number }) => {
  trackEvent("Project Points Used", {
    ...data,
    timestamp: new Date().toISOString()
  });
};