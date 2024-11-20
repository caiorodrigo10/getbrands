import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Constants for database values
const BRAND_STATUS = {
  EXISTING: 'existing',
  NEW: 'new'
} as const;

const LAUNCH_URGENCY = {
  ASAP: 'asap',
  ONE_TO_THREE: '1-3_months',
  FLEXIBLE: 'flexible'
} as const;

// Updated validation schema to match database constraints
export const onboardingSchema = z.object({
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in format (XXX) XXX-XXXX'),
  profile_type: z.enum(['Creator/Influencer', 'Entrepreneur', 'Digital Marketer']),
  product_interest: z.array(z.string()),
  brand_status: z.enum(['I already have a brand', 'I\'m creating a new brand']),
  launch_urgency: z.enum(['As soon as possible', 'Within 1-3 months', 'Flexible timeline'])
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

// Helper functions to map frontend values to database values
const mapBrandStatus = (status: string): typeof BRAND_STATUS[keyof typeof BRAND_STATUS] => {
  switch (status) {
    case 'I already have a brand':
      return BRAND_STATUS.EXISTING;
    case 'I\'m creating a new brand':
      return BRAND_STATUS.NEW;
    default:
      throw new Error('Invalid brand status');
  }
};

const mapLaunchUrgency = (urgency: string): typeof LAUNCH_URGENCY[keyof typeof LAUNCH_URGENCY] => {
  switch (urgency) {
    case 'As soon as possible':
      return LAUNCH_URGENCY.ASAP;
    case 'Within 1-3 months':
      return LAUNCH_URGENCY.ONE_TO_THREE;
    case 'Flexible timeline':
      return LAUNCH_URGENCY.FLEXIBLE;
    default:
      throw new Error('Invalid launch urgency');
  }
};

export const saveOnboardingData = async (userId: string, data: OnboardingData) => {
  try {
    // Validate the data
    const validatedData = onboardingSchema.parse(data);

    // Format the data for database insertion
    const formattedData = {
      phone: validatedData.phone,
      profile_type: validatedData.profile_type,
      product_interest: validatedData.product_interest.join(','),
      brand_status: mapBrandStatus(validatedData.brand_status),
      launch_urgency: mapLaunchUrgency(validatedData.launch_urgency),
      onboarding_completed: true
    };

    const { error } = await supabase
      .from('profiles')
      .update(formattedData)
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