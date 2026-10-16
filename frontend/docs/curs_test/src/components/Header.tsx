interface HeaderProps {
  onAdd: () => void
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>Задачи</h1>
        <p className="header__subtitle">Планируйте дела и следите за прогрессом</p>
      </div>
      <button type="button" className="button button--primary" onClick={onAdd}>
        Новая задача
      </button>
    </header>
  )
}
