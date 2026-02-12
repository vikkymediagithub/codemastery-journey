import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";

const AdminAuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sign in with Supabase
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      toast({ title: "Login failed", description: error?.message || "Unknown error", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({ title: "Access denied", description: "You are not an admin", variant: "destructive" });
      setLoading(false);
      await supabase.auth.signOut();
      return;
    }

    toast({ title: "Welcome Admin!" });
    navigate("/admin", { replace: true });
    setLoading(false);
  };

  return (
    <Layout>
      <section className="flex min-h-[80vh] items-center justify-center bg-background py-20">
        <div className="mx-auto w-full max-w-md px-4">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="admin@example.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="mt-1.5"
                />
              </div>

              <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? "Logging in…" : "Sign In"} <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground text-center">
              Admin accounts are created by the system administrator only.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminAuthPage;
