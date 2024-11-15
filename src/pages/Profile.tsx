import { useAuth } from "@/contexts/AuthContext";

export const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;