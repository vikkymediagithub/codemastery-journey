import { motion } from "framer-motion";
import { trackCourses, type Course } from "@/data/courses";
import { BookOpen, Clock, Layers, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseListProps {
  track: string;
}

const levelColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const CourseList = ({ track }: CourseListProps) => {
  const courses = trackCourses[track] || trackCourses["foundation"];

  return (
    <div className="space-y-4">
      {courses.map((course, i) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent text-xs font-bold">
                  {i + 1}
                </span>
                <h4 className="font-display text-base font-semibold text-foreground">
                  {course.title}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground ml-9">{course.description}</p>
              <div className="mt-3 ml-9 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" /> {course.modules} modules
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {course.duration}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${levelColor[course.level]}`}>
                  {course.level}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseList;
