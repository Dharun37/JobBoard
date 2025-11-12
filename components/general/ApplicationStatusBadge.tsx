"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getApplicationStatusBadge, ApplicationStatus } from "@/app/utils/applicationStatus";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ApplicationStatusBadge({ 
  status, 
  showTooltip = true, 
  size = "md" 
}: ApplicationStatusBadgeProps) {
  const statusInfo = getApplicationStatusBadge(status);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  const badge = (
    <Badge 
      className={`${statusInfo.color} ${sizeClasses[size]} font-medium inline-flex items-center gap-1`}
      variant="secondary"
    >
      <span>{statusInfo.icon}</span>
      <span>{statusInfo.label}</span>
    </Badge>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{statusInfo.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}