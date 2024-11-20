import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CompletionStep = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h1 className="text-4xl font-bold text-gray-900">
        Thank you!
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        We're setting up your experience. Get ready to create your brand!
      </p>
      <Button 
        onClick={() => navigate("/dashboard")}
        size="lg"
        className="mt-8 px-8 py-6 text-xl"
      >
        Continue to Dashboard
      </Button>
    </motion.div>
  );
};