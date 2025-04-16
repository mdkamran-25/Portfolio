import { useState } from 'react';

export default function ScheduleCall() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      {/* Schedule Call Button */}
      <button
        onClick={() => setShowCalendar(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-neutral-800/50 px-2.5 py-1.5 text-xs text-white transition-colors hover:bg-neutral-700/50 sm:top-4 sm:right-4 sm:px-4 sm:py-2"
      >
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-full w-full rounded-full bg-green-500"></span>
        </span>
        Schedule a Call
      </button>

      {/* Calendly Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="relative h-[90vh] w-[90vw] max-w-4xl rounded-lg bg-white">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
            >
              ✕
            </button>
            <iframe
              src="https://calendly.com/webhost01001"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a call"
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
} 