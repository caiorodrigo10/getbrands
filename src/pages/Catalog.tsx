import CatalogLayout from "@/components/catalog/CatalogLayout";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { useSearchParams } from "react-router-dom";

const Catalog = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Track catalog view with any active filters
    trackEvent("Catalog Viewed", {
      filters: {
        category: searchParams.get("category"),
        type: searchParams.get("type"),
        audience: searchParams.get("audience"),
        purpose: searchParams.get("purpose"),
        dietary: searchParams.get("dietary"),
      }
    });
  }, [searchParams]);

  return <CatalogLayout />;
};

export default Catalog;