import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAdminData, type LearnerRow } from "@/hooks/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Shield,
  Download,
  Search,
  Eye,
  Lock,
  Unlock,
  BarChart3,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  CheckSquare,
} from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, loading, learners, stats, updateEnrollmentStatus, updateAccessType } =
    useAdminData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailLearner, setDetailLearner] = useState<LearnerRow | null>(null);

  const filtered = useMemo(() => {
    return learners.filter((l) => {
      const matchSearch =
        !search ||
        l.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
        l.profile.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || l.enrollment?.status === statusFilter;
      const matchAccess = accessFilter === "all" || l.enrollment?.access_type === accessFilter;
      const matchTrack = trackFilter === "all" || l.enrollment?.learning_track === trackFilter;
      return matchSearch && matchStatus && matchAccess && matchTrack;
    });
  }, [learners, search, statusFilter, accessFilter, trackFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.enrollment?.id || l.profile.id)));
    }
  };

  const handleBulkAction = async (action: "activate" | "lock") => {
    const status = action === "activate" ? "active" : "locked";
    let success = 0;
    for (const id of selected) {
      const ok = await updateEnrollmentStatus(id, status);
      if (ok) success++;
    }
    toast({
      title: `${success} enrollment${success !== 1 ? "s" : ""} ${action === "activate" ? "activated" : "locked"}`,
    });
    setSelected(new Set());
  };

  const exportCSV = () => {
    const header = ["Name", "Email", "Country", "Track", "Mode", "Access", "Status", "Created"];
    const rows = filtered.map((l) => [
      l.profile.full_name,
      l.profile.email,
      l.profile.country,
      l.enrollment?.learning_track || "",
      l.enrollment?.learning_mode || "",
      l.enrollment?.access_type || "",
      l.enrollment?.status || "",
      l.profile.created_at?.split("T")[0] || "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learners-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Access denied.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-7 w-7 text-accent" />
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage learners and monitor platform activity</p>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="gap-1.5">
                <BarChart3 className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="learners" className="gap-1.5">
                <Users className="h-4 w-4" /> Learners
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-1.5">
                <CreditCard className="h-4 w-4" /> Payments
              </TabsTrigger>
            </TabsList>

            {/* ── Overview Tab ── */}
            <TabsContent value="overview">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { icon: Users, label: "Total Learners", value: stats.total, color: "text-accent" },
                  { icon: UserCheck, label: "Active", value: stats.active, color: "text-green-500" },
                  { icon: UserX, label: "Locked", value: stats.locked, color: "text-amber-500" },
                  { icon: TrendingUp, label: "Free Users", value: stats.free, color: "text-blue-500" },
                  { icon: CreditCard, label: "Paid Users", value: stats.paid, color: "text-purple-500" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Recent Applications
                </h3>
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {learners.slice(0, 5).map((l) => (
                        <TableRow
                          key={l.profile.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setDetailLearner(l)}
                        >
                          <TableCell className="font-medium">{l.profile.full_name}</TableCell>
                          <TableCell>{formatTrack(l.enrollment?.learning_track)}</TableCell>
                          <TableCell>
                            <Badge variant={l.enrollment?.access_type === "paid" ? "default" : "secondary"}>
                              {l.enrollment?.access_type || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={l.enrollment?.status} />
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {l.profile.created_at?.split("T")[0]}
                          </TableCell>
                        </TableRow>
                      ))}
                      {learners.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No learners yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* ── Learners Tab ── */}
            <TabsContent value="learners">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={accessFilter} onValueChange={setAccessFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Access</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={trackFilter} onValueChange={setTrackFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tracks</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Full-Stack</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
              </div>

              {/* Bulk Actions */}
              {selected.size > 0 && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 p-3">
                  <span className="text-sm font-medium text-foreground">
                    {selected.size} selected
                  </span>
                  <Button size="sm" variant="secondary" onClick={() => handleBulkAction("activate")} className="gap-1">
                    <Unlock className="h-3.5 w-3.5" /> Activate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("lock")} className="gap-1">
                    <Lock className="h-3.5 w-3.5" /> Lock
                  </Button>
                </div>
              )}

              {/* Table */}
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <button onClick={toggleAll} className="p-1">
                          <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Track</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((l) => {
                      const id = l.enrollment?.id || l.profile.id;
                      return (
                        <TableRow key={l.profile.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selected.has(id)}
                              onChange={() => toggleSelect(id)}
                              className="h-4 w-4 rounded border-input"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{l.profile.full_name}</TableCell>
                          <TableCell className="text-muted-foreground">{l.profile.email}</TableCell>
                          <TableCell>{formatTrack(l.enrollment?.learning_track)}</TableCell>
                          <TableCell>
                            <Badge variant={l.enrollment?.access_type === "paid" ? "default" : "secondary"}>
                              {l.enrollment?.access_type || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={l.enrollment?.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDetailLearner(l)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {l.enrollment?.status === "locked" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    if (l.enrollment) {
                                      const ok = await updateEnrollmentStatus(l.enrollment.id, "active");
                                      if (ok) toast({ title: `${l.profile.full_name} activated` });
                                    }
                                  }}
                                  className="h-8 w-8 p-0 text-green-600"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    if (l.enrollment) {
                                      const ok = await updateEnrollmentStatus(l.enrollment.id, "locked");
                                      if (ok) toast({ title: `${l.profile.full_name} locked` });
                                    }
                                  }}
                                  className="h-8 w-8 p-0 text-amber-500"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No learners match your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Showing {filtered.length} of {learners.length} learners
              </p>
            </TabsContent>

            {/* ── Payments Tab ── */}
            <TabsContent value="payments">
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {learners
                      .filter((l) => l.payment)
                      .map((l) => (
                        <TableRow key={l.payment!.id}>
                          <TableCell className="font-medium">{l.profile.full_name}</TableCell>
                          <TableCell>{l.payment!.amount.toLocaleString()}</TableCell>
                          <TableCell>{l.payment!.currency}</TableCell>
                          <TableCell>{l.payment!.provider}</TableCell>
                          <TableCell className="font-mono text-xs">{l.payment!.reference}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                l.payment!.status === "success"
                                  ? "default"
                                  : l.payment!.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {l.payment!.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {l.payment!.created_at?.split("T")[0]}
                          </TableCell>
                        </TableRow>
                      ))}
                    {learners.filter((l) => l.payment).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No payments recorded yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Detail Dialog */}
      <LearnerDetailDialog
        learner={detailLearner}
        onClose={() => setDetailLearner(null)}
        onActivate={async () => {
          if (detailLearner?.enrollment) {
            const ok = await updateEnrollmentStatus(detailLearner.enrollment.id, "active");
            if (ok) {
              toast({ title: `${detailLearner.profile.full_name} activated` });
              setDetailLearner(null);
            }
          }
        }}
        onLock={async () => {
          if (detailLearner?.enrollment) {
            const ok = await updateEnrollmentStatus(detailLearner.enrollment.id, "locked");
            if (ok) {
              toast({ title: `${detailLearner.profile.full_name} locked` });
              setDetailLearner(null);
            }
          }
        }}
      />
    </Layout>
  );
};

/* ── Sub-components ── */

const StatusBadge = ({ status }: { status?: string }) => {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Locked
    </span>
  );
};

const LearnerDetailDialog = ({
  learner,
  onClose,
  onActivate,
  onLock,
}: {
  learner: LearnerRow | null;
  onClose: () => void;
  onActivate: () => void;
  onLock: () => void;
}) => {
  if (!learner) return null;
  const { profile, enrollment, payment } = learner;

  return (
    <Dialog open={!!learner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{profile.full_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Email" value={profile.email} />
            <DetailField label="Country" value={profile.country || "—"} />
            <DetailField label="Track" value={formatTrack(enrollment?.learning_track)} />
            <DetailField label="Mode" value={formatMode(enrollment?.learning_mode)} />
            <DetailField label="Access" value={enrollment?.access_type || "—"} />
            <DetailField label="Status" value={enrollment?.status || "—"} />
            <DetailField label="Joined" value={profile.created_at?.split("T")[0] || "—"} />
            {enrollment?.free_expires_at && (
              <DetailField label="Expires" value={enrollment.free_expires_at.split("T")[0]} />
            )}
          </div>

          {payment && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Payment
              </p>
              <div className="grid grid-cols-2 gap-2">
                <DetailField label="Amount" value={`${payment.amount} ${payment.currency}`} />
                <DetailField label="Status" value={payment.status} />
                <DetailField label="Ref" value={payment.reference} />
                <DetailField label="Provider" value={payment.provider} />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {enrollment?.status === "locked" ? (
              <Button size="sm" variant="secondary" onClick={onActivate} className="gap-1">
                <Unlock className="h-4 w-4" /> Approve & Activate
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={onLock} className="gap-1">
                <Lock className="h-4 w-4" /> Lock Account
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-muted-foreground">{label}</span>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

const formatTrack = (t?: string) => {
  const map: Record<string, string> = { frontend: "Frontend", backend: "Backend", fullstack: "Full-Stack", foundation: "Foundation" };
  return map[t || ""] || t || "—";
};

const formatMode = (m?: string) => {
  const map: Record<string, string> = { self_paced: "Self-Paced", live: "Live", mentorship: "Mentorship", project: "Project-Based", hybrid: "Hybrid" };
  return map[m || ""] || m || "—";
};

export default AdminDashboard;
