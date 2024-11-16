import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ComparisonResultsProps {
  answers: Record<number, string>;
}

export const ComparisonResults = ({ answers }: ComparisonResultsProps) => {
  const navigate = useNavigate();

  const comparisonData = [
    {
      title: "Initial Investment",
      traditional: "$50,000+",
      mainer: "As low as $3,500",
    },
    {
      title: "Time to Market",
      traditional: "6-12 months",
      mainer: "4-8 weeks",
    },
    {
      title: "Inventory Risk",
      traditional: "High",
      mainer: "None",
    },
    {
      title: "Supply Chain Management",
      traditional: "Complex",
      mainer: "Handled by Mainer",
    },
  ];

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Brand Creation Comparison</h2>
        <p className="text-muted-foreground">
          See how Mainer's approach compares to traditional brand creation
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        {comparisonData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="grid grid-cols-3 gap-4 items-center"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-red-500 text-center">{item.traditional}</div>
            <div className="text-green-500 text-center font-semibold">{item.mainer}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate("/signup")}
        >
          Start Your Brand Today
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate("/how-it-works")}
        >
          See How Mainer Works
        </Button>
      </div>
    </Card>
  );
};