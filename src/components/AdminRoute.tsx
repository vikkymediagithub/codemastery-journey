// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client";

// const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading: authLoading } = useAuth();
//   const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkAdmin = async () => {
//       if (!user) {
//         setIsAdmin(false);
//         setChecking(false);
//         return;
//       }

//       const { data } = await supabase
//         .from("user_roles")
//         .select("role")
//         .eq("user_id", user.id)
//         .eq("role", "admin")
//         .maybeSingle();

//       setIsAdmin(!!data);
//       setChecking(false);
//     };

//     if (!authLoading) {
//       checkAdmin();
//     }
//   }, [user, authLoading]);

//   if (authLoading || checking) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
//       </div>
//     );
//   }

//   if (!user) return <Navigate to="/auth" replace />;
//   if (!isAdmin) return <Navigate to="/dashboard" replace />;

//   return <>{children}</>;
// };

// export default AdminRoute;






// components/AdminRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );

  if (!isAdmin) return <Navigate to="/admin-login" replace />;
  return <>{children}</>;
};

export default AdminRoute;
