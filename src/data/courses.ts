export interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export const trackCourses: Record<string, Course[]> = {
  frontend: [
    { id: "fe-1", title: "HTML & CSS Fundamentals", description: "Build responsive web pages from scratch with semantic HTML and modern CSS.", modules: 8, duration: "3 weeks", level: "Beginner" },
    { id: "fe-2", title: "JavaScript Essentials", description: "Master core JavaScript concepts including DOM manipulation and async programming.", modules: 10, duration: "4 weeks", level: "Beginner" },
    { id: "fe-3", title: "React Development", description: "Build dynamic single-page applications with React, hooks, and state management.", modules: 12, duration: "5 weeks", level: "Intermediate" },
    { id: "fe-4", title: "TypeScript & Testing", description: "Add type safety and write reliable tests for your frontend applications.", modules: 6, duration: "2 weeks", level: "Intermediate" },
    { id: "fe-5", title: "Frontend Capstone Project", description: "Build a full production-ready frontend application with CI/CD deployment.", modules: 4, duration: "3 weeks", level: "Advanced" },
  ],
  backend: [
    { id: "be-1", title: "Programming Fundamentals", description: "Learn core programming concepts with Python or Node.js.", modules: 8, duration: "3 weeks", level: "Beginner" },
    { id: "be-2", title: "Databases & SQL", description: "Design schemas, write queries, and manage relational databases.", modules: 8, duration: "3 weeks", level: "Beginner" },
    { id: "be-3", title: "REST API Development", description: "Build scalable RESTful APIs with authentication and middleware.", modules: 10, duration: "4 weeks", level: "Intermediate" },
    { id: "be-4", title: "Cloud & DevOps", description: "Deploy applications with Docker, CI/CD pipelines, and cloud services.", modules: 6, duration: "3 weeks", level: "Intermediate" },
    { id: "be-5", title: "Backend Capstone Project", description: "Build and deploy a production-grade API with documentation.", modules: 4, duration: "3 weeks", level: "Advanced" },
  ],
  fullstack: [
    { id: "fs-1", title: "Web Foundations", description: "HTML, CSS, JavaScript — the building blocks of the web.", modules: 10, duration: "4 weeks", level: "Beginner" },
    { id: "fs-2", title: "Frontend with React", description: "Build interactive UIs with React and modern frontend tooling.", modules: 10, duration: "4 weeks", level: "Intermediate" },
    { id: "fs-3", title: "Backend & Databases", description: "Server-side development with Node.js, Express, and PostgreSQL.", modules: 10, duration: "4 weeks", level: "Intermediate" },
    { id: "fs-4", title: "Full-Stack Integration", description: "Connect frontend and backend, authentication, and real-time features.", modules: 8, duration: "3 weeks", level: "Advanced" },
    { id: "fs-5", title: "Full-Stack Capstone", description: "Ship a complete full-stack application from idea to deployment.", modules: 4, duration: "3 weeks", level: "Advanced" },
  ],
  foundation: [
    { id: "fn-1", title: "Computer Literacy", description: "Essential computer skills, file management, and internet navigation.", modules: 6, duration: "2 weeks", level: "Beginner" },
    { id: "fn-2", title: "Introduction to Programming", description: "Learn programming logic, variables, loops, and functions.", modules: 8, duration: "3 weeks", level: "Beginner" },
    { id: "fn-3", title: "Web Basics", description: "Understand how the web works — HTML, CSS, and basic JavaScript.", modules: 8, duration: "3 weeks", level: "Beginner" },
    { id: "fn-4", title: "Problem Solving & Algorithms", description: "Develop computational thinking and solve coding challenges.", modules: 6, duration: "2 weeks", level: "Beginner" },
  ],
};
