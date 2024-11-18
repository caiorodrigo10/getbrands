import { Card } from "@/components/ui/card";

export default function StartHere() {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Welcome to Your Brand Journey!</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's start building your brand together. Watch our introduction video to learn more.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/your-video-id"
            title="Platform Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <p className="text-muted-foreground">
            Our platform is designed to help you create and grow your brand. Here's what you can do:
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Browse our catalog of high-quality products</li>
            <li>Request product samples</li>
            <li>Create your brand identity</li>
            <li>Design custom packaging</li>
            <li>Calculate potential profits</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}