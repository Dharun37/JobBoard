"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions";
import { ApplicationStatus } from "@prisma/client";
import { getApplicationStatusBadge } from "@/app/utils/applicationStatus";
import { toast } from "sonner";

interface ApplicationStatusUpdaterProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

const statusOptions: { value: ApplicationStatus; label: string; description: string }[] = [
  { value: "PENDING", label: "Pending", description: "Application submitted" },
  { value: "SEEN", label: "Seen", description: "Application viewed" },
  { value: "REVIEWED", label: "Under Review", description: "Currently evaluating" },
  { value: "SHORTLISTED", label: "Shortlisted", description: "Moved to next round" },
  { value: "SELECTED", label: "Selected", description: "Application selected!" },
  { value: "REJECTED", label: "Rejected", description: "Application declined" },
];

export function ApplicationStatusUpdater({ 
  applicationId, 
  currentStatus 
}: ApplicationStatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusUpdate = (newStatus: ApplicationStatus) => {
    setOptimisticStatus(newStatus);
    
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, newStatus);
        toast.success(`Application status updated to ${getApplicationStatusBadge(newStatus).label}`);
      } catch (error) {
        console.error("Failed to update status:", error);
        setOptimisticStatus(currentStatus); // Revert on error
        toast.error("Failed to update application status");
      }
    });
  };

  const currentStatusInfo = getApplicationStatusBadge(optimisticStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isPending}
          className="flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <span>{currentStatusInfo.icon}</span>
          )}
          <span>{currentStatusInfo.label}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {statusOptions.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => handleStatusUpdate(status.value)}
            disabled={isPending || status.value === optimisticStatus}
            className="flex flex-col items-start py-2"
          >
            <div className="flex items-center gap-2 w-full">
              <span>{getApplicationStatusBadge(status.value).icon}</span>
              <span className="font-medium">{status.label}</span>
            </div>
            <span className="text-xs text-muted-foreground pl-5">
              {status.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}