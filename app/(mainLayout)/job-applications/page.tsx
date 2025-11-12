import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusUpdater } from "@/components/general/ApplicationStatusUpdater";
import { ApplicationStatus } from "@/app/utils/applicationStatus";

type JobApplication = {
  id: string;
  coverLetter: string | null;
  appliedAt: Date;
  status: string;
  job: {
    id: string;
    jobTitle: string;
    location: string;
    employmentType: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    JobSeeker: {
      name: string;
      about: string | null;
      resume: string | null;
    } | null;
  };
};

async function getJobApplications(userId: string) {
  // Get company for this user
  const company = await prisma.company.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!company) {
    return [];
  }

  // Get all applications for jobs posted by this company
  const applications = await prisma.jobApplication.findMany({
    where: {
      job: {
        companyId: company.id
      }
    },
    include: {
      job: {
        select: {
          id: true,
          jobTitle: true,
          location: true,
          employmentType: true,
        }
      },
      user: {
        include: {
          JobSeeker: {
            select: {
              name: true,
              about: true,
              resume: true,
            }
          }
        }
      }
    },
    orderBy: {
      appliedAt: 'desc'
    }
  });

  return applications;
}

const JobApplicationsPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is a company
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { userType: true }
  });

  if (user?.userType !== "COMPANY") {
    redirect("/");
  }

  const applications = await getJobApplications(session.user.id!);



  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">
          Manage applications for your job postings
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-4">
            When job seekers apply to your jobs, they&apos;ll appear here.
          </p>
          <Button asChild>
            <Link href="/post-job">Post Your First Job</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application: JobApplication) => (
            <Card key={application.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {application.user.JobSeeker?.name || application.user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Applied for: {application.job.jobTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {application.job.location} • {application.job.employmentType}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ApplicationStatusUpdater
                    applicationId={application.id}
                    currentStatus={application.status as ApplicationStatus}
                  />
                  <span className="text-xs text-muted-foreground">
                    {application.appliedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              {application.user.JobSeeker?.about && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Bio:</h4>
                  <p className="text-sm text-muted-foreground">
                    {application.user.JobSeeker.about}
                  </p>
                </div>
              )}

              {application.coverLetter && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Cover Letter:</h4>
                  <p className="text-sm text-muted-foreground">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {application.user.JobSeeker?.resume && (
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={application.user.JobSeeker.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/job/${application.job.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Job
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicationsPage;