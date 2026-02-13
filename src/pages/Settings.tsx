import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLearnerData } from "@/hooks/useLearnerData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Globe,
  Clock,
  BookOpen,
  Target,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const timezones = [
  "Africa/Lagos",
  "Africa/Nairobi",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Pacific/Auckland",
];

const studyTimes = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "night", label: "Night" },
  { value: "flexible", label: "Flexible" },
];

const learningGoals = [
  { value: "job", label: "Get a Job" },
  { value: "freelancing", label: "Freelancing" },
  { value: "projects", label: "Build Projects" },
  { value: "improvement", label: "Self Improvement" },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const { profile, commitment, loading, refetch } = useLearnerData();

  const [fullName, setFullName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("5");
  const [studyTime, setStudyTime] = useState("flexible");
  const [learningGoal, setLearningGoal] = useState("improvement");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setTimezone(profile.timezone || "");
    }
    if (commitment) {
      setHoursPerWeek(String(commitment.hours_per_week || 5));
      setStudyTime(commitment.preferred_study_time || "flexible");
      setLearningGoal(commitment.learning_goal || "improvement");
    }
  }, [profile, commitment]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const profileUpdate = supabase
        .from("learner_profiles")
        .update({
          full_name: fullName,
          timezone,
        })
        .eq("user_id", user.id);

      const commitmentUpdate = supabase
        .from("learning_commitment")
        .update({
          hours_per_week: parseInt(hoursPerWeek) || 5,
          preferred_study_time: studyTime as any,
          learning_goal: learningGoal as any,
        })
        .eq("user_id", user.id);

      const [profileRes, commitmentRes] = await Promise.all([
        profileUpdate,
        commitmentUpdate,
      ]);

      if (profileRes.error) throw profileRes.error;
      if (commitmentRes.error) throw commitmentRes.error;

      toast({ title: "Settings saved successfully!" });
      refetch();
    } catch (err: any) {
      toast({
        title: "Failed to save",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 md:py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Profile Settings
            </h1>
            <p className="mt-1 text-muted-foreground">
              Update your profile and learning preferences
            </p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">
              <User className="h-5 w-5 text-accent" />
              Personal Info
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || user?.email || ""}
                  disabled
                  className="mt-1.5 opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Learning Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">
              <BookOpen className="h-5 w-5 text-accent" />
              Learning Preferences
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="hoursPerWeek" className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Hours per Week
                </Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  min="1"
                  max="40"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="mt-1.5 w-32"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Preferred Study Time
                </Label>
                <Select value={studyTime} onValueChange={setStudyTime}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {studyTimes.map((st) => (
                      <SelectItem key={st.value} value={st.value}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  Learning Goal
                </Label>
                <Select value={learningGoal} onValueChange={setLearningGoal}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {learningGoals.map((lg) => (
                      <SelectItem key={lg.value} value={lg.value}>
                        {lg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-end"
          >
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default SettingsPage;
