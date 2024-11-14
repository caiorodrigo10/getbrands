import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PackSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PackSelectionDialog = ({ open, onOpenChange }: PackSelectionDialogProps) => {
  const packs = [
    {
      name: "Pack Ultra",
      price: 7500,
      features: [
        "6 Products",
        "No Minimum Stock",
        "Naming",
        "Visual Identity",
        "Ecommerce",
        "Courses and Mentoring",
        "Multilingual Support",
        "Social Media Setup",
        "12x Social Media Posts",
        "4x Email Marketing Flows",
        "8x Blog Articles",
        "Affiliate Program"
      ],
      color: "bg-black"
    },
    {
      name: "Pack Premium",
      price: 5000,
      features: [
        "4 Products",
        "No Minimum Stock",
        "Naming",
        "Visual Identity",
        "Ecommerce",
        "Courses and Mentoring",
        "Multilingual Support",
        "Social Media Setup",
        "6x Social Media Posts",
        "2x Email Marketing Flows",
        "4x Blog Articles"
      ],
      color: "bg-purple-700"
    },
    {
      name: "Pack Basic",
      price: 3500,
      features: [
        "2 Products",
        "No Minimum Stock",
        "Naming",
        "Visual Identity",
        "Email Marketing",
        "Ecommerce",
        "Courses and Mentoring",
        "Multilingual Support",
        "Social Media Setup"
      ],
      color: "bg-teal-600"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">Select Your Pack</DialogTitle>
          <DialogDescription className="text-center max-w-2xl mx-auto">
            Explore our Ultra, Premium, and Basic Plans to find the perfect fit for your business.
            Each option offers tailored solutions for growth. Start your success journey today.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {packs.map((pack) => (
            <div key={pack.name} className={`${pack.color} text-white rounded-lg p-6 space-y-4`}>
              <h3 className="text-2xl font-bold">{pack.name}</h3>
              <ul className="space-y-2">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <p className="text-3xl font-bold">${pack.price}</p>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={() => window.location.href = "/checkout"}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackSelectionDialog;