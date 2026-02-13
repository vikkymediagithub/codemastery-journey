import { useState } from "react";
import { motion } from "framer-motion";
import { trackCourses } from "@/data/courses";
import {
  Clock,
  Layers,
  Lock,
  PlayCircle,
  CreditCard,
  Video,
  Code,
  HelpCircle,
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

const lessonTypeIcon: Record<string, React.ElementType> = {
  video: Video,
  project: Code,
  quiz: HelpCircle,
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
      <div className="space-y-5 mt-4">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
          >
            {/* Course Header */}
            <div className="p-5 pb-3 border-b border-border/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <h4 className="font-semibold text-base text-foreground">
                      {course.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">
                    {course.description}
                  </p>
                </div>
                <Badge className={`shrink-0 ${levelColor[course.level]}`}>
                  {course.level}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-2 ml-9 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {course.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {course.duration}
                </span>
              </div>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-border/50">
              {course.lessons.map((lesson) => {
                const accessible = canAccessLesson(lesson);
                const TypeIcon = lessonTypeIcon[lesson.type] || Layers;

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between px-5 py-3 transition hover:bg-accent/5 ${
                      !accessible ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground truncate">
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {lesson.duration}
                      </span>
                      {lesson.isPreview && !hasFullAccess && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Preview
                        </Badge>
                      )}
                    </div>

                    {accessible ? (
                      <Button size="sm" variant="ghost" className="gap-1.5 shrink-0">
                        <PlayCircle className="h-4 w-4" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 shrink-0"
                        onClick={() => setLockedLesson({ course, lesson })}
                      >
                        <Lock className="h-3.5 w-3.5" />
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
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Unlock Full Access
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upgrade to access all lessons, projects, mentorship, and
            downloadable resources.
          </p>
          <Button
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
