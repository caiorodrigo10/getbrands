
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Video } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar_url?: string;
}

interface Meeting {
  id: string;
  project?: {
    name: string;
  };
  scheduled_for: string;
  meeting_link?: string;
  participants: Participant[];
}

interface UpcomingMeetingsProps {
  meetings: Meeting[];
}

const UpcomingMeetings = ({ meetings = [] }: UpcomingMeetingsProps) => {
  // No need for example meetings - they're provided directly from the hook now
  const displayMeetings = meetings;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
      </div>
      <div className="space-y-4">
        {displayMeetings.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No upcoming meetings scheduled</p>
        ) : (
          displayMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:border-primary/50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-foreground">{meeting.project?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(meeting.scheduled_for).toLocaleDateString()} at{" "}
                  {new Date(meeting.scheduled_for).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {meeting.participants.map((participant) => (
                      <Avatar key={participant.id} className="border-2 border-background">
                        <AvatarImage src={participant.avatar_url} alt={participant.name} />
                        <AvatarFallback>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    {meeting.participants.map(p => p.name).join(', ')}
                  </span>
                </div>
                {meeting.meeting_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-primary text-primary hover:bg-primary/5"
                    asChild
                  >
                    <a
                      href={meeting.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Join Meeting
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default UpcomingMeetings;
