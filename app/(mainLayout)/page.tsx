import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Shield, 
  Sparkles,
  Search,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          Premium Job Board Platform
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Find Your Dream Job or
          <br />
          Hire Top Talent
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect job seekers with amazing opportunities. Premium placement, 
          real-time applications, and automated workflows for modern hiring.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/jobs">
            <Button size="lg" className="gap-2">
              <Search className="w-4 h-4" />
              Browse Jobs
            </Button>
          </Link>
          <Link href="/post-job">
            <Button size="lg" variant="outline" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Post a Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg border bg-card">
            <Briefcase className="w-8 h-8 mb-2 mx-auto text-primary" />
            <h3 className="text-3xl font-bold">1000+</h3>
            <p className="text-muted-foreground">Active Jobs</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Users className="w-8 h-8 mb-2 mx-auto text-primary" />
            <h3 className="text-3xl font-bold">5000+</h3>
            <p className="text-muted-foreground">Job Seekers</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Building2 className="w-8 h-8 mb-2 mx-auto text-primary" />
            <h3 className="text-3xl font-bold">500+</h3>
            <p className="text-muted-foreground">Companies</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for modern job posting and hiring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Placement</h3>
              <p className="text-muted-foreground">
                Get your job listings featured at the top with premium placement and highlighted styling.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Application Tracking</h3>
              <p className="text-muted-foreground">
                Advanced status system to track applications from pending to selected with real-time updates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bot Protection</h3>
              <p className="text-muted-foreground">
                Powered by Arcjet security to protect against spam, bots, and malicious traffic.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Auto Expiration</h3>
              <p className="text-muted-foreground">
                Automated job expiration using Inngest - listings expire automatically after duration.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Filtering</h3>
              <p className="text-muted-foreground">
                Filter jobs by type, location, and more. Save your favorite listings for later.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Application</h3>
              <p className="text-muted-foreground">
                One-click apply, progress tracking, and status updates throughout the hiring process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">
                For Job Seekers
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Create Your Profile</h4>
                    <p className="text-muted-foreground">Sign up and complete your job seeker profile with your details.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Browse & Apply</h4>
                    <p className="text-muted-foreground">Search for jobs, save favorites, and apply with one click.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Track Progress</h4>
                    <p className="text-muted-foreground">Monitor your application status and get updates in real-time.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">
                For Employers
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Register Company</h4>
                    <p className="text-muted-foreground">Create your company profile with all the details.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Post Jobs</h4>
                    <p className="text-muted-foreground">Create job listings with premium placement options.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Manage Applications</h4>
                    <p className="text-muted-foreground">Review applications and update candidate status throughout the process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers and companies already using our platform
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/jobs">
              <Button size="lg" variant="secondary" className="gap-2">
                Browse Jobs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
