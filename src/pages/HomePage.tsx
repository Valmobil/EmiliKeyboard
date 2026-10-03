import { AnalyticsConsentBanner } from "../components/AnalyticsConsentBanner";

export interface HomePageProps {
  onWords: () => void;
  onLesson: () => void;
}

export function HomePage({ onWords, onLesson }: HomePageProps) {
  return (
    <main className="home-page">
      <div className="brand-mark">Е</div>
      <p className="eyebrow">Навчальні вправи Емілі</p>
      <h1>Оберіть вправу</h1>
      <p className="home-intro">Прості інструменти для занять — без акаунтів і зайвих налаштувань.</p>

      <div className="module-grid">
        <section className="module-card featured">
          <span className="module-icon">АБ</span>
          <div>
            <p className="eyebrow">Нова вправа</p>
            <h2>Склади слово</h2>
            <p>Створіть бібліотеку слів, оберіть урок і складіть слова з букв.</p>
          </div>
          <div className="module-actions">
            <button className="primary-button" onClick={onLesson}>Почати урок</button>
            <button className="secondary-button" onClick={onWords}>Мої слова</button>
          </div>
        </section>

        <section className="module-card compact">
          <span className="module-icon coral">Я</span>
          <div>
            <p className="eyebrow">Попередня вправа</p>
            <h2>Буквена клавіатура</h2>
            <p>Великі анімовані символи та озвучення натиснутих клавіш.</p>
          </div>
          <a
            className="secondary-button button-link"
            href={`${import.meta.env.BASE_URL}keyboard.html`}
          >
            Відкрити
          </a>
        </section>
      </div>
      <p className="local-note">Усі слова зберігаються тільки в цьому браузері.</p>
      <AnalyticsConsentBanner />
    </main>
  );
}
