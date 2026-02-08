import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code2, Server, Layers, Lightbulb, BookOpen, Users, Rocket, Handshake, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import founderAvatar from "@/assets/founder-avatar.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const tracks = [
  { icon: Code2, title: "Frontend Development", desc: "HTML, CSS, JavaScript, React" },
  { icon: Server, title: "Backend Development", desc: "Node.js, APIs, Databases" },
  { icon: Layers, title: "Full-Stack Development", desc: "Frontend + Backend mastery" },
  { icon: Lightbulb, title: "Beginner Tech Foundation", desc: "Start from zero" },
];

const modes = [
  { icon: BookOpen, title: "Self-Paced Learning", desc: "Learn on your own schedule" },
  { icon: Users, title: "Live Instructor-Led", desc: "Real-time classes with a teacher" },
  { icon: Handshake, title: "Mentorship & Accountability", desc: "Guided support and check-ins" },
  { icon: Rocket, title: "Project-Based Learning", desc: "Build real-world projects" },
  { icon: Layers, title: "Hybrid (Self + Mentor)", desc: "Flexibility meets guidance" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 hero-overlay opacity-80" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl"
          >
            Learn Coding With Structure,
            <br />
            <span className="text-gradient">Guidance, and Real Projects.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70"
          >
            Stop wandering. Choose your path, prove your discipline, and become a developer.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="min-w-[200px] text-base font-semibold">
                Start Free (1-Week Access)
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground/30 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10">
                Join Paid Program
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Independent Educator</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Meet Your Mentor
            </h2>
            <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start">
              <img
                src={founderAvatar}
                alt="Founder"
                className="h-32 w-32 rounded-full object-cover shadow-lg ring-4 ring-accent/20"
              />
              <div className="text-left">
                <p className="text-muted-foreground leading-relaxed">
                  "I'm not a bootcamp. I'm an independent tech educator dedicated to helping you break into the industry.
                  No false promises — just structured learning, real projects, and accountability."
                </p>
                <ul className="mt-6 space-y-3">
                  {["Focus on real-world projects", "Structured learning paths", "Direct mentorship & feedback"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Learning Tracks
          </h2>
          <p className="mt-3 text-muted-foreground">Choose a path that aligns with your goals.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t, i) => (
              <motion.div
                key={t.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <t.icon className="h-10 w-10 text-accent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
          <Link to="/tracks" className="mt-10 inline-block">
            <Button variant="outline" size="lg">Choose Your Track</Button>
          </Link>
        </div>
      </section>

      {/* Modes Overview */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Learning Modes
          </h2>
          <p className="mt-3 text-muted-foreground">Choose the level of structure and support you need.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((m, i) => (
              <motion.div
                key={m.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-background p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <m.icon className="h-10 w-10 text-accent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              </motion.div>
            ))}
          </div>
          <Link to="/modes" className="mt-10 inline-block">
            <Button variant="outline" size="lg">Select Learning Mode</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
