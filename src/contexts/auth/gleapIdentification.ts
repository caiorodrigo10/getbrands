import Gleap from "gleap";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const identifyUserInGleap = async (currentUser: User | null) => {
  if (currentUser) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", currentUser.id);

      const mainProject = projects && projects.length > 0 ? projects[0] : null;

      const userData = {
        userId: currentUser.id,
        email: currentUser.email,
        name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : currentUser.email?.split('@')[0],
        phone: profile?.phone || '',
        value: 0,
        companyId: mainProject?.id || '',
        companyName: mainProject?.name || '',
        plan: mainProject?.pack_type || 'none',
        customData: {
          role: profile?.role || 'member',
          user_type: profile?.user_type || 'member',
          projects_count: projects?.length || 0,
          created_at: profile?.created_at,
          shipping_address: profile?.shipping_address_street 
            ? `${profile.shipping_address_street}, ${profile.shipping_address_city}, ${profile.shipping_address_state} ${profile.shipping_address_zip}`
            : '',
        }
      };

      Gleap.identify(userData.userId, userData);
    } catch (error) {
      console.error('Error identifying user in Gleap:', error);
      if (currentUser.email) {
        Gleap.identify(currentUser.id, {
          email: currentUser.email,
          name: currentUser.email.split('@')[0],
        });
      }
    }
  } else {
    Gleap.clearIdentity();
  }
};