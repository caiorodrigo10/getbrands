import { useAuth } from "@/contexts/AuthContext";

export const SampleRequest = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Request a Sample</h1>
      <p className="text-muted-foreground">
        Sample request form will be implemented here.
      </p>
    </div>
  );
};

export default SampleRequest;