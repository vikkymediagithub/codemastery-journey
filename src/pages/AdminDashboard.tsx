// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import Layout from "@/components/Layout";
// import { useAdminData, type LearnerRow } from "@/hooks/useAdminData";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/hooks/use-toast";
// import {
//   Users,
//   Shield,
//   Download,
//   Search,
//   Eye,
//   Lock,
//   Unlock,
//   BarChart3,
//   CreditCard,
//   TrendingUp,
//   UserCheck,
//   UserX,
//   CheckSquare,
//   GraduationCap,
//   Sparkles,
//   DollarSign,
// } from "lucide-react";

// const AdminDashboard = () => {
//   const { isAdmin, loading, learners, stats, updateEnrollmentStatus, updateAccessType } =
//     useAdminData();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [trackFilter, setTrackFilter] = useState<string>("all");
//   const [selected, setSelected] = useState<Set<string>>(new Set());
//   const [detailLearner, setDetailLearner] = useState<LearnerRow | null>(null);

//   const paidLearners = useMemo(
//     () => learners.filter((l) => l.enrollment?.access_type === "paid"),
//     [learners]
//   );
//   const freeLearners = useMemo(
//     () => learners.filter((l) => l.enrollment?.access_type === "free"),
//     [learners]
//   );

//   const filterLearners = (list: LearnerRow[]) =>
//     list.filter((l) => {
//       const matchSearch =
//         !search ||
//         l.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
//         l.profile.email.toLowerCase().includes(search.toLowerCase());
//       const matchStatus = statusFilter === "all" || l.enrollment?.status === statusFilter;
//       const matchTrack = trackFilter === "all" || l.enrollment?.learning_track === trackFilter;
//       return matchSearch && matchStatus && matchTrack;
//     });

//   const filteredPaid = useMemo(() => filterLearners(paidLearners), [paidLearners, search, statusFilter, trackFilter]);
//   const filteredFree = useMemo(() => filterLearners(freeLearners), [freeLearners, search, statusFilter, trackFilter]);

//   const toggleSelect = (id: string) => {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const handleBulkAction = async (action: "activate" | "lock") => {
//     const status = action === "activate" ? "active" : "locked";
//     let success = 0;
//     for (const id of selected) {
//       const ok = await updateEnrollmentStatus(id, status);
//       if (ok) success++;
//     }
//     toast({
//       title: `${success} enrollment${success !== 1 ? "s" : ""} ${action === "activate" ? "activated" : "locked"}`,
//     });
//     setSelected(new Set());
//   };

//   const exportCSV = () => {
//     const header = ["Name", "Email", "Country", "Track", "Mode", "Access", "Status", "Created"];
//     const rows = learners.map((l) => [
//       l.profile.full_name,
//       l.profile.email,
//       l.profile.country,
//       l.enrollment?.learning_track || "",
//       l.enrollment?.learning_mode || "",
//       l.enrollment?.access_type || "",
//       l.enrollment?.status || "",
//       l.profile.created_at?.split("T")[0] || "",
//     ]);
//     const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `learners-${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <Layout>
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <p className="text-muted-foreground">Access denied.</p>
//         </div>
//       </Layout>
//     );
//   }

//   const totalRevenue = learners
//     .filter((l) => l.payment?.status === "success")
//     .reduce((sum, l) => sum + (l.payment?.amount || 0), 0);

//   return (
//     <Layout>
//       <section className="py-8 bg-background min-h-screen">
//         <div className="container mx-auto px-4">
//           {/* Admin Header — distinct styling */}
//           <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
//                 <Shield className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="font-display text-2xl font-bold">Admin Control Panel</h1>
//                 <p className="text-sm opacity-80">Platform management & learner oversight</p>
//               </div>
//             </div>

//             {/* Stat pills */}
//             <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
//               {[
//                 { label: "Total", value: stats.total, icon: Users },
//                 { label: "Active", value: stats.active, icon: UserCheck },
//                 { label: "Locked", value: stats.locked, icon: UserX },
//                 { label: "Paid", value: stats.paid, icon: CreditCard },
//                 { label: "Free Trial", value: stats.free, icon: Sparkles },
//                 { label: "Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign },
//               ].map((s) => (
//                 <div
//                   key={s.label}
//                   className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm px-4 py-3"
//                 >
//                   <div className="flex items-center gap-1.5 text-xs font-medium opacity-70">
//                     <s.icon className="h-3.5 w-3.5" /> {s.label}
//                   </div>
//                   <p className="mt-1 font-display text-xl font-bold">{s.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Filters bar */}
//           <div className="flex flex-wrap items-center gap-3 mb-6">
//             <div className="relative flex-1 min-w-[200px]">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by name or email…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="locked">Locked</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={trackFilter} onValueChange={setTrackFilter}>
//               <SelectTrigger className="w-[140px]"><SelectValue placeholder="Track" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Tracks</SelectItem>
//                 <SelectItem value="foundation">Foundation</SelectItem>
//                 <SelectItem value="frontend">Frontend</SelectItem>
//                 <SelectItem value="backend">Backend</SelectItem>
//                 <SelectItem value="fullstack">Full-Stack</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
//               <Download className="h-4 w-4" /> Export
//             </Button>
//           </div>

//           {/* Bulk actions */}
//           {selected.size > 0 && (
//             <div className="mb-4 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 p-3">
//               <span className="text-sm font-medium text-foreground">{selected.size} selected</span>
//               <Button size="sm" variant="secondary" onClick={() => handleBulkAction("activate")} className="gap-1">
//                 <Unlock className="h-3.5 w-3.5" /> Activate
//               </Button>
//               <Button size="sm" variant="outline" onClick={() => handleBulkAction("lock")} className="gap-1">
//                 <Lock className="h-3.5 w-3.5" /> Lock
//               </Button>
//             </div>
//           )}

//           {/* Tabs: Paid Students | Free Trial | Payments */}
//           <Tabs defaultValue="paid">
//             <TabsList className="mb-6">
//               <TabsTrigger value="paid" className="gap-1.5">
//                 <CreditCard className="h-4 w-4" /> Paid Students ({filteredPaid.length})
//               </TabsTrigger>
//               <TabsTrigger value="free" className="gap-1.5">
//                 <Sparkles className="h-4 w-4" /> Free Trial ({filteredFree.length})
//               </TabsTrigger>
//               <TabsTrigger value="payments" className="gap-1.5">
//                 <DollarSign className="h-4 w-4" /> Payments
//               </TabsTrigger>
//             </TabsList>

//             {/* Paid Students */}
//             <TabsContent value="paid">
//               <LearnerTable
//                 learners={filteredPaid}
//                 selected={selected}
//                 toggleSelect={toggleSelect}
//                 onView={setDetailLearner}
//                 updateEnrollmentStatus={updateEnrollmentStatus}
//                 showTrack
//               />
//             </TabsContent>

//             {/* Free Trial Students */}
//             <TabsContent value="free">
//               <LearnerTable
//                 learners={filteredFree}
//                 selected={selected}
//                 toggleSelect={toggleSelect}
//                 onView={setDetailLearner}
//                 updateEnrollmentStatus={updateEnrollmentStatus}
//                 showExpiry
//               />
//             </TabsContent>

//             {/* Payments */}
//             <TabsContent value="payments">
//               <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Learner</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Date</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {learners
//                       .filter((l) => l.payment)
//                       .map((l) => (
//                         <TableRow key={l.payment!.id}>
//                           <TableCell className="font-medium">{l.profile.full_name}</TableCell>
//                           <TableCell>₦{l.payment!.amount.toLocaleString()}</TableCell>
//                           <TableCell className="font-mono text-xs">{l.payment!.reference}</TableCell>
//                           <TableCell>
//                             <Badge
//                               variant={
//                                 l.payment!.status === "success"
//                                   ? "default"
//                                   : l.payment!.status === "pending"
//                                   ? "secondary"
//                                   : "destructive"
//                               }
//                             >
//                               {l.payment!.status}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-muted-foreground text-sm">
//                             {l.payment!.created_at?.split("T")[0]}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     {learners.filter((l) => l.payment).length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
//                           No payments recorded yet
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>

//       {/* Detail Dialog */}
//       <LearnerDetailDialog
//         learner={detailLearner}
//         onClose={() => setDetailLearner(null)}
//         updateEnrollmentStatus={updateEnrollmentStatus}
//         updateAccessType={updateAccessType}
//       />
//     </Layout>
//   );
// };

// /* ── Reusable Learner Table ── */

// interface LearnerTableProps {
//   learners: LearnerRow[];
//   selected: Set<string>;
//   toggleSelect: (id: string) => void;
//   onView: (l: LearnerRow) => void;
//   updateEnrollmentStatus: (id: string, status: "active" | "locked") => Promise<boolean>;
//   showTrack?: boolean;
//   showExpiry?: boolean;
// }

// const LearnerTable = ({
//   learners,
//   selected,
//   toggleSelect,
//   onView,
//   updateEnrollmentStatus,
//   showTrack,
//   showExpiry,
// }: LearnerTableProps) => (
//   <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-10">
//             <CheckSquare className="h-4 w-4 text-muted-foreground" />
//           </TableHead>
//           <TableHead>Name</TableHead>
//           <TableHead>Email</TableHead>
//           {showTrack && <TableHead>Track</TableHead>}
//           <TableHead>Mode</TableHead>
//           <TableHead>Status</TableHead>
//           {showExpiry && <TableHead>Expires</TableHead>}
//           <TableHead>Joined</TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {learners.map((l) => {
//           const id = l.enrollment?.id || l.profile.id;
//           const expiry = l.enrollment?.free_expires_at;
//           const expired = expiry ? new Date(expiry) < new Date() : false;
//           return (
//             <TableRow key={l.profile.id}>
//               <TableCell>
//                 <input
//                   type="checkbox"
//                   checked={selected.has(id)}
//                   onChange={() => toggleSelect(id)}
//                   className="h-4 w-4 rounded border-input"
//                 />
//               </TableCell>
//               <TableCell className="font-medium">{l.profile.full_name}</TableCell>
//               <TableCell className="text-muted-foreground text-sm">{l.profile.email}</TableCell>
//               {showTrack && <TableCell>{formatTrack(l.enrollment?.learning_track)}</TableCell>}
//               <TableCell>{formatMode(l.enrollment?.learning_mode)}</TableCell>
//               <TableCell><StatusBadge status={l.enrollment?.status} /></TableCell>
//               {showExpiry && (
//                 <TableCell>
//                   {expiry ? (
//                     <span className={`text-sm ${expired ? "text-destructive font-medium" : "text-muted-foreground"}`}>
//                       {expired ? "Expired" : expiry.split("T")[0]}
//                     </span>
//                   ) : "—"}
//                 </TableCell>
//               )}
//               <TableCell className="text-muted-foreground text-sm">
//                 {l.profile.created_at?.split("T")[0]}
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-1">
//                   <Button variant="ghost" size="sm" onClick={() => onView(l)} className="h-8 w-8 p-0">
//                     <Eye className="h-4 w-4" />
//                   </Button>
//                   {l.enrollment?.status === "locked" ? (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={async () => {
//                         if (l.enrollment) {
//                           const ok = await updateEnrollmentStatus(l.enrollment.id, "active");
//                           if (ok) toast({ title: `${l.profile.full_name} activated` });
//                         }
//                       }}
//                       className="h-8 w-8 p-0 text-green-600"
//                     >
//                       <Unlock className="h-4 w-4" />
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={async () => {
//                         if (l.enrollment) {
//                           const ok = await updateEnrollmentStatus(l.enrollment.id, "locked");
//                           if (ok) toast({ title: `${l.profile.full_name} locked` });
//                         }
//                       }}
//                       className="h-8 w-8 p-0 text-amber-500"
//                     >
//                       <Lock className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               </TableCell>
//             </TableRow>
//           );
//         })}
//         {learners.length === 0 && (
//           <TableRow>
//             <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
//               No learners in this category
//             </TableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//     <p className="px-4 py-2 text-xs text-muted-foreground">
//       {learners.length} learner{learners.length !== 1 ? "s" : ""}
//     </p>
//   </div>
// );

// /* ── Sub-components ── */

// const StatusBadge = ({ status }: { status?: string }) => {
//   if (status === "active")
//     return (
//       <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
//         <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500">
//       <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Locked
//     </span>
//   );
// };

// const LearnerDetailDialog = ({
//   learner,
//   onClose,
//   updateEnrollmentStatus,
//   updateAccessType,
// }: {
//   learner: LearnerRow | null;
//   onClose: () => void;
//   updateEnrollmentStatus: (id: string, status: "active" | "locked") => Promise<boolean>;
//   updateAccessType: (id: string, accessType: "free" | "paid") => Promise<boolean>;
// }) => {
//   if (!learner) return null;
//   const { profile, enrollment, payment } = learner;

//   return (
//     <Dialog open={!!learner} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="font-display">{profile.full_name}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 text-sm">
//           <div className="grid grid-cols-2 gap-3">
//             <DetailField label="Email" value={profile.email} />
//             <DetailField label="Country" value={profile.country || "—"} />
//             <DetailField label="Track" value={formatTrack(enrollment?.learning_track)} />
//             <DetailField label="Mode" value={formatMode(enrollment?.learning_mode)} />
//             <DetailField label="Access" value={enrollment?.access_type || "—"} />
//             <DetailField label="Status" value={enrollment?.status || "—"} />
//             <DetailField label="Joined" value={profile.created_at?.split("T")[0] || "—"} />
//             {enrollment?.free_expires_at && (
//               <DetailField label="Expires" value={enrollment.free_expires_at.split("T")[0]} />
//             )}
//           </div>

//           {payment && (
//             <div className="rounded-lg border border-border bg-muted/50 p-3">
//               <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
//                 Payment
//               </p>
//               <div className="grid grid-cols-2 gap-2">
//                 <DetailField label="Amount" value={`₦${payment.amount.toLocaleString()} ${payment.currency}`} />
//                 <DetailField label="Status" value={payment.status} />
//                 <DetailField label="Ref" value={payment.reference} />
//                 <DetailField label="Provider" value={payment.provider} />
//               </div>
//             </div>
//           )}

//           <div className="flex flex-wrap gap-2 pt-2">
//             {enrollment?.status === "locked" ? (
//               <Button
//                 size="sm"
//                 variant="secondary"
//                 onClick={async () => {
//                   if (enrollment) {
//                     const ok = await updateEnrollmentStatus(enrollment.id, "active");
//                     if (ok) { toast({ title: `${profile.full_name} activated` }); onClose(); }
//                   }
//                 }}
//                 className="gap-1"
//               >
//                 <Unlock className="h-4 w-4" /> Approve & Activate
//               </Button>
//             ) : (
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={async () => {
//                   if (enrollment) {
//                     const ok = await updateEnrollmentStatus(enrollment.id, "locked");
//                     if (ok) { toast({ title: `${profile.full_name} locked` }); onClose(); }
//                   }
//                 }}
//                 className="gap-1"
//               >
//                 <Lock className="h-4 w-4" /> Lock Account
//               </Button>
//             )}
//             {enrollment?.access_type === "free" && (
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={async () => {
//                   if (enrollment) {
//                     const ok = await updateAccessType(enrollment.id, "paid");
//                     if (ok) { toast({ title: `${profile.full_name} upgraded to paid` }); onClose(); }
//                   }
//                 }}
//                 className="gap-1"
//               >
//                 <CreditCard className="h-4 w-4" /> Upgrade to Paid
//               </Button>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// const DetailField = ({ label, value }: { label: string; value: string }) => (
//   <div>
//     <span className="text-muted-foreground">{label}</span>
//     <p className="font-medium text-foreground">{value}</p>
//   </div>
// );

// const formatTrack = (t?: string) => {
//   const map: Record<string, string> = { frontend: "Frontend", backend: "Backend", fullstack: "Full-Stack", foundation: "Foundation" };
//   return map[t || ""] || t || "—";
// };

// const formatMode = (m?: string) => {
//   const map: Record<string, string> = { self_paced: "Self-Paced", live: "Live", mentorship: "Mentorship", project: "Project-Based", hybrid: "Hybrid" };
//   return map[m || ""] || m || "—";
// };

// export default AdminDashboard;




import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAdminData, type LearnerRow } from "@/hooks/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Eye,
  Lock,
  Unlock,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  Sparkles,
  DollarSign,
} from "lucide-react";

const AdminDashboard = () => {
  const {
    isAdmin,
    loading,
    learners,
    stats,
    updateEnrollmentStatus,
    updateAccessType,
    extendTrial,
  } = useAdminData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [detailLearner, setDetailLearner] = useState<LearnerRow | null>(null);

  const paidLearners = useMemo(() => learners.filter((l) => l.enrollment?.access_type === "paid"), [learners]);
  const freeLearners = useMemo(() => learners.filter((l) => l.enrollment?.access_type === "free"), [learners]);

  const filterLearners = (list: LearnerRow[]) =>
    list.filter((l) => {
      const matchSearch =
        !search ||
        l.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
        l.profile.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || l.enrollment?.status === statusFilter;
      const matchTrack = trackFilter === "all" || l.enrollment?.learning_track === trackFilter;
      return matchSearch && matchStatus && matchTrack;
    });

  const filteredPaid = useMemo(() => filterLearners(paidLearners), [paidLearners, search, statusFilter, trackFilter]);
  const filteredFree = useMemo(() => filterLearners(freeLearners), [freeLearners, search, statusFilter, trackFilter]);

  const totalRevenue = learners
    .filter((l) => l.payment?.status === "success")
    .reduce((sum, l) => sum + (l.payment?.amount || 0), 0);

  const conversionRate =
    stats.paid + stats.free > 0 ? ((stats.paid / (stats.paid + stats.free)) * 100).toFixed(1) : "0";

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
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">

          {/* Header Stats */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <div>
                <h1 className="font-display text-2xl font-bold">Admin Control Panel</h1>
                <p className="text-sm opacity-80">Platform analytics & learner oversight</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              {[
                { label: "Total", value: stats.total, icon: Users },
                { label: "Active", value: stats.active, icon: UserCheck },
                { label: "Locked", value: stats.locked, icon: UserX },
                { label: "Paid", value: stats.paid, icon: CreditCard },
                { label: "Free", value: stats.free, icon: Sparkles },
                { label: "Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign },
                { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-primary-foreground/10 px-4 py-3">
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </div>
                  <p className="mt-1 font-display text-xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs for Paid / Free */}
          <Tabs defaultValue="paid">
            <TabsList className="mb-6">
              <TabsTrigger value="paid">Paid ({filteredPaid.length})</TabsTrigger>
              <TabsTrigger value="free">Free Trial ({filteredFree.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="paid">
              <LearnerTable
                learners={filteredPaid}
                showTrack
                setDetailLearner={setDetailLearner}
              />
            </TabsContent>

            <TabsContent value="free">
              <LearnerTable
                learners={filteredFree}
                showExpiry
                setDetailLearner={setDetailLearner}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <LearnerDetailDialog
        learner={detailLearner}
        onClose={() => setDetailLearner(null)}
        updateEnrollmentStatus={updateEnrollmentStatus}
        updateAccessType={updateAccessType}
        extendTrial={extendTrial}
      />
    </Layout>
  );
};

/* ---------------- Learner Table ---------------- */

const LearnerTable = ({ learners, showTrack, showExpiry, setDetailLearner }: any) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          {showTrack && <TableHead>Track</TableHead>}
          <TableHead>Status</TableHead>
          {showExpiry && <TableHead>Trial</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {learners.map((l: LearnerRow) => {
          const expiry = l.enrollment?.free_expires_at;
          let daysLeft: number | null = null;
          let expired = false;
          if (expiry) {
            const diff = new Date(expiry).getTime() - new Date().getTime();
            daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            expired = daysLeft < 0;
          }

          return (
            <TableRow key={l.profile.id}>
              <TableCell className="font-medium">{l.profile.full_name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{l.profile.email}</TableCell>
              {showTrack && <TableCell>{l.enrollment?.learning_track}</TableCell>}
              <TableCell>
                {l.enrollment?.status === "active" ? (
                  <span className="text-green-600 text-xs font-medium">Active</span>
                ) : (
                  <span className="text-amber-500 text-xs font-medium">Locked</span>
                )}
              </TableCell>
              {showExpiry && (
                <TableCell>
                  {expiry ? (
                    expired ? (
                      <span className="text-destructive text-sm font-medium">Expired</span>
                    ) : daysLeft !== null && daysLeft <= 2 ? (
                      <span className="text-amber-500 text-sm font-medium">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
                    )
                  ) : "—"}
                </TableCell>
              )}
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setDetailLearner(l)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

/* ---------------- Detail Dialog ---------------- */

const LearnerDetailDialog = ({ learner, onClose, updateEnrollmentStatus, updateAccessType, extendTrial }: any) => {
  if (!learner) return null;
  const { profile, enrollment } = learner;

  return (
    <Dialog open={!!learner} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{profile.full_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p>Email: {profile.email}</p>
          <p>Access: {enrollment?.access_type}</p>
          <p>Status: {enrollment?.status}</p>

          <div className="flex gap-2 pt-4">
            {enrollment?.status === "locked" ? (
              <Button
                size="sm"
                onClick={async () => {
                  await updateEnrollmentStatus(enrollment.id, "active");
                  onClose();
                }}
              >
                <Unlock className="h-4 w-4" /> Activate
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await updateEnrollmentStatus(enrollment.id, "locked");
                  onClose();
                }}
              >
                <Lock className="h-4 w-4" /> Lock
              </Button>
            )}

            {enrollment?.access_type === "free" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await updateAccessType(enrollment.id, "paid");
                    toast({ title: "User upgraded to paid" });
                    onClose();
                  }}
                >
                  <CreditCard className="h-4 w-4" /> Upgrade
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await extendTrial(enrollment.id, 3);
                    toast({ title: "Trial extended by 3 days" });
                    onClose();
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Extend 3 Days
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
