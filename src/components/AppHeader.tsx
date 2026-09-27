interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  action?: React.ReactNode;
}

export function AppHeader({ title, onBack, action }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-side">
        {onBack && (
          <button className="icon-button" onClick={onBack} aria-label="До головного меню">
            ←
          </button>
        )}
      </div>
      <h1>{title}</h1>
      <div className="header-side header-action">{action}</div>
    </header>
  );
}
