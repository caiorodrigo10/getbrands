import CatalogLayout from "@/components/catalog/CatalogLayout";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { trackCatalogViewed } from "@/lib/analytics/pages";

const Catalog = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    trackCatalogViewed({
      category: searchParams.get("category"),
      type: searchParams.get("type"),
      audience: searchParams.get("audience"),
      purpose: searchParams.get("purpose"),
      dietary: searchParams.get("dietary"),
    });
  }, [searchParams]);

  return <CatalogLayout />;
};

export default Catalog;