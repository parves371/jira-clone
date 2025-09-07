import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogOverlay } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

interface ResposiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResposiveModal = ({
  children,
  open,
  onOpenChange,
}: ResposiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-y-auto hide-scrollbar max-h-[85vh]">
        {children}
      </DrawerContent>
    </Drawer>
  );
};
