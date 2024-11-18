import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Package2, Palette, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function GetStarted() {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Welcome to Your Brand Journey!</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's start building your brand. Choose where you'd like to begin:
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Package2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Browse Products</h3>
          <p className="text-muted-foreground">
            Explore our catalog of high-quality products ready for your brand
          </p>
          <Link to="/catalog">
            <Button className="w-full">
              View Catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Create Your Brand</h3>
          <p className="text-muted-foreground">
            Start a new project and define your brand identity
          </p>
          <Link to="/projects">
            <Button className="w-full">
              Start Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Request Samples</h3>
          <p className="text-muted-foreground">
            Try our products before making your final decision
          </p>
          <Link to="/sample-orders">
            <Button className="w-full">
              Order Samples
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}