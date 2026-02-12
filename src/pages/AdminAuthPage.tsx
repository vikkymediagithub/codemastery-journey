// pages/AdminAuthPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminAuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleData) navigate("/admin", { replace: true });
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    // Sign in via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Check role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user?.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({ title: "Access denied", variant: "destructive" });
      await supabase.auth.signOut();
      setSubmitting(false);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <Layout>
      <section className="flex min-h-[80vh] items-center justify-center bg-background py-20">
        <div className="mx-auto w-full max-w-md p-8 border rounded-2xl shadow-sm bg-card">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Only authorized administrators can access this portal.
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your admin email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Logging in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default AdminAuthPage;
