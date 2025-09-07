import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader2Icon className="animate-spin size-6 text-muted-foreground" />
    </div>
  );
};

export default Loading;
