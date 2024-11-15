import { ReactNode } from "react";

interface ProductFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const ProductFormSection = ({ title, description, children }: ProductFormSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {children}
      </div>
    </div>
  );
};