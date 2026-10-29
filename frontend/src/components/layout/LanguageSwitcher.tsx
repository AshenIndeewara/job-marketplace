'use client';

/**
 * Placeholder language switcher (JM-28). The i18n tickets wire real routing
 * and translations; for now it only shows the three supported options.
 */
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
] as const;

export function LanguageSwitcher() {
  return (
    <div className="flex gap-2 text-sm" aria-label="Language">
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          className={
            'px-2 py-1 rounded border ' +
            (language.code === 'en'
              ? 'bg-[--color-surface-muted] font-semibold'
              : 'text-[--color-foreground-muted]')
          }
          disabled
          title="Enabled with the i18n tickets"
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
