import { prisma } from "@/app/utils/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { notFound } from "next/navigation";
import React from "react";

import { benefits } from "@/app/utils/listOfBenefits";
import Image from "next/image";
import { Heart } from "lucide-react";

import Link from "next/link";
import { auth } from "@/app/utils/auth";
import {
  GeneralSubmitButton,
  SaveJobButton,
} from "@/components/general/SubmitButtons";
import { getFlagEmoji } from "@/app/utils/countriesList";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import { saveJobPost, unsaveJobPost, applyToJob } from "@/app/actions";
import arcjet, { detectBot } from "@/app/utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

async function getJob(jobId: string, userId?: string) {
  const [jobData, savedJob, application] = await Promise.all([
    prisma.jobPost.findUnique({
      where: {
        id: jobId,
        status: "ACTIVE",
      },
      select: {
        jobTitle: true,
        jobDescription: true,
        location: true,
        employmentType: true,
        benefits: true,
        applications: true,
        createdAt: true,
        listingDuration: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),
    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobId: {
              userId,
              jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
    userId
      ? prisma.jobApplication.findUnique({
          where: {
            userId_jobId: {
              userId,
              jobId,
            },
          },
          select: {
            id: true,
            status: true,
            appliedAt: true,
          },
        })
      : null,
  ]);

  if (!jobData) {
    return notFound();
  }

  return {
    jobData,
    savedJob,
    application,
  };
}

type Params = Promise<{ jobId: string }>;
type SearchParams = Promise<{ applied?: string }>;

const JobIdPage = async ({ 
  params, 
  searchParams 
}: { 
  params: Params;
  searchParams: SearchParams;
}) => {
  const { jobId } = await params;
  const { applied } = await searchParams;
  const req = await request();

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("forbidden");
  }

  const session = await auth();
  const { jobData, savedJob, application } = await getJob(jobId, session?.user?.id);
  const locationFlag = getFlagEmoji(jobData.location);

  // Get user type to show appropriate content
  let userType = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true, Company: { select: { id: true } } }
    });
    userType = user?.userType;
  }

  return (
    <div className="container mx-auto py-8">
      {applied && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Application submitted successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your application has been sent to {jobData.company.name}. They will review your application and get back to you soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{jobData.jobTitle}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium">{jobData.company.name}</span>

                <Badge className="rounded-full" variant="secondary">
                  {jobData.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  •
                </span>
                <Badge className="rounded-full">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>}
                  {jobData.location} Only
                </Badge>
              </div>
            </div>

            {session?.user ? (
              <form
                action={
                  savedJob
                    ? unsaveJobPost.bind(null, savedJob.id)
                    : saveJobPost.bind(null, jobId)
                }
              >
                <SaveJobButton savedJob={!!savedJob} />
              </form>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">
                  <Heart className="size-4 mr-2" />
                  Save Job
                </Link>
              </Button>
            )}
          </div>

          <section>
            <JsonToHtml json={JSON.parse(jobData.jobDescription)} />
          </section>

          <section>
            <h3 className="font-semibold mb-4">
              Benefits{" "}
              <span className="text-sm text-muted-foreground font-normal">
                (green is offered and red is not offered)
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit) => {
                const isOffered = jobData.benefits.includes(benefit.id);
                return (
                  <Badge
                    key={benefit.id}
                    variant={isOffered ? "default" : "outline"}
                    className={`text-sm px-4 py-1.5 rounded-full ${
                      !isOffered && " opacity-75 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {benefit.icon}
                      {benefit.label}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Now Card / Company Actions Card */}
          <Card className="p-6">
            <div className="space-y-4">
              {userType === "COMPANY" ? (
                // Company view - show job applications
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Job Applications</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage applications for this job posting.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/job-applications">
                      View All Applications
                    </Link>
                  </Button>
                </div>
              ) : (
                // Job seeker view - show apply form
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Apply now</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please let {jobData.company.name} know you found this job on
                    JobMarshal. This helps us grow!
                  </p>
                  {session?.user ? (
                    userType === "JOB_SEEKER" ? (
                      application ? (
                        <div className="text-center space-y-2">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800">Application Submitted</h4>
                            <p className="text-sm text-green-700">
                              You applied on {application.appliedAt.toLocaleDateString()}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              Status: {application.status}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <form action={applyToJob} className="space-y-4">
                          <input type="hidden" name="jobId" value={jobId} />
                          <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium mb-2">
                              Cover Letter (Optional)
                            </label>
                            <textarea
                              id="coverLetter"
                              name="coverLetter"
                              placeholder="Tell the employer why you're the perfect fit for this role..."
                              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Max 1000 characters
                            </p>
                          </div>
                          <GeneralSubmitButton text="Apply now" />
                        </form>
                      )
                    ) : (
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Complete your job seeker profile to apply for jobs.
                        </p>
                        <Button asChild className="w-full">
                          <Link href="/onboarding">
                            Complete Profile
                          </Link>
                        </Button>
                      </div>
                    )
                  ) : (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">
                        Login to Apply
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Job Details Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">About the job</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Apply before
                  </span>
                  <span className="text-sm">
                    {new Date(
                      jobData.createdAt.getTime() +
                        jobData.listingDuration * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Posted on
                  </span>
                  <span className="text-sm">
                    {jobData.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Employment type
                  </span>
                  <span className="text-sm">{jobData.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Applications
                  </span>
                  <span className="text-sm font-medium">{jobData.applications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Location
                  </span>
                  <Badge variant="secondary">{jobData.location}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    jobData.company.logo ??
                    `https://avatar.vercel.sh/${jobData.company.name}`
                  }
                  alt={jobData.company.name}
                  width={48}
                  height={48}
                  className="rounded-full size-12"
                />
                <div>
                  <h3 className="font-semibold">{jobData.company.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {jobData.company.about}
                  </p>
                </div>
              </div>
              {/*  <Button variant="outline" className="w-full">
                View company profile
              </Button> */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobIdPage;
