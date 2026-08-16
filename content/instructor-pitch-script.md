# Instructor audio — 60 second pitch

**Placement:** Instructor section, `/apply` (component: `components/InstructorAudio.tsx`)
**Required file:** `public/audio/instructor-pitch.mp3`
**Target runtime:** 58–62 seconds
**Delivery:** conversational, unhurried, no announcer energy. Hit the full stops. The short
sentences are pauses, not speed. Record in a quiet room, phone voice-memo is fine.

**Word count:** 148 (≈59s at a natural 150 wpm)

---

## Script

Most people think they're using AI. They're not. They're typing questions into a box and
reading the answer. That's a search engine with better manners.

Here's what's actually available today. You can hand a system your inbox and it drafts every
reply in your voice. Hand it your reporting and it pulls the numbers, writes the commentary,
and stops to ask you before anything irreversible. Not next year. Now. With tools you already
pay for.

The gap isn't intelligence, and it isn't budget. It's that nobody sits next to you while you
build the first one. So you open a tab, you get a clever answer, you close the tab, and Monday
looks exactly like last Monday.

Fifteen days. One instructor. You leave with a system running inside your actual job. Not
notes about one.

That's the offer. Come build it.

---

## Production notes

- Export as MP3, mono, 128 kbps, normalised to about -16 LUFS.
- Save to `public/audio/instructor-pitch.mp3`. The player picks it up with no code change.
- The player reads the real duration from the file, so the on-screen label updates itself.
- If the file is missing, the player hides itself rather than showing a dead control.
