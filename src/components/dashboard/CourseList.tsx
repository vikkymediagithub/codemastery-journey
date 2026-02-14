

// This is an EXAMPLE - Update your actual CourseList.tsx to match this pattern

import { Lock, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseListProps {
  track: string;
  accessType: "free" | "paid";
  isTrialExpired: boolean;
  isLocked: boolean;
  canAccess: boolean;
}

const CourseList = ({ 
  track, 
  accessType, 
  isTrialExpired, 
  isLocked,
  canAccess 
}: CourseListProps) => {
  
  // Sample courses - replace with your actual course data
  const courses = [
    { id: 1, title: "HTML Fundamentals", track: "foundation", free: true },
    { id: 2, title: "CSS Styling", track: "foundation", free: true },
    { id: 3, title: "JavaScript Basics", track: "foundation", free: false },
    { id: 4, title: "React Framework", track: "frontend", free: false },
    // ... more courses
  ];

  const relevantCourses = courses.filter(c => 
    c.track === track || track === "fullstack"
  );

  // Show message if user can't access courses
  if (!canAccess) {
    if (isTrialExpired) {
      return (
        <div className="mt-4 rounded-xl border border-destructive bg-destructive/5 p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-3 font-semibold">Trial Expired</p>
          <p className="text-sm text-muted-foreground">
            Upgrade to access your courses
          </p>
        </div>
      );
    }

    if (isLocked) {
      return (
        <div className="mt-4 rounded-xl border border-amber-500 bg-amber-50 dark:bg-amber-950 p-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-amber-600" />
          <p className="mt-3 font-semibold text-amber-900 dark:text-amber-100">
            Awaiting Approval
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Your courses will be available once your application is approved
          </p>
        </div>
      );
    }
  }

  // User can access - show courses
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {relevantCourses.map((course) => {
        const isAccessible = accessType === "paid" || course.free;

        return (
          <div
            key={course.id}
            className={`relative rounded-xl border bg-card p-6 shadow-sm transition-opacity ${
              !isAccessible ? "opacity-60" : ""
            }`}
          >
            {!isAccessible && (
              <div className="absolute top-2 right-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            
            <h4 className="font-semibold">{course.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {course.free ? "Free Preview" : "Premium Content"}
            </p>

            {isAccessible ? (
              <Button size="sm" className="mt-4 w-full">
                Start Learning
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-4 w-full" disabled>
                Locked
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseList;