import "./globals.css";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Chris Hacker",
  description:
    "Computational journalist on the data team at The Washington Post, based in Washington, DC.",
  // Bump the ?v= when the favicon changes: browsers cache favicons by URL and
  // ignore hard refreshes, so an unversioned URL can show a stale icon.
  icons: { icon: [{ url: "/favicon.ico?v=2", sizes: "any" }] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={instrumentSans.className}
        style={{ fontSize: 16, lineHeight: 1.55 }}
      >
        {children}
      </body>
    </html>
  );
}
