import { useState, useEffect } from "react";

const COOKIE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-700 px-4 py-4 shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-zinc-300 flex-1">
          We use cookies and similar technologies to improve your experience,
          serve personalised ads, and analyse traffic. By clicking{" "}
          <strong className="text-white">Accept</strong>, you agree to our use
          of cookies.{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-zinc-400 hover:text-white transition-colors"
          >
            Learn more
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-md text-sm font-medium bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-md text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
