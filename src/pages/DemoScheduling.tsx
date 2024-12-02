import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { trackPage } from '@/lib/analytics';

const DemoScheduling = () => {
  useEffect(() => {
    // Load the Avantto CRM form script
    const script = document.createElement('script');
    script.src = "https://api.avanttocrm.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Track page view
    trackPage({
      title: 'Schedule Demo',
      path: '/schedule-demo'
    });

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="py-8 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Schedule a Demo</h1>
          <p className="text-muted-foreground">
            Book a personalized demo to see how our platform can help your business grow.
          </p>
        </div>

        <Card className="shadow-none border-0">
          <div className="aspect-[3/2] w-full">
            <iframe 
              src="https://api.avanttocrm.com/widget/group/5PcrL3brY1OUJyWdG1lw" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              scrolling="no" 
              id="5PcrL3brY1OUJyWdG1lw_1732990660013"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DemoScheduling;