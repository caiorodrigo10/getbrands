import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const CalendarStage = () => {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      scheduled_for: string;
      meeting_link?: string;
    }) => {
      const { data, error } = await supabase
        .from("project_meetings")
        .insert({
          project_id: projectId,
          user_id: user?.id,
          scheduled_for: meetingData.scheduled_for,
          meeting_link: meetingData.meeting_link,
        })
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
      toast.error("Failed to log meeting. Please try again.");
    },
  });

  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        if (cal) {
          cal("ui", {
            theme: "light",
            styles: { branding: { brandColor: "#4c1e6c" } },
            hideEventTypeDetails: false,
          });

          // Pre-fill user data when available
          if (profile) {
            cal("preload", {
              email: profile.email,
              name: `${profile.first_name} ${profile.last_name}`.trim(),
              notes: `Project ID: ${projectId}`,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing Cal:", error);
      }
    })();
  }, [profile, projectId]);

  // Handle successful booking
  useEffect(() => {
    const handleCalendarEvent = (e: CustomEvent) => {
      if (e.detail.type === "booking_successful") {
        const booking = e.detail.data;
        logMeetingMutation.mutate({
          scheduled_for: booking.startTime,
          meeting_link: booking.meetingLink,
        });
      }
    };

    // Add event listener for Cal.com booking events
    window.addEventListener("cal:booking", handleCalendarEvent as EventListener);

    return () => {
      window.removeEventListener("cal:booking", handleCalendarEvent as EventListener);
    };
  }, [logMeetingMutation]);

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
      return data;
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
              layout: "month_view",
            }}
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
                    {new Date(meeting.scheduled_at).toLocaleDateString()}
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