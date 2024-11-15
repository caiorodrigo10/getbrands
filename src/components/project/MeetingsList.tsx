import { ProjectMeeting } from "@/types/meetings";

interface MeetingsListProps {
  meetings: ProjectMeeting[];
}

export const MeetingsList = ({ meetings }: MeetingsListProps) => {
  if (!meetings || meetings.length === 0) return null;

  return (
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
  );
};