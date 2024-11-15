import Cal from "@calcom/embed-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

interface ProjectMeeting {
  id: string;
  project_id: string;
  user_id: string;
  scheduled_for: string;
  scheduled_at: string;
  meeting_link?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const CalendarStage = () => {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Initialize Cal.com and handle booking events
  useEffect(() => {
    const cal = (window as any).Cal;
    if (!cal) {
      console.error("Cal.com widget not loaded");
      return;
    }

    // Wait for Cal to be ready
    const initCalendar = async () => {
      try {
        // Add event listener
        cal("on", {
          action: "bookingSuccessful",
          callback: (event: any) => {
            if (!event.detail?.startTime) {
              console.error("No start time provided in booking event:", event);
              toast.error("Failed to schedule meeting. Please try again.");
              return;
            }

            if (!user?.id || !projectId) {
              console.error("Missing user ID or project ID");
              toast.error("Authentication error. Please try again.");
              return;
            }

            logMeetingMutation.mutate({
              project_id: projectId,
              user_id: user.id,
              scheduled_for: new Date(event.detail.startTime).toISOString(),
              meeting_link: event.detail.meetingLink,
              status: "scheduled"
            });
          },
        });
      } catch (error) {
        console.error("Error initializing calendar:", error);
        toast.error("Failed to initialize calendar. Please refresh the page.");
      }
    };

    initCalendar();

    // Cleanup
    return () => {
      try {
        cal("off", {
          action: "bookingSuccessful",
        });
      } catch (error) {
        console.error("Error cleaning up calendar:", error);
      }
    };
  }, [projectId, user]);

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Mutation to log meetings
  const logMeetingMutation = useMutation({
    mutationFn: async (meetingData: {
      project_id: string;
      user_id: string;
      scheduled_for: string;
      meeting_link?: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("project_meetings")
        .insert(meetingData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Meeting scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["project_meetings", projectId] });
    },
    onError: (error) => {
      console.error("Error logging meeting:", error);
      toast.error("Failed to save meeting details. Please try again.");
    },
  });

  // Query to fetch existing meetings
  const { data: meetings } = useQuery({
    queryKey: ["project_meetings", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_meetings")
        .select("*")
        .eq("project_id", projectId)
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data as ProjectMeeting[];
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-muted-foreground">Schedule a call with our team:</p>
        <div className="h-[600px] w-full">
          <Cal
            calLink="caio-apfelbaum/cafe-com-caio"
            style={{ width: "100%", height: "100%" }}
            config={{
              theme: "light",
              hideEventTypeDetails: "false",
              layout: "month_view",
              styles: {
                branding: "#4c1e6c",
                body: "#ffffff"
              }
            }}
            data-cal-namespace="lovable-calendar"
            data-cal-theme="light"
          />
        </div>
      </div>

      {meetings && meetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scheduled Meetings</h3>
          <div className="space-y-2">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="rounded-lg border p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {new Date(meeting.scheduled_for).toLocaleDateString()} at{" "}
                    {new Date(meeting.scheduled_for).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Scheduled on:{" "}
                    {new Date(meeting.created_at).toLocaleDateString()}
                  </p>
                </div>
                {meeting.meeting_link && (
                  <a
                    href={meeting.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};