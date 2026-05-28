export const getSavedSession = () => {
  try {
    const stored = window.localStorage.getItem('rinova-session');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const resetScrollPosition = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (!navigator.userAgent.toLowerCase().includes('jsdom') && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
};
