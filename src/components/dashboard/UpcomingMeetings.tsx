import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface UpcomingMeetingsProps {
  meetings: any[];
}

const UpcomingMeetings = ({ meetings }: UpcomingMeetingsProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
      </div>
      <div className="space-y-4">
        {meetings?.map((meeting) => (
          <div
            key={meeting.id}
            className="flex items-start gap-4 p-4 bg-muted/10 rounded-lg"
          >
            <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">{meeting.project?.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(meeting.scheduled_for).toLocaleString()}
              </p>
              {meeting.meeting_link && (
                <a
                  href={meeting.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingMeetings;