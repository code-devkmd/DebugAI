import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DebugAI – AI-Powered Code Debugger",
  description:
    "Analyze errors, stack traces, and buggy code instantly using AI. Get clear root causes and production-ready fixes powered by Groq LLMs.",
  keywords: [
    "debugging tool",
    "AI debugger",
    "code fixer",
    "stack trace analyzer",
    "Groq AI",
    "Llama 3 debugger",
  ],
  authors: [{ name: "Code-Dev" }],
  creator: "DebugAI",
  openGraph: {
    title: "DebugAI – AI Code Debugger",
    description:
      "Fix bugs faster with AI-powered error analysis and code correction.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
