import { Loader2Icon, LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoaderIcon className="animate-spin size-6 text-muted-foreground" />
    </div>
  );
};

export default Loading;
