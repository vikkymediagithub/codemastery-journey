import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, GraduationCap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  const [authTab, setAuthTab] = useState<"student" | "admin">("student");
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Admin tab is always login-only
  const showSignup = authTab === "student" && !isLogin;

  // Redirect authenticated users
  useEffect(() => {
    if (!user) return;

    const checkRole = async () => {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData) {
        navigate("/admin", { replace: true });
        return;
      }

      const { data } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      navigate(data ? "/dashboard" : "/onboarding", { replace: true });
    };

    checkRole();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (showSignup && password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    if (showSignup) {
      // Student signup
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please verify your email to continue.",
        });
      }
    } else {
      // Login (both student & admin use same login, server-side role check redirects)
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
      // Redirect is handled by the useEffect above
    }

    setSubmitting(false);
  };

  const getTitle = () => {
    if (authTab === "admin") return "Admin Login";
    return isLogin ? "Welcome Back" : "Create Your Account";
  };

  const getSubtitle = () => {
    if (authTab === "admin") return "Sign in to access the admin dashboard.";
    return isLogin
      ? "Sign in to continue your learning journey."
      : "Sign up to begin your coding journey.";
  };

  return (
    <Layout>
      <section className="flex min-h-[80vh] items-center justify-center bg-background py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-md px-4"
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {/* Role Tabs */}
            <Tabs
              value={authTab}
              onValueChange={(v) => {
                setAuthTab(v as "student" | "admin");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-1.5">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <h1 className="text-center text-2xl font-bold text-foreground">
              {getTitle()}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {getSubtitle()}
            </p>

            {authTab === "admin" && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-destructive" />
                <span>Admin accounts are created by the system administrator only</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={authTab === "admin" ? "admin@example.com" : "you@example.com"}
                  className="mt-1.5"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - only for student signup */}
              {showSignup && (
                <div>
                  <Label htmlFor="confirm-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Confirm Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="secondary"
                className="w-full gap-2"
                disabled={submitting}
              >
                {submitting ? "Please wait…" : showSignup ? "Create Account" : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Toggle login/signup - only for student tab */}
            {authTab === "student" && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-accent hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            )}

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              {authTab === "admin"
                ? "Access restricted to authorized administrators."
                : "This training is provided by an independent coding educator. Certificates issued are non-accredited and for portfolio demonstration only."}
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AuthPage;
