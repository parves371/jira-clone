import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button> Click me  </Button>
      <Button variant="destructive"> destructive </Button>
      <Button variant="outline"> outline  </Button>
      <Button variant="secondary"> secondary  </Button>
      <Button variant="ghost"> ghost </Button>
      <Button variant="muted"> muted  </Button>
      <Button variant="teritary"> teritary </Button>
    </div>
  );
}
