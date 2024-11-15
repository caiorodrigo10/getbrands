import Gleap from "gleap";
import { User } from "@supabase/supabase-js";

export const useGleapIdentity = () => {
  const identifyUserInGleap = (currentUser: User | null) => {
    if (currentUser) {
      Gleap.identify(currentUser.id, {
        email: currentUser.email,
        name: currentUser.email?.split('@')[0] || 'User',
      });
    } else {
      Gleap.clearIdentity();
    }
  };

  return { identifyUserInGleap };
};