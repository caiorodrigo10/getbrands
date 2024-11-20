import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const onboardingSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  profile_type: z.enum(['creator', 'entrepreneur', 'marketer']),
  product_interest: z.array(z.string()),
  brand_status: z.enum(['existing', 'new']),
  launch_urgency: z.enum(['immediate', 'one_to_three', 'flexible'])
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export const saveOnboardingData = async (userId: string, data: OnboardingData) => {
  try {
    // Validate the data
    onboardingSchema.parse(data);

    const { error } = await supabase
      .from('profiles')
      .update({
        phone: data.phone,
        profile_type: data.profile_type,
        product_interest: data.product_interest.join(','), // Convert array to comma-separated string
        brand_status: data.brand_status,
        launch_urgency: data.launch_urgency,
        onboarding_completed: true
      })
      .eq('id', userId);

    if (error) throw error;

    return { status: 'success', message: 'Onboarding data saved successfully.' };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return {
      status: 'error',
      message: 'Failed to save onboarding data. Please check your input and try again.'
    };
  }
};