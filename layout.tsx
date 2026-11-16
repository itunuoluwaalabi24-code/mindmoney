import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINDMONEY — Your money, with a plan",
  description: "An ADHD-first financial control system for budgeting, debt and spending decisions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
