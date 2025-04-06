
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const CATALOG_STATE_KEY = "catalog-state";

export const useCatalogState = () => {
  const [searchParams] = useSearchParams();

  // Save the current catalog state when visiting product pages
  useEffect(() => {
    // Store the current URL search parameters
    const catalogState = {
      page: searchParams.get("page") || "1",
      search: searchParams.get("search") || "",
      categories: searchParams.get("categories") || "",
    };
    
    // Only save if we're currently on the catalog page
    if (window.location.pathname === "/catalog") {
      sessionStorage.setItem(CATALOG_STATE_KEY, JSON.stringify(catalogState));
    }
  }, [searchParams]);

  // Get the previously saved catalog state
  const getSavedCatalogState = () => {
    const savedState = sessionStorage.getItem(CATALOG_STATE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  };

  return { getSavedCatalogState };
};
