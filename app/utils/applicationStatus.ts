import { ApplicationStatus as PrismaApplicationStatus } from '@prisma/client';

export type ApplicationStatus = PrismaApplicationStatus;

interface StatusBadge {
  color: string;
  icon: string;
  label: string;
  description: string;
}

export const getApplicationStatusBadge = (status: ApplicationStatus): StatusBadge => {
  switch(status) {
    case 'PENDING':
      return { 
        color: 'bg-gray-100 text-gray-800', 
        icon: '⏳', 
        label: 'Pending',
        description: 'Application submitted, waiting for review'
      };
    case 'SEEN':
      return { 
        color: 'bg-blue-100 text-blue-800', 
        icon: '👁️', 
        label: 'Seen',
        description: 'Application has been viewed'
      };
    case 'REVIEWED':
      return { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: '📋', 
        label: 'Under Review',
        description: 'Application is being evaluated'
      };
    case 'SHORTLISTED':
      return { 
        color: 'bg-purple-100 text-purple-800', 
        icon: '⭐', 
        label: 'Shortlisted',
        description: 'You have been shortlisted for the next round'
      };
    case 'ACCEPTED':
    case 'SELECTED':
      return { 
        color: 'bg-green-100 text-green-800', 
        icon: '✅', 
        label: 'Selected',
        description: 'Congratulations! Your application was selected'
      };
    case 'REJECTED':
      return { 
        color: 'bg-red-100 text-red-800', 
        icon: '❌', 
        label: 'Rejected',
        description: 'Application was not selected'
      };
    default:
      return { 
        color: 'bg-gray-100 text-gray-800', 
        icon: '⏳', 
        label: 'Pending',
        description: 'Application status unknown'
      };
  }
};

export const getStatusProgression = (currentStatus: ApplicationStatus): { completed: string[], current: string, upcoming: string[] } => {
  const allStatuses = ['PENDING', 'REVIEWED', 'ACCEPTED'] as const;
  const currentIndex = allStatuses.indexOf(currentStatus as any);
  
  // Handle rejection separately as it can happen at any stage
  if (currentStatus === 'REJECTED') {
    return {
      completed: [],
      current: 'REJECTED',
      upcoming: []
    };
  }
  
  // For PENDING, it should be the current step (no completed steps before it)
  // For REVIEWED, PENDING should be completed
  // For ACCEPTED, both PENDING and REVIEWED should be completed
  return {
    completed: allStatuses.slice(0, currentIndex),
    current: currentStatus,
    upcoming: allStatuses.slice(currentIndex + 1)
  };
};