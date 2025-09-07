"use client";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

const route = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Task",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Mesmbers",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {route.map((item) => {
        const fullhrf = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullhrf;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link href={fullhrf} key={item.label}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-md hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />

              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
