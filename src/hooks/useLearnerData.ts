import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

interface LearnerData {
  profile: Tables<"learner_profiles"> | null;
  enrollment: Tables<"enrollments"> | null;
  techBackground: Tables<"tech_background"> | null;
  commitment: Tables<"learning_commitment"> | null;
  discipline: Tables<"discipline_check"> | null;
  loading: boolean;
  hasEnrollment: boolean;
  isExpired: boolean;
  daysRemaining: number | null;
  refetch: () => void;
}

export const useLearnerData = (): LearnerData => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Tables<"learner_profiles"> | null>(null);
  const [enrollment, setEnrollment] = useState<Tables<"enrollments"> | null>(null);
  const [techBackground, setTechBackground] = useState<Tables<"tech_background"> | null>(null);
  const [commitment, setCommitment] = useState<Tables<"learning_commitment"> | null>(null);
  const [discipline, setDiscipline] = useState<Tables<"discipline_check"> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const [profileRes, enrollRes, techRes, commitRes, discRes] = await Promise.all([
      supabase.from("learner_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("enrollments").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("tech_background").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("learning_commitment").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("discipline_check").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    setProfile(profileRes.data);
    setEnrollment(enrollRes.data);
    setTechBackground(techRes.data);
    setCommitment(commitRes.data);
    setDiscipline(discRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const isExpired =
    enrollment?.access_type === "free" &&
    enrollment?.free_expires_at != null &&
    new Date(enrollment.free_expires_at) < new Date();

  const daysRemaining =
    enrollment?.access_type === "free" && enrollment?.free_expires_at
      ? Math.max(0, Math.ceil((new Date(enrollment.free_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

  return {
    profile,
    enrollment,
    techBackground,
    commitment,
    discipline,
    loading,
    hasEnrollment: !!enrollment,
    isExpired,
    daysRemaining,
    refetch: fetchData,
  };
};
