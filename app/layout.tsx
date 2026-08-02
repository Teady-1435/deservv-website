import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { NavToneProvider } from "@/components/NavToneContext";
import { HomeReelProvider } from "@/components/HomeReelContext";
import Nav from "@/components/Nav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Deservv — Applied & Agentic AI",
  description:
    "Twelve years of courses. Nothing changed on Monday. Fifteen days, one instructor, systems that run inside your job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${ibmPlexSans.variable}`}
    >
      <body className="bg-ink text-ivory font-body min-h-screen overflow-x-clip">
        <NavToneProvider>
          <HomeReelProvider>
            <Nav />
            {children}
          </HomeReelProvider>
        </NavToneProvider>
      </body>
    </html>
  );
}
