import { useEffect, useState } from "react";
import {
  getAnalyticsConsent,
  loadAnalytics,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "../services/analytics";

export function AnalyticsConsentBanner() {
  const [choice, setChoice] = useState<AnalyticsConsent | null>(getAnalyticsConsent);
  const [open, setOpen] = useState(choice === null);

  useEffect(() => {
    if (choice === "granted") loadAnalytics();
  }, [choice]);

  function choose(nextChoice: AnalyticsConsent) {
    setAnalyticsConsent(nextChoice);
    setChoice(nextChoice);
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="analytics-settings" onClick={() => setOpen(true)}>
        Аналітика
      </button>
    );
  }

  return (
    <aside className="consent-banner" aria-label="Налаштування аналітики">
      <div>
        <p className="eyebrow">Для дорослого</p>
        <h2>Допоможете покращувати вправи?</h2>
        <p>
          Google Analytics може збирати дані про використання сайту. Ми не надсилаємо
          введені слова чи дані про дитину. {" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Політика Google
          </a>.
        </p>
      </div>
      <div className="consent-actions">
        <button className="consent-decline" onClick={() => choose("denied")}>
          Не дозволяти
        </button>
        <button className="consent-accept" onClick={() => choose("granted")}>
          Дозволити
        </button>
      </div>
    </aside>
  );
}
