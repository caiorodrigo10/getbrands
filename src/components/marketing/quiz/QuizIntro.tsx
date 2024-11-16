import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizIntroProps {
  onStart: () => void;
}

export const QuizIntro = ({ onStart }: QuizIntroProps) => {
  return (
    <Card className="p-8 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-4">
          Create Your Brand Without Inventory Investment
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Launch your cosmetics, coffee, supplements, or pet brand with USA-based suppliers
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="font-semibold mb-2">No Inventory Investment</h3>
            <p className="text-sm text-muted-foreground">
              Start your brand without the burden of inventory costs
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="font-semibold mb-2">USA-Based Suppliers</h3>
            <p className="text-sm text-muted-foreground">
              Work with reliable, quality-focused American manufacturers
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          size="lg"
          onClick={onStart}
          className="mt-8"
        >
          Start Your Brand Journey
        </Button>
      </motion.div>
    </Card>
  );
};