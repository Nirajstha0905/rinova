import { useEffect, useState } from "react";

export function usePresenceTransition(open, duration = 220) {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    let timeoutId;
    let frameId;

    if (open) {
      frameId = requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      frameId = requestAnimationFrame(() => {
        setVisible(false);
        setExiting(true);
        timeoutId = window.setTimeout(() => setExiting(false), duration);
      });
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [duration, open]);

  return { shouldRender: open || exiting, visible };
}
