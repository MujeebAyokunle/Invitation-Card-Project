"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Home() {

  const router = useRouter()

  const [guestName, setGuestName] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [eventName, setEventName] = useState("");
  const [honoreeName, setHonoreeName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [colorTheme, setColorTheme] = useState("");
  const [rsvpContact, setRsvpContact] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // if (guestName && cardUrl) setSubmitted(true);
    router.push('/card/1234');
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-yellow-500 text-2xl font-bold text-center">Create Access Card</h2>

        {/* Guest Name */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Guest Name</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter Guest Name"
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
            required
          />
        </div> */}

        {/* Event Name */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Sir Vic’s 50th"
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
            required
          />
        </div> */}

        {/* Honoree Name */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Honoree Name</label>
          <input
            type="text"
            value={honoreeName}
            onChange={(e) => setHonoreeName(e.target.value)}
            placeholder="In Honor of..."
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
            required
          />
        </div> */}

        {/* Event Date */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
            required
          />
        </div> */}

        {/* Event Time */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Event Time</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
            required
          />
        </div> */}

        {/* Venue */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Event Venue"
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
            required
          />
        </div> */}

        {/* Dress Code */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Dress Code</label>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            placeholder="e.g., Formal"
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
          />
        </div> */}

        {/* Color Theme */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">Color Theme</label>
          <input
            type="text"
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            placeholder="e.g., Burnt Orange & Gold"
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
          />
        </div> */}

        {/* RSVP Contact */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-yellow-300 mb-1">RSVP Contact</label>
          <input
            type="text"
            value={rsvpContact}
            onChange={(e) => setRsvpContact(e.target.value)}
            placeholder="Name · Phone Number"
            className="px-4 py-2 rounded-md bg-zinc-900 border-[0.1px] border-yellow-500 focus:outline-none focus:ring-yellow-400 text-white text-base"
          />
        </div> */}

        <button
          type="submit"
          className="w-full py-2 bg-yellow-500 cursor-pointer text-zinc-900 font-semibold rounded-md hover:bg-yellow-500 transition-colors"
        >
          Generate Card
        </button>
      </form>
    </div>

  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <motion.div
        className="relative w-full max-w-md aspect-[0.75/1] bg-cream rounded-lg overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Decorative border */}
        <div className="absolute inset-3 border-2 border-primary/40 rounded">
          {/* Corner flourishes */}
          <div className="absolute -top-1 -right-1 w-16 h-16 text-primary/60">
            <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
              <path d="M60,0 Q40,10 50,30 Q30,20 40,50 M55,5 C45,15 50,25 45,35" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -left-1 w-16 h-16 text-primary/60 rotate-180">
            <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
              <path d="M60,0 Q40,10 50,30 Q30,20 40,50 M55,5 C45,15 50,25 45,35" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center text-cream-foreground">
          {/* Monogram */}
          <div className="relative mb-6">
            <span className="font-serif text-5xl text-primary/80">{guestName.charAt(0)}</span>
            <div className="absolute -top-2 -right-4 w-12 h-8 text-primary/50">
              <svg viewBox="0 0 50 35" fill="none" className="w-full h-full">
                <path d="M0,30 Q15,20 30,25 Q40,15 50,20" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>

          <p className="text-xs tracking-[0.3em] text-cream-foreground/70 mb-2">PLEASE JOIN US FOR THE</p>
          <p className="font-serif text-4xl text-gradient-gold italic mb-2">Celebration</p>
          <p className="text-xs tracking-[0.2em] text-cream-foreground/70 mb-4">IN HONOR OF</p>

          <h3 className="font-serif text-2xl text-primary tracking-wide mb-6">{guestName}</h3>

          <div className="text-xs space-y-1 text-cream-foreground/80">
            {/* <p><span className="font-semibold">DATE:</span> {eventTitle}</p> */}
            <p><span className="font-semibold">VENUE:</span> Your Venue</p>
            <p><span className="font-semibold">TIME:</span> 4:00PM</p>
          </div>

          <div className="mt-6 text-xs text-cream-foreground/60">
            <p>RSVP: contact@event.com</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
