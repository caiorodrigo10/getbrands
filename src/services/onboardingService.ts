import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Updated phone regex to handle formatted US phone numbers
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

export const onboardingSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Phone number must be in format (XXX) XXX-XXXX'),
  profile_type: z.enum(['creator', 'entrepreneur', 'marketer']),
  product_interest: z.array(z.string()),
  brand_status: z.enum(['existing', 'new']),
  launch_urgency: z.enum(['immediate', 'one_to_three', 'flexible'])
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export const saveOnboardingData = async (userId: string, data: OnboardingData) => {
  try {
    // Validate the data
    const validatedData = onboardingSchema.parse(data);

    const { error } = await supabase
      .from('profiles')
      .update({
        phone: validatedData.phone,
        profile_type: validatedData.profile_type,
        product_interest: validatedData.product_interest.join(','),
        brand_status: validatedData.brand_status,
        launch_urgency: validatedData.launch_urgency,
        onboarding_completed: true
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return { status: 'success', message: 'Onboarding completed successfully!' };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        message: error.errors[0].message || 'Invalid input data'
      };
    }
    return {
      status: 'error',
      message: 'Failed to save onboarding data. Please try again.'
    };
  }
};