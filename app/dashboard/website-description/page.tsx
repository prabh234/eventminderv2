"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function AboutUs() {
  return (
    
    <div className=" flex items-center justify-center p-6">
      {/* Container */}
      <BackgroundGradient className="" containerClassName="w-fit p-1">
      <div
        className="max-w-4xl mx-auto shadow-lg rounded-3xl p-8 bg-slate-100  dark:bg-slate-800"
        >
        {/* Project Title */}
        <h2 className="text-3xl font-bold text-center text-slate-900
         dark:text-white mb-4">
          Project Description
        </h2>
        <p className="text-lg text-slate-900 dark:text-white mb-4">
          This system uses facial recognition to automate and secure the student attendance process during events.
        </p>

        {/* Objectives Section */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6">Objectives:</h3>
        <ul className="list-disc list-inside text-slate-900 dark:text-white mb-6">
          <li>Automate attendance marking using advanced technologies</li>
          <li>Real-time participant tracking</li>
          <li>Event creation and management</li>
          <li>Facial recognition for student identification</li>
          <li>Real-time attendance tracking and reporting</li>
        </ul>

        {/* Technologies Used Section */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6">Technologies Used:</h3>
        <ul className="list-disc list-inside text-slate-900 dark:text-white mb-6">
          <li>Frontend: Next.js</li>
          <li>Backend: Node.js</li>
          <li>Database: PostgreSQL</li>
          <li>ORMs: Prisma, Dribble</li>
          <li>Validation: Yup Resolver</li>
        </ul>

        {/* Hardware/Software Requirements Section */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6">
          Hardware/Software Requirements:
        </h3>
        <p className="text-lg text-slate-900 dark:text-white">
          <strong>Hardware:</strong> Cameras, Servers<br />
          <strong>Software:</strong> VS Code, Git, OS (Windows/Linux/macOS)
        </p>
      </div>
        </BackgroundGradient>
    </div>
  );
}
