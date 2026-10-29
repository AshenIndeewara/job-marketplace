export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={'animate-pulse rounded bg-[--color-surface-muted] ' + className} />;
}
