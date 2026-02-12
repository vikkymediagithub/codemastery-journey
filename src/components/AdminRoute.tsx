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







import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* ---------- Hardcoded Admin Credentials ---------- */
const ADMIN_EMAIL = "vikkymediatechnologies@gmail.com";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Hardcoded admin check
      if (user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdmin();
    }
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AdminRoute;

