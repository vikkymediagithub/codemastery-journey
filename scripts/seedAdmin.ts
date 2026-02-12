

// Example: seedAdmin.ts
import { supabase } from "@/integrations/supabase/client";

async function createAdmin() {
  const email = "admin@example.com";
  const password = "YourSecurePassword123!";

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
  });

  if (error) throw error;

  await supabase.from("user_roles").insert({
    user_id: user.id,
    role: "admin",
  });

  console.log("Admin created:", user.email);
}

createAdmin();
