import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-semibold">
          Job Marketplace
        </a>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
