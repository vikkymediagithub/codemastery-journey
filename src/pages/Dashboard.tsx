import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLearnerData } from "@/hooks/useLearnerData";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import CourseList from "@/components/dashboard/CourseList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  GraduationCap,
  Target,
  CalendarDays,
  AlertTriangle,
  Lock,
  Globe,
  Zap,
  Crown,
  CreditCard,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    profile,
    enrollment,
    loading,
    isExpired,
    daysRemaining,
    refetch,
  } = useLearnerData();

  const {
    initializePayment,
    verifyPayment,
    loading: paymentLoading,
    amount,
  } = usePayment();

  const [searchParams, setSearchParams] = useSearchParams();

  /* ── Payment verification on redirect ── */
  useEffect(() => {
    const shouldVerify = searchParams.get("verify_payment");
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (shouldVerify && reference) {
      searchParams.delete("verify_payment");
      searchParams.delete("reference");
      searchParams.delete("trxref");
      setSearchParams(searchParams, { replace: true });

      verifyPayment(reference).then((ok) => {
        if (ok) refetch();
      });
    }
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  /* ── No enrollment ── */
  if (!enrollment) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
          <div>
            <GraduationCap className="mx-auto h-14 w-14 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">
              Complete Your Application
            </h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              You haven't completed onboarding yet. Set up your profile to start learning.
            </p>
            <Link to="/onboarding">
              <Button className="mt-6 gap-2">
                <ArrowRight className="h-4 w-4" />
                Start Onboarding
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Access logic ── */
  const isTrial = enrollment.access_type === "free";
  const trialExpired = isTrial && isExpired;
  const isPaid =
    enrollment.access_type === "paid" && enrollment.status === "active";

  const showUrgency =
    isTrial && daysRemaining !== null && daysRemaining <= 2 && !trialExpired;

  const trialProgress =
    isTrial && daysRemaining !== null
      ? Math.max(0, Math.min(100, ((7 - daysRemaining) / 7) * 100))
      : 0;

  return (
    <Layout>
      <section className="py-8 md:py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ── HEADER ── */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back,{" "}
                  <span className="text-accent">
                    {profile?.full_name || user?.email?.split("@")[0]}
                  </span>
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {isPaid
                    ? "Your premium learning hub"
                    : "Your learning journey starts here"}
                </p>
              </div>

              {isPaid ? (
                <Badge className="gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 text-sm w-fit">
                  <Crown className="h-4 w-4" />
                  Premium Member
                </Badge>
              ) : (
                <Button
                  onClick={initializePayment}
                  disabled={paymentLoading}
                  className="gap-2 w-fit"
                >
                  <Sparkles className="h-4 w-4" />
                  {paymentLoading
                    ? "Processing…"
                    : `Upgrade — ₦${amount.toLocaleString()}`}
                </Button>
              )}
            </div>
          </motion.div>

          {/* ── TRIAL BANNER ── */}
          {isTrial && !trialExpired && (
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className={`mb-6 rounded-xl p-5 border ${
                showUrgency
                  ? "border-amber-500/50 bg-amber-50 dark:bg-amber-900/10"
                  : "border-accent/20 bg-accent/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <p className="font-semibold text-foreground">
                      Free Trial • {daysRemaining} day
                      {daysRemaining !== 1 ? "s" : ""} remaining
                    </p>
                  </div>
                  <Progress value={trialProgress} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upgrade anytime to unlock all courses, projects, mentorship & resources.
                  </p>
                </div>

                <Button
                  onClick={initializePayment}
                  disabled={paymentLoading}
                  className="gap-2 shrink-0"
                >
                  <CreditCard className="h-4 w-4" />
                  {paymentLoading
                    ? "Processing…"
                    : `Upgrade — ₦${amount.toLocaleString()}`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── EXPIRED TRIAL ── */}
          {trialExpired && (
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"
            >
              <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-3 font-semibold text-lg text-destructive">
                Your Free Trial Has Ended
              </p>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Your 7-day free access has expired. Upgrade now to continue learning with full access to all features.
              </p>
              <Button
                className="mt-4 gap-2"
                onClick={initializePayment}
                disabled={paymentLoading}
              >
                <CreditCard className="h-4 w-4" />
                {paymentLoading
                  ? "Processing…"
                  : `Upgrade to Continue — ₦${amount.toLocaleString()}`}
              </Button>
            </motion.div>
          )}

          {/* ── STATS GRID ── */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-10">
            {[
              {
                label: "Track",
                value: formatTrack(enrollment.learning_track),
                icon: BookOpen,
              },
              {
                label: "Mode",
                value: formatMode(enrollment.learning_mode),
                icon: Target,
              },
              {
                label: "Access",
                value: isPaid ? "Premium" : "Free Trial",
                icon: Zap,
                highlight: isPaid,
              },
              {
                label: isTrial ? "Days Left" : "Duration",
                value: isTrial
                  ? daysRemaining !== null
                    ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`
                    : "—"
                  : "Unlimited",
                icon: CalendarDays,
                warning: trialExpired,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i + 2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className={`rounded-xl border p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md ${
                  stat.highlight
                    ? "border-accent/30 bg-accent/5"
                    : stat.warning
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  <stat.icon className="h-4 w-4 text-accent" />
                  {stat.label}
                </div>
                <p className="mt-2 text-base md:text-lg font-bold text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── COURSES SECTION ── */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                <GraduationCap className="h-5 w-5 text-accent" />
                Your Courses
              </h3>
              {!isPaid && !trialExpired && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Some locked
                </Badge>
              )}
            </div>

            <CourseList
              track={enrollment.learning_track}
              accessType={enrollment.access_type}
              isTrialExpired={trialExpired}
            />
          </motion.div>

          {/* ── PREMIUM FEATURES ── */}
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10"
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {isPaid ? "Your Features" : "Premium Features"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickCard
                icon={Target}
                title="Progress Tracker"
                desc="Track weekly milestones and goals"
                locked={!isPaid}
              />
              <QuickCard
                icon={Globe}
                title="Community"
                desc="Connect with fellow learners"
                locked={!isPaid}
              />
              <QuickCard
                icon={BookOpen}
                title="Resources"
                desc="Guides, cheatsheets & tools"
                locked={!isPaid}
              />
            </div>

            {!isPaid && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={initializePayment}
                  disabled={paymentLoading}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  {paymentLoading
                    ? "Processing…"
                    : `Unlock All Features — ₦${amount.toLocaleString()}`}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

/* ══════════ Sub-components ══════════ */

const QuickCard = ({
  icon: Icon,
  title,
  desc,
  locked,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  locked: boolean;
}) => (
  <div
    className={`relative rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${
      locked ? "opacity-60" : ""
    }`}
  >
    {locked && (
      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-card/70 rounded-xl">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
    )}
    <Icon className="h-6 w-6 text-accent" />
    <h4 className="mt-3 font-semibold text-foreground">{title}</h4>
    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
  </div>
);

/* ══════════ Formatters ══════════ */

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

export default DashboardPage;
