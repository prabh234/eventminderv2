import { Geist, Geist_Mono, Love_Light, Yellowtail, Fontdiner_Swanky } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const loveLight = Love_Light({
  weight:["400"],
  style:["normal"],
  subsets: ["latin"],
});

export const yellowtail = Yellowtail({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

export const fontdinerSwanky = Fontdiner_Swanky({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});
