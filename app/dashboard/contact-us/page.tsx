"use client";

import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function ContactUs() {
  return (
    <div className="flex items-center justify-center p-6">
      {/* Container */}
      <BackgroundGradient className="" containerClassName="w-fit p-1">
        <div
          className="max-w-3xl mx-auto shadow-lg rounded-3xl p-8 dark:bg-slate-800 bg-slate-100"
        >
          {/* Header */}
          <h2 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-6">
            Contact Us
          </h2>

          {/* Contact Information */}
          <div className="text-lg text-slate-900 dark:text-white space-y-4">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@eventtrackr.com"
                className="text-slate-900 dark:text-white underline hover:text-gray-200"
              >
                support@eventtrackr.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +91-XXXXXXXXXX
            </p>
            <p>
              <strong>Address:</strong> Department of Computer
              Applications, Chitkara University, Rajpura, Punjab
            </p>
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );
}
