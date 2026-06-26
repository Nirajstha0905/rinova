import { useEffect, useState } from "react";

export function usePresenceTransition(open, duration = 220) {
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    let timeoutId;

    if (open) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeoutId = window.setTimeout(() => setShouldRender(false), duration);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [duration, open]);

  return { shouldRender, visible };
}
