export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "emili.analytics-consent.v1";
const MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-99MWTLG970";

function setAnalyticsDisabled(disabled: boolean): void {
  const analyticsWindow = window as typeof window & Record<string, boolean>;
  analyticsWindow[`ga-disable-${MEASUREMENT_ID}`] = disabled;
}

function updateGoogleConsent(consent: AnalyticsConsent): void {
  window.gtag?.("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(consent: AnalyticsConsent): void {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Analytics remains disabled when browser storage is unavailable.
  }
  setAnalyticsDisabled(consent === "denied");
  updateGoogleConsent(consent);
}

export function loadAnalytics(): void {
  if (!MEASUREMENT_ID || getAnalyticsConsent() !== "granted") return;
  setAnalyticsDisabled(false);
  if (window.gtag) {
    updateGoogleConsent("granted");
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  updateGoogleConsent("granted");
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  script.dataset.emiliAnalytics = "true";
  document.head.appendChild(script);
}

export function trackScreenView(screenName: string): void {
  if (getAnalyticsConsent() !== "granted") return;
  loadAnalytics();
  window.gtag?.("event", "screen_view", { screen_name: screenName });
}
