"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function AboutUs() {
  return (
    <div className="flex items-center justify-center p-6">
      {/* Container */}
      <BackgroundGradient className="" containerClassName="w-fit p-1">
        <div
          className="max-w-4xl mx-auto shadow-lg rounded-3xl p-8 bg-slate-100 dark:bg-slate-800"
        >
          {/* Header */}
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            About the Project
          </h2>

          {/* Introduction */}
          <p className="text-lg text-slate-900 dark:text-white mb-4">
            Welcome to our <span className="font-semibold">EventMinder</span>
            <br />
            A smart, secure solution designed to streamline student attendance using facial recognition.
          </p>

          {/* Platform Description */}
          <p className="text-lg text-slate-900 dark:text-white mt-4">
            This platform automates attendance tracking, ensures real-time updates, and enhances the experience of both hosts and participants at events.
          </p>

          {/* Detailed Description */}
          <div className="mt-6">
            <p className="text-lg text-slate-900 dark:text-white mb-4">
              Our Event Management System is a modern web and mobile platform designed to simplify the organization and monitoring of events. Whether you&apos;re hosting a workshop, seminar, or large-scale conference, our system ensures smooth participant management from start to finish.
            </p>
            <p className="text-lg text-slate-900 dark:text-white mb-4">
              With a focus on automation and real-time tracking, our platform offers a seamless experience for both event Hosts and Users. Hosts have complete control over the event lifecycle — from setting up sessions to verifying attendance and generating certificates — all without manual intervention.
            </p>
            <p className="text-lg text-slate-900 dark:text-white mb-4">
              Meanwhile, participants can easily join events, mark their attendance, and receive their certificates automatically.
            </p>
            <p className="text-lg text-slate-900 dark:text-white mb-4">
              Built using powerful technologies like <span className="font-semibold">PostgreSQL</span>, <span className="font-semibold">Next.js</span>, and <span className="font-semibold">Flutter</span>, our solution delivers reliability, scalability, and a user-friendly interface across both web and mobile devices.
            </p>
            <p className="text-lg text-slate-900 dark:text-white">
              We aim to eliminate the hassle of traditional event tracking by bringing everything into one smart, connected system — making events more organized, engaging, and efficient for everyone involved.
            </p>
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );
}