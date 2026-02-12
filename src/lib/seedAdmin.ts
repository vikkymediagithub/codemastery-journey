import { createClient } from "@supabase/supabase-js";

// Your Supabase keys
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // service_role key required for admin actions
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = "vikymediatechnologies@gmail.com";
const ADMIN_PASSWORD = "Vikkymediatech3622?";

async function seedAdmin() {
  try {
    // 1. Create admin user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // automatically confirmed
    });

    if (userError) throw userError;
    console.log("Admin user created:", user?.id);

    // 2. Add role to user_roles table
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: user!.id,
      role: "admin",
    });

    if (roleError) throw roleError;

    console.log("Admin role assigned successfully!");
  } catch (err: any) {
    console.error("Error creating admin:", err.message || err);
  }
}

seedAdmin();
