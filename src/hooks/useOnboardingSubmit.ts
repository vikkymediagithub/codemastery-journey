import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface OnboardingData {
  // Step 0: Personal Info
  name: string;
  email: string;
  country: string;
  // Step 1: Tech Background
  experience: string;
  device: string;
  internetQuality: string;
  // Step 2: Commitment
  hoursPerWeek: string;
  studyTime: string;
  learningGoal: string;
  whyLearn: string;
  // Step 3: Discipline
  followsDeadlines: boolean;
  practicesConsistently: boolean;
  openToFeedback: boolean;
  // Step 4: Enrollment
  learningTrack: string;
  learningMode: string;
  accessType: string;
  agreeTerms: boolean;
}

export const useOnboardingSubmit = () => {
  const { user } = useAuth();

  const submit = async (data: OnboardingData) => {
    if (!user) {
      toast({ title: "Not authenticated", variant: "destructive" });
      return false;
    }

    try {
      // 1. Learner profile
      const { error: profileErr } = await supabase.from("learner_profiles").insert({
        user_id: user.id,
        full_name: data.name,
        email: data.email,
        country: data.country,
      });
      if (profileErr) throw profileErr;

      // 2. Tech background
      const { error: techErr } = await supabase.from("tech_background").insert({
        user_id: user.id,
        experience_level: (data.experience || "none") as "none" | "beginner" | "intermediate",
        device: (data.device || "laptop") as "laptop" | "mobile" | "both",
        internet_quality: (data.internetQuality || "good") as "poor" | "fair" | "good",
      });
      if (techErr) throw techErr;

      // 3. Learning commitment
      const { error: commitErr } = await supabase.from("learning_commitment").insert({
        user_id: user.id,
        hours_per_week: parseInt(data.hoursPerWeek) || 5,
        preferred_study_time: (data.studyTime || "flexible") as "morning" | "afternoon" | "night" | "flexible",
        learning_goal: (data.learningGoal || "improvement") as "job" | "freelancing" | "projects" | "improvement",
        motivation: data.whyLearn || "",
      });
      if (commitErr) throw commitErr;

      // 4. Discipline check
      const { error: discErr } = await supabase.from("discipline_check").insert({
        user_id: user.id,
        follows_deadlines: data.followsDeadlines,
        practices_consistently: data.practicesConsistently,
        open_to_feedback: data.openToFeedback,
      });
      if (discErr) throw discErr;

      // 5. Enrollment
      const isFree = data.accessType === "free";
      const freeExpiresAt = isFree
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error: enrollErr } = await supabase.from("enrollments").insert({
        user_id: user.id,
        learning_track: (data.learningTrack || "foundation") as "frontend" | "backend" | "fullstack" | "foundation",
        learning_mode: (data.learningMode || "self_paced") as "self_paced" | "live" | "mentorship" | "project" | "hybrid",
        access_type: (data.accessType || "free") as "free" | "paid",
        status: "active" as const,
        free_expires_at: freeExpiresAt,
      });
      if (enrollErr) throw enrollErr;

      return true;
    } catch (err: any) {
      console.error("Onboarding submission error:", err);
      toast({
        title: "Submission failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submit };
};
