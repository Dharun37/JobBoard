"use client";

import { ApplicationStatus } from "@/app/utils/applicationStatus";
import { CheckCircle, Circle, XCircle } from "lucide-react";

interface ApplicationProgressProps {
  status: ApplicationStatus;
}

export function ApplicationProgress({ status }: ApplicationProgressProps) {
  
  const getStatusIcon = (stepStatus: string, isCurrent: boolean, isCompleted: boolean) => {
    if (stepStatus === 'REJECTED') return <XCircle className="w-5 h-5 text-red-500" />;
    if (stepStatus === 'ACCEPTED') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isCurrent) return <Circle className="w-5 h-5 text-blue-500 fill-blue-100" />;
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getStatusLabel = (stepStatus: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Applied',
      'SEEN': 'Seen',
      'REVIEWED': 'Reviewed',
      'SHORTLISTED': 'Shortlisted',
      'ACCEPTED': 'Selected',
      'SELECTED': 'Selected',
      'REJECTED': 'Rejected'
    };
    return labels[stepStatus] || stepStatus;
  };

  const getStepColor = (stepStatus: string, isCurrent: boolean, isCompleted: boolean) => {
    if (stepStatus === 'REJECTED') return 'text-red-600';
    if (stepStatus === 'ACCEPTED') return 'text-green-600 font-semibold';
    if (isCompleted) return 'text-green-600';
    if (isCurrent) return 'text-blue-600 font-medium';
    return 'text-gray-400';
  };

  // Handle rejection path
  if (status === 'REJECTED') {
    return (
      <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-600">Applied</span>
        </div>
        <div className="w-8 h-px bg-red-300"></div>
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-600 font-medium">Rejected</span>
        </div>
      </div>
    );
  }

  const allSteps = ['PENDING', 'SEEN', 'REVIEWED', 'SHORTLISTED', 'SELECTED'];

  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg overflow-x-auto">
      {allSteps.map((step, index) => {
        // Determine step state based on current status
        let stepState: 'completed' | 'current' | 'upcoming' = 'upcoming';
        
        // Map ACCEPTED to SELECTED for display
        const displayStatus = status === 'ACCEPTED' ? 'SELECTED' : status;
        
        if (displayStatus === 'PENDING') {
          if (step === 'PENDING') stepState = 'current';
          else stepState = 'upcoming';
        } else if (displayStatus === 'SEEN') {
          if (step === 'PENDING') stepState = 'completed';
          else if (step === 'SEEN') stepState = 'current';
          else stepState = 'upcoming';
        } else if (displayStatus === 'REVIEWED') {
          if (step === 'PENDING' || step === 'SEEN') stepState = 'completed';
          else if (step === 'REVIEWED') stepState = 'current';
          else stepState = 'upcoming';
        } else if (displayStatus === 'SHORTLISTED') {
          if (step === 'PENDING' || step === 'SEEN' || step === 'REVIEWED') stepState = 'completed';
          else if (step === 'SHORTLISTED') stepState = 'current';
          else stepState = 'upcoming';
        } else if (displayStatus === 'SELECTED') {
          if (step === 'SELECTED') stepState = 'current';
          else stepState = 'completed';
        }
        
        const isCompleted = stepState === 'completed';
        const isCurrent = stepState === 'current';
        
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center space-y-1 min-w-[60px]">
              {getStatusIcon(step, isCurrent, isCompleted)}
              <span className={`text-xs whitespace-nowrap ${getStepColor(step, isCurrent, isCompleted)}`}>
                {getStatusLabel(step)}
              </span>
            </div>
            {index < allSteps.length - 1 && (
              <div className={`w-8 h-px mx-2 flex-shrink-0 ${
                isCompleted ? 'bg-green-300' : 
                isCurrent ? 'bg-blue-300' : 'bg-gray-300'
              }`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}