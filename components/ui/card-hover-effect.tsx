import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Card, CardDescription, CardFooter, CardTitle } from "./card";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Button } from "./button";
export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    id: string;
    eventname: string;
    description: string;
    startdt:string;
    enddt:string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div key={idx} className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className=" bg-black  dark:border-white/[0.2] group-hover:border-slate-700 ">
            <CardTitle>{item.eventname}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <CardFooter><Button>More<BiDotsVerticalRounded/></Button></CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

      // <div className="relative z-50">
      //   <div className="p-4">{children}</div>
  
// export const CardTitle = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
//       {children}
//     </h4>
//   );
// };
// export const CardDescription = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <p
//       className={cn(
//         "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
//         className
//       )}
//     >
//       {children}
//     </p>
//   );
// };