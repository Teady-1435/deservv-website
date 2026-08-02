import Link from "next/link";
import Logo from "./Logo";
import { PROGRAM } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="px-5 md:px-14 pt-13 md:pt-21 pb-8 bg-ink-alt">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-11 border-b border-white/[0.08]">
          <div>
            <div className="mb-3.5">
              <Logo size={26} />
            </div>
            <p className="m-0 max-w-[30ch] text-[15px] leading-[1.6] text-muted-300">
              The best way to learn and apply AI. Built for people with a job to
              do on Monday.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-600">
              Program
            </span>
            <Link href="/apply" className="text-muted-50 text-[15px] hover:text-gold">
              Curriculum
            </Link>
            <Link href="/apply" className="text-muted-50 text-[15px] hover:text-gold">
              Instructor
            </Link>
            <Link href="/apply" className="text-muted-50 text-[15px] hover:text-gold">
              Fee &amp; where it goes
            </Link>
            <Link href="/hire" className="text-muted-50 text-[15px] hover:text-gold">
              For companies
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-600">
              Room
            </span>
            <span className="text-[15px] text-muted-50">Monthly meetup — Bengaluru</span>
            <span className="text-[15px] text-muted-50">Build channel — members only</span>
            <a href="mailto:hello@deservv.com" className="text-[15px]">
              hello@deservv.com
            </a>
          </div>
          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-600">
              Next cohort
            </span>
            <span className="font-display text-[19px] font-medium">{PROGRAM.cohort}</span>
            <Link
              href="/apply"
              className="self-start bg-red text-white rounded-full px-6 py-3 font-mono text-[11.5px] tracking-[0.1em] uppercase hover:bg-red-hover"
            >
              Apply now
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-between pt-6 font-mono text-[10.5px] tracking-[0.1em] text-muted-600">
          <span>© 2026 Deservv</span>
          <span>Curriculum reviewed annually · tools refreshed quarterly</span>
        </div>
      </div>
    </footer>
  );
}
