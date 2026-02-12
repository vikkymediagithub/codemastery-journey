import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const AdminAuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);

  const navigate = useNavigate();

  // Check if there are any admins already
  useEffect(() => {
    const checkAdmins = async () => {
      const { data: admins } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin");

      setIsFirstAdmin(!admins || admins.length === 0);
    };

    checkAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      // LOGIN FLOW
      const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        toast({ title: "Login failed", description: loginError.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      // Check if the logged-in user is admin
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session?.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        toast({ title: "Access denied", description: "You are not an admin", variant: "destructive" });
        await supabase.auth.signOut();
        setSubmitting(false);
        return;
      }

      toast({ title: "Welcome, Admin!" });
      navigate("/admin", { replace: true });

    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Optional: initial admin signup (only if no admin exists yet)
  const handleFirstAdminSignup = async () => {
    if (!email || !password) {
      toast({ title: "Email and password are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user }, error: signupError } = await supabase.auth.signUp({ email, password });

      if (signupError) {
        toast({ title: "Signup failed", description: signupError.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      // Assign admin role
      await supabase.from("user_roles").insert({ user_id: user!.id, role: "admin" });

      toast({ title: "Admin account created! Please login." });
      setIsFirstAdmin(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-destructive" />
              <h1 className="text-lg font-bold">Admin {isFirstAdmin ? "Signup" : "Login"}</h1>
            </div>

            {isFirstAdmin ? (
              <div className="text-center text-sm mb-4 text-muted-foreground">
                No admin account exists. Create the first admin account.
              </div>
            ) : (
              <div className="text-center text-sm mb-4 text-muted-foreground">
                Admin access only. Students cannot see this page.
              </div>
            )}

            <form
              onSubmit={isFirstAdmin ? (e) => { e.preventDefault(); handleFirstAdminSignup(); } : handleSubmit}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" /> Password
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

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Please wait…" : isFirstAdmin ? "Create Admin Account" : "Login"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AdminAuthPage;
