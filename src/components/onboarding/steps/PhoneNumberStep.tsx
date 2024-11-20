import { Button } from "@/components/ui/button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PhoneNumberStepProps {
  value: string;
  onAnswer: (phone: string) => void;
  onComplete: () => void;
}

export const PhoneNumberStep = ({ value, onAnswer, onComplete }: PhoneNumberStepProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!user?.id) {
      toast.error('Authentication error. Please try logging in again.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          phone: value,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Onboarding completed successfully');
      onComplete();
      navigate('/start-here');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          What's your phone number?
        </h2>
        <p className="text-gray-500 text-base sm:text-lg">
          We'll use this to keep you updated on your project progress.
        </p>
      </div>

      <div className="phone-input-container [&_.react-tel-input]:w-full [&_.react-tel-input_.form-control]:!w-full [&_.react-tel-input_.flag-dropdown]:!h-14 [&_.react-tel-input_.selected-flag]:!h-14 [&_.react-tel-input_.flag-dropdown]:!border-input [&_.react-tel-input_.flag-dropdown]:border-r-0">
        <PhoneInput
          country={'us'}
          value={value}
          onChange={(phone) => onAnswer(phone)}
          containerClass="w-full"
          inputClass="!w-full !h-14 !text-lg !p-4 !pl-14 !border !border-input !rounded-md"
          buttonClass="!border-input !h-14 !w-12"
          dropdownClass="!w-[300px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-lg bg-primary text-white hover:bg-primary/90"
        disabled={!value}
      >
        Complete Onboarding
      </Button>
    </form>
  );
};