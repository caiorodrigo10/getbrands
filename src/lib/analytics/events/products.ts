import { ProductEvent } from "@/types/analytics/events";
import { waitForAnalytics } from "../index";
import { Product } from "@/types/product";

export const trackProductView = async (product: Product, additionalData?: Partial<ProductEvent>) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Viewed', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      fromPrice: product.from_price,
      srp: product.srp,
      profitMargin: product.srp - product.from_price,
      isNew: product.is_new,
      isTiktok: product.is_tiktok,
      imageUrl: product.image_url,
      description: product.description,
      ...additionalData,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking product view:', error);
    }
  }
};

export const trackProductSelection = async (product: Product, projectData: { id: string; name: string }) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Selected', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      fromPrice: product.from_price,
      srp: product.srp,
      profitMargin: product.srp - product.from_price,
      projectId: projectData.id,
      projectName: projectData.name,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking product selection:', error);
    }
  }
};

export const trackProductSearch = async (searchTerm: string, resultsCount: number) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Search', {
      searchTerm,
      resultsCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking product search:', error);
    }
  }
};

export const trackProductFilter = async (filters: Record<string, any>, resultsCount: number) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Filter Applied', {
      filters,
      resultsCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking product filter:', error);
    }
  }
};

export const trackProductCalculatorUsage = async (product: Product, calculatedData: {
  sellingPrice: number;
  profit: number;
  quantity: number;
}) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Calculator Used', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      fromPrice: product.from_price,
      srp: product.srp,
      sellingPrice: calculatedData.sellingPrice,
      profit: calculatedData.profit,
      quantity: calculatedData.quantity,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking calculator usage:', error);
    }
  }
};