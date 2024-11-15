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
  // Example meetings data if no meetings are provided
  const exampleMeetings: Meeting[] = meetings.length ? meetings : [
    {
      id: "1",
      project: { name: "Brand Identity Project" },
      scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      meeting_link: "https://meet.google.com/example",
      participants: [
        {
          id: "1",
          name: "Sarah Johnson",
          avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
          id: "2",
          name: "Michael Chen",
          avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        }
      ]
    },
    {
      id: "2",
      project: { name: "Package Design Review" },
      scheduled_for: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      meeting_link: "https://zoom.us/example",
      participants: [
        {
          id: "3",
          name: "Emily Davis",
          avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        }
      ]
    }
  ];

  const displayMeetings = meetings.length ? meetings : exampleMeetings;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
      </div>
      <div className="space-y-4">
        {displayMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex items-start gap-4 p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Calendar className="h-5 w-5 text-white mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-white">{meeting.project?.name}</p>
              <p className="text-sm text-white/80">
                {new Date(meeting.scheduled_for).toLocaleDateString()} at{" "}
                {new Date(meeting.scheduled_for).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {meeting.participants.map((participant) => (
                    <Avatar key={participant.id} className="border-2 border-primary">
                      <AvatarImage src={participant.avatar_url} alt={participant.name} />
                      <AvatarFallback>
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-white/80 ml-2">
                  {meeting.participants.map(p => p.name).join(', ')}
                </span>
              </div>
              {meeting.meeting_link && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 bg-white text-primary hover:bg-white/90"
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
        ))}
      </div>
    </Card>
  );
};

export default UpcomingMeetings;