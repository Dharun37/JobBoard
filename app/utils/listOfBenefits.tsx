import {
  Briefcase,
  Users,
  Zap,
  Eye,
  SmileIcon as Tooth,
  Heart,
  Umbrella,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  Bitcoin,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
} from "lucide-react";

interface Benefit {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const benefits: Benefit[] = [
  {
    id: "health_insurance",
    label: "Health Insurance",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "remote_work",
    label: "Remote Work",
    icon: <Home className="w-3 h-3" />,
  },
  {
    id: "flexible_hours",
    label: "Flexible Hours",
    icon: <Clock className="w-3 h-3" />,
  },
  {
    id: "paid_leave",
    label: "Paid Leave",
    icon: <Umbrella className="w-3 h-3" />,
  },
  {
    id: "performance_bonus",
    label: "Performance Bonus",
    icon: <Coins className="w-3 h-3" />,
  },
  {
    id: "learning_budget",
    label: "Learning & Development",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  {
    id: "work_from_home",
    label: "Work From Home",
    icon: <MonitorOff className="w-3 h-3" />,
  },
  {
    id: "team_outings",
    label: "Team Outings",
    icon: <Users className="w-3 h-3" />,
  },
  {
    id: "provident_fund",
    label: "Provident Fund",
    icon: <Briefcase className="w-3 h-3" />,
  },
  {
    id: "life_insurance",
    label: "Life Insurance",
    icon: <Shield className="w-3 h-3" />,
  },
  {
    id: "laptop_provided",
    label: "Laptop Provided",
    icon: <Building className="w-3 h-3" />,
  },
  {
    id: "internet_allowance",
    label: "Internet Allowance",
    icon: <Zap className="w-3 h-3" />,
  },
  {
    id: "free_meals",
    label: "Free Meals",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "gym_membership",
    label: "Gym Membership",
    icon: <Dumbbell className="w-3 h-3" />,
  },
  {
    id: "career_growth",
    label: "Career Growth",
    icon: <UserPlus className="w-3 h-3" />,
  },
  {
    id: "casual_dress",
    label: "Casual Dress Code",
    icon: <UserCircle className="w-3 h-3" />,
  },
  {
    id: "annual_bonus",
    label: "Annual Bonus",
    icon: <PieChart className="w-3 h-3" />,
  },
  {
    id: "mental_health",
    label: "Mental Health Support",
    icon: <Brain className="w-3 h-3" />,
  },
  {
    id: "transport_allowance",
    label: "Transport Allowance",
    icon: <Building className="w-3 h-3" />,
  },
  {
    id: "five_day_week",
    label: "5-Day Work Week",
    icon: <Calendar className="w-3 h-3" />,
  },
  {
    id: "stock_options",
    label: "Stock Options",
    icon: <Coins className="w-3 h-3" />,
  },
  {
    id: "maternity_leave",
    label: "Maternity/Paternity Leave",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "skill_development",
    label: "Skill Development",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  {
    id: "festival_bonus",
    label: "Festival Bonus",
    icon: <Calendar className="w-3 h-3" />,
  },
];
