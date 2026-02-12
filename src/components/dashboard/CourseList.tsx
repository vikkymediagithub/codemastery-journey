// import { motion } from "framer-motion";
// import { trackCourses, type Course } from "@/data/courses";
// import { BookOpen, Clock, Layers, GraduationCap } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// interface CourseListProps {
//   track: string;
// }

// const levelColor: Record<string, string> = {
//   Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//   Advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
// };

// const CourseList = ({ track }: CourseListProps) => {
//   const courses = trackCourses[track] || trackCourses["foundation"];

//   return (
//     <div className="space-y-4">
//       {courses.map((course, i) => (
//         <motion.div
//           key={course.id}
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: i * 0.06, duration: 0.35 }}
//           className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
//         >
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1.5">
//                 <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent text-xs font-bold">
//                   {i + 1}
//                 </span>
//                 <h4 className="font-display text-base font-semibold text-foreground">
//                   {course.title}
//                 </h4>
//               </div>
//               <p className="text-sm text-muted-foreground ml-9">{course.description}</p>
//               <div className="mt-3 ml-9 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
//                 <span className="flex items-center gap-1">
//                   <Layers className="h-3.5 w-3.5" /> {course.modules} modules
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Clock className="h-3.5 w-3.5" /> {course.duration}
//                 </span>
//                 <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${levelColor[course.level]}`}>
//                   {course.level}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default CourseList;







// import { useState } from "react";
// import { motion } from "framer-motion";
// import { trackCourses } from "@/data/courses";
// import {
//   Clock,
//   Layers,
//   Lock,
//   PlayCircle,
//   CreditCard,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { usePayment } from "@/hooks/usePayment";

// interface CourseListProps {
//   track: string;
//   accessType: "free" | "paid";
//   isTrialExpired?: boolean;
// }

// const levelColor: Record<string, string> = {
//   Beginner:
//     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   Intermediate:
//     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//   Advanced:
//     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
// };

// const CourseList = ({
//   track,
//   accessType,
//   isTrialExpired,
// }: CourseListProps) => {
//   const courses = trackCourses[track] || trackCourses["foundation"];
//   const [lockedCourse, setLockedCourse] = useState<any | null>(null);
//   const { initializePayment, amount, loading } = usePayment();

//   const hasFullAccess = accessType === "paid";

//   return (
//     <>
//       <div className="space-y-4">
//         {courses.map((course, i) => {
//           const isFreePreview = i === 0; // only first course free
//           const canAccess =
//             hasFullAccess ||
//             (accessType === "free" && !isTrialExpired && isFreePreview);

//           return (
//             <motion.div
//               key={course.id}
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//               className="relative group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition"
//             >
//               {/* LOCK OVERLAY */}
//               {!canAccess && (
//                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm">
//                   <Lock className="h-6 w-6 text-muted-foreground mb-2" />
//                   <p className="text-sm font-medium text-foreground">
//                     Premium Content
//                   </p>
//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     className="mt-3 gap-1.5"
//                     onClick={() => setLockedCourse(course)}
//                   >
//                     <CreditCard className="h-4 w-4" />
//                     Upgrade to Unlock
//                   </Button>
//                 </div>
//               )}

//               <div className={`${!canAccess ? "opacity-50" : ""}`}>
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent text-xs font-bold">
//                     {i + 1}
//                   </span>
//                   <h4 className="font-display text-base font-semibold text-foreground">
//                     {course.title}
//                   </h4>
//                   {isFreePreview && accessType === "free" && (
//                     <Badge variant="secondary">Free Preview</Badge>
//                   )}
//                 </div>

//                 <p className="text-sm text-muted-foreground ml-9">
//                   {course.description}
//                 </p>

//                 <div className="mt-3 ml-9 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
//                   <span className="flex items-center gap-1">
//                     <Layers className="h-3.5 w-3.5" /> {course.modules} modules
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Clock className="h-3.5 w-3.5" /> {course.duration}
//                   </span>
//                   <span
//                     className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${levelColor[course.level]}`}
//                   >
//                     {course.level}
//                   </span>
//                 </div>

//                 {canAccess && (
//                   <div className="mt-4 ml-9">
//                     <Button size="sm" className="gap-1.5">
//                       <PlayCircle className="h-4 w-4" />
//                       Start Course
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* UPGRADE MODAL */}
//       <Dialog open={!!lockedCourse} onOpenChange={() => setLockedCourse(null)}>
//         <DialogContent className="max-w-md text-center">
//           <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
//           <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
//             Unlock Full Curriculum
//           </h3>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Upgrade to access all modules, projects, mentorship, and downloadable
//             resources.
//           </p>
//           <Button
//             variant="secondary"
//             className="mt-5 gap-1.5"
//             onClick={initializePayment}
//             disabled={loading}
//           >
//             <CreditCard className="h-4 w-4" />
//             {loading ? "Processing…" : `Upgrade — ₦${amount.toLocaleString()}`}
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default CourseList;



import { useState } from "react";
import { motion } from "framer-motion";
import { trackCourses } from "@/data/courses";
import {
  Clock,
  Layers,
  Lock,
  PlayCircle,
  CreditCard,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePayment } from "@/hooks/usePayment";

interface CourseListProps {
  track: string;
  accessType: "free" | "paid";
  isTrialExpired?: boolean;
}

const levelColor: Record<string, string> = {
  Beginner:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Advanced:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const CourseList = ({
  track,
  accessType,
  isTrialExpired = false,
}: CourseListProps) => {
  const courses = trackCourses[track] || trackCourses["foundation"];
  const [lockedLesson, setLockedLesson] = useState<any | null>(null);
  const { initializePayment, amount, loading } = usePayment();

  const hasFullAccess =
    accessType === "paid" || (accessType === "free" && !isTrialExpired);

  const canAccessLesson = (lesson: any) => {
    if (hasFullAccess) return true;
    return lesson.isPreview === true;
  };

  return (
    <>
      <div className="space-y-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            {/* Course Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">
                  {course.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>
              <Badge className={levelColor[course.level]}>
                {course.level}
              </Badge>
            </div>

            {/* Lessons */}
            <div className="mt-4 space-y-3">
              {course.lessons.map((lesson) => {
                const accessible = canAccessLesson(lesson);

                return (
                  <div
                    key={lesson.id}
                    className="relative flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/5 transition"
                  >
                    <div
                      className={`flex items-center gap-3 ${
                        !accessible ? "opacity-50" : ""
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                      <span className="text-sm">{lesson.title}</span>
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {lesson.duration}
                      </span>

                      {lesson.isPreview && !hasFullAccess && (
                        <Badge variant="secondary" className="ml-2">
                          Preview
                        </Badge>
                      )}
                    </div>

                    {accessible ? (
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <PlayCircle className="h-4 w-4" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5"
                        onClick={() => setLockedLesson({ course, lesson })}
                      >
                        <Lock className="h-4 w-4" />
                        Unlock
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upgrade Modal */}
      <Dialog open={!!lockedLesson} onOpenChange={() => setLockedLesson(null)}>
        <DialogContent className="max-w-md text-center">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground" />

          <h3 className="mt-4 font-display text-lg font-semibold">
            Unlock Full Access
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Upgrade to access all lessons, projects, mentorship, and
            downloadable resources.
          </p>

          <Button
            variant="secondary"
            className="mt-6 w-full gap-2"
            onClick={initializePayment}
            disabled={loading}
          >
            <CreditCard className="h-4 w-4" />
            {loading ? "Processing…" : `Upgrade — ₦${amount.toLocaleString()}`}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseList;
