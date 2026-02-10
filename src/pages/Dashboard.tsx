import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLearnerData } from "@/hooks/useLearnerData";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Target,
  Monitor,
  Wifi,
  CalendarDays,
  AlertTriangle,
  Lock,
  CheckCircle2,
  User,
  Globe,
  Zap,
  CreditCard,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const DashboardPage = () => {
  const { user } = useAuth();
  const { profile, enrollment, techBackground, commitment, loading, isExpired, daysRemaining, refetch } =
    useLearnerData();
  const { initializePayment, verifyPayment, loading: paymentLoading, amount } = usePayment();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle Paystack callback redirect
  useEffect(() => {
    const shouldVerify = searchParams.get("verify_payment");
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (shouldVerify && reference) {
      // Clean URL
      searchParams.delete("verify_payment");
      searchParams.delete("reference");
      searchParams.delete("trxref");
      setSearchParams(searchParams, { replace: true });
      // Verify payment
      verifyPayment(reference).then((ok) => {
        if (ok) refetch();
      });
    }
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!enrollment) {
    return (
      <Layout>
        <section className="flex min-h-[60vh] items-center justify-center bg-background">
          <div className="text-center px-4">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
              Complete Your Application
            </h2>
            <p className="mt-2 text-muted-foreground">
              You haven't completed onboarding yet. Let's get started!
            </p>
            <Link to="/onboarding" className="mt-6 inline-block">
              <Button variant="secondary">Start Onboarding</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const isLocked = enrollment.status === "locked";
  const isPending = enrollment.access_type === "paid" && enrollment.status === "locked";

  return (
    <Layout>
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome, {profile?.full_name || user?.email?.split("@")[0]}
            </h1>
            <p className="mt-1 text-muted-foreground">Your learning dashboard</p>
          </div>

          {/* Alerts */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-900/10"
            >
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-400">Payment Required</p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">
                  Complete your payment of ₦{amount.toLocaleString()} to activate your account and unlock all features.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 gap-1.5"
                  disabled={paymentLoading}
                  onClick={initializePayment}
                >
                  <CreditCard className="h-4 w-4" />
                  {paymentLoading ? "Processing…" : `Pay ₦${amount.toLocaleString()}`}
                </Button>
              </div>
            </motion.div>
          )}

          {isExpired && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Free Trial Expired</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your 7-day free access has ended. Upgrade to the paid program to continue learning.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 gap-1.5"
                  disabled={paymentLoading}
                  onClick={initializePayment}
                >
                  <CreditCard className="h-4 w-4" />
                  {paymentLoading ? "Processing…" : `Upgrade — ₦${amount.toLocaleString()}`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                label: "Status",
                value: isLocked ? "Locked" : "Active",
                color: isLocked ? "text-amber-500" : "text-accent",
              },
              {
                icon: BookOpen,
                label: "Track",
                value: formatTrack(enrollment.learning_track),
                color: "text-accent",
              },
              {
                icon: Target,
                label: "Mode",
                value: formatMode(enrollment.learning_mode),
                color: "text-accent",
              },
              {
                icon: CalendarDays,
                label: enrollment.access_type === "free" ? "Days Left" : "Access",
                value:
                  enrollment.access_type === "free"
                    ? daysRemaining !== null
                      ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`
                      : "—"
                    : "Paid Program",
                color: isExpired ? "text-destructive" : "text-accent",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <p className="mt-2 font-display text-xl font-bold text-foreground">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Profile & Details */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Profile Info */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <User className="h-5 w-5 text-accent" /> Profile
              </h3>
              <div className="mt-4 space-y-3">
                <InfoRow label="Name" value={profile?.full_name || "—"} />
                <InfoRow label="Email" value={profile?.email || user?.email || "—"} />
                <InfoRow label="Country" value={profile?.country || "—"} />
                <InfoRow
                  label="Access Type"
                  value={
                    <Badge variant={enrollment.access_type === "paid" ? "default" : "secondary"}>
                      {enrollment.access_type === "paid" ? "Paid" : "Free Trial"}
                    </Badge>
                  }
                />
              </div>
            </motion.div>

            {/* Tech & Commitment */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <Monitor className="h-5 w-5 text-accent" /> Tech & Commitment
              </h3>
              <div className="mt-4 space-y-3">
                <InfoRow
                  label="Experience"
                  value={formatExperience(techBackground?.experience_level)}
                />
                <InfoRow label="Device" value={formatDevice(techBackground?.device)} />
                <InfoRow
                  label="Internet"
                  value={
                    <span className="flex items-center gap-1.5">
                      <Wifi className="h-3.5 w-3.5" />
                      {formatInternet(techBackground?.internet_quality)}
                    </span>
                  }
                />
                <InfoRow
                  label="Hours/Week"
                  value={commitment?.hours_per_week ? `${commitment.hours_per_week}h` : "—"}
                />
                <InfoRow
                  label="Goal"
                  value={formatGoal(commitment?.learning_goal)}
                />
              </div>
            </motion.div>
          </div>

          {/* Learning Hub Placeholder */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8"
          >
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <GraduationCap className="h-5 w-5 text-accent" /> Learning Hub
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Course Materials",
                  desc: "Your curriculum and lessons will appear here.",
                  locked: isLocked,
                },
                {
                  icon: Target,
                  title: "Progress Tracker",
                  desc: "Track your weekly milestones and achievements.",
                  locked: isLocked,
                },
                {
                  icon: Globe,
                  title: "Community",
                  desc: "Connect with fellow learners and mentors.",
                  locked: isLocked,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`relative rounded-xl border border-border bg-card p-6 shadow-sm ${
                    card.locked ? "opacity-60" : ""
                  }`}
                >
                  {card.locked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm">
                      <div className="text-center">
                        <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {isPending ? "Pending Approval" : "Upgrade Required"}
                        </p>
                      </div>
                    </div>
                  )}
                  <card.icon className="h-8 w-8 text-accent" />
                  <h4 className="mt-3 font-display text-base font-semibold text-foreground">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

/* ── Helpers ── */

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

const formatTrack = (t?: string) => {
  const map: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    fullstack: "Full-Stack",
    foundation: "Foundation",
  };
  return map[t || ""] || t || "—";
};

const formatMode = (m?: string) => {
  const map: Record<string, string> = {
    self_paced: "Self-Paced",
    live: "Live Instructor",
    mentorship: "Mentorship",
    project: "Project-Based",
    hybrid: "Hybrid",
  };
  return map[m || ""] || m || "—";
};

const formatExperience = (e?: string) => {
  const map: Record<string, string> = { none: "None", beginner: "Beginner", intermediate: "Intermediate" };
  return map[e || ""] || e || "—";
};

const formatDevice = (d?: string) => {
  const map: Record<string, string> = { laptop: "Laptop/Desktop", mobile: "Mobile", both: "Both" };
  return map[d || ""] || d || "—";
};

const formatInternet = (q?: string) => {
  const map: Record<string, string> = { poor: "Poor", fair: "Fair", good: "Good" };
  return map[q || ""] || q || "—";
};

const formatGoal = (g?: string) => {
  const map: Record<string, string> = {
    job: "Get a Job",
    freelancing: "Freelancing",
    projects: "Build Projects",
    improvement: "Self Improvement",
  };
  return map[g || ""] || g || "—";
};

export default DashboardPage;
