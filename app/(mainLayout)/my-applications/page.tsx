import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ApplicationStatusBadge } from "@/components/general/ApplicationStatusBadge";
import { ApplicationProgress } from "@/components/general/ApplicationProgress";
import { ApplicationStatus } from "@/app/utils/applicationStatus";
import { formatCurrency } from "@/app/utils/formatCurrency";

type UserApplication = {
  id: string;
  appliedAt: Date;
  status: string;
  coverLetter: string | null;
  job: {
    id: string;
    jobTitle: string;
    location: string;
    employmentType: string;
    salaryFrom: number;
    salaryTo: number;
    company: {
      name: string;
      logo: string | null;
    };
  };
};

async function getUserApplications(userId: string) {
  const applications = await prisma.jobApplication.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          company: {
            select: {
              name: true,
              logo: true,
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

const MyApplicationsPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is a job seeker
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { userType: true }
  });

  if (user?.userType !== "JOB_SEEKER") {
    redirect("/");
  }

  const applications = await getUserApplications(session.user.id!);



  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-4">
            Start applying to jobs to see your applications here.
          </p>
          <Button asChild>
            <Link href="/">Browse Jobs</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application: UserApplication) => (
            <Card key={application.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      application.job.company.logo ??
                      `https://avatar.vercel.sh/${application.job.company.name}`
                    }
                    alt={application.job.company.name}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {application.job.jobTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {application.job.company.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {application.job.location} • {application.job.employmentType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied on {application.appliedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ApplicationStatusBadge 
                    status={application.status as ApplicationStatus}
                  />
                </div>
              </div>

              {application.coverLetter && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-1 text-sm">Your Cover Letter:</h4>
                  <p className="text-sm text-muted-foreground">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-medium mb-2 text-sm">Application Progress:</h4>
                <ApplicationProgress status={application.status as ApplicationStatus} />
              </div>

              <div className="flex gap-2">
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

export default MyApplicationsPage;