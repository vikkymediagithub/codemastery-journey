import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = ["Personal Info", "Tech Background", "Commitment", "Discipline", "Access Type"];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    experience: "",
    languages: "",
    hoursPerWeek: "",
    whyLearn: "",
    canCommit: false,
    accessType: "free",
    agreeTerms: false,
  });

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  if (submitted) {
    return (
      <Layout>
        <section className="flex min-h-[70vh] items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md text-center px-4"
          >
            <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
            <h2 className="mt-6 font-display text-3xl font-bold text-foreground">Application Submitted</h2>
            <p className="mt-4 text-muted-foreground">
              We'll review your application and get back to you shortly. Check your email for next steps.
            </p>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl">
            <h1 className="font-display text-3xl font-bold text-foreground text-center">Get Started</h1>
            <p className="mt-2 text-center text-muted-foreground">
              Complete the application to begin your journey.
            </p>

            {/* Progress */}
            <div className="mt-8 flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-colors ${
                      i <= step ? "bg-accent" : "bg-muted"
                    }`}
                  />
                  <span className={`text-[10px] font-medium ${i <= step ? "text-accent" : "text-muted-foreground"}`}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {step === 0 && (
                    <>
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Your country" className="mt-1.5" />
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div>
                        <Label>Experience Level</Label>
                        <Select value={form.experience} onValueChange={(v) => update("experience", v)}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select level" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No experience</SelectItem>
                            <SelectItem value="beginner">{"Beginner (< 6 months)"}</SelectItem>
                            <SelectItem value="intermediate">Intermediate (6–24 months)</SelectItem>
                            <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="languages">Languages / Technologies</Label>
                        <Input id="languages" value={form.languages} onChange={(e) => update("languages", e.target.value)} placeholder="e.g. HTML, CSS, JavaScript" className="mt-1.5" />
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <Label>Hours per week you can dedicate</Label>
                        <Select value={form.hoursPerWeek} onValueChange={(v) => update("hoursPerWeek", v)}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select hours" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 hours/week</SelectItem>
                            <SelectItem value="10">10 hours/week</SelectItem>
                            <SelectItem value="20">20 hours/week</SelectItem>
                            <SelectItem value="40">40+ hours/week (full-time)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="whyLearn">Why do you want to learn coding?</Label>
                        <textarea
                          id="whyLearn"
                          value={form.whyLearn}
                          onChange={(e) => update("whyLearn", e.target.value)}
                          placeholder="Tell us your motivation..."
                          rows={4}
                          className="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Coding requires discipline. Confirm that you understand:
                      </p>
                      <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3 text-sm text-foreground">
                        <p>• You will need to dedicate consistent hours each week.</p>
                        <p>• Progress depends on your effort and discipline.</p>
                        <p>• This program is not a shortcut — it's a structured path.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="canCommit"
                          checked={form.canCommit}
                          onCheckedChange={(c) => update("canCommit", !!c)}
                        />
                        <Label htmlFor="canCommit" className="text-sm leading-relaxed cursor-pointer">
                          I understand and commit to putting in the work.
                        </Label>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <div>
                        <Label>Access Type</Label>
                        <Select value={form.accessType} onValueChange={(v) => update("accessType", v)}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free (1-Week Access)</SelectItem>
                            <SelectItem value="paid">Paid Program</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="agreeTerms"
                          checked={form.agreeTerms}
                          onCheckedChange={(c) => update("agreeTerms", !!c)}
                        />
                        <Label htmlFor="agreeTerms" className="text-sm leading-relaxed cursor-pointer">
                          I understand free access lasts 7 days and continued learning requires payment.
                        </Label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between">
                <Button variant="ghost" onClick={prev} disabled={step === 0} className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button variant="secondary" onClick={next} className="gap-1">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    disabled={!form.agreeTerms}
                    onClick={() => setSubmitted(true)}
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OnboardingPage;
