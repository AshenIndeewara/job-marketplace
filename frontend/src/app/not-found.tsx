import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4 p-6 rounded-lg border">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-[--color-foreground-muted]">
        The page you are looking for does not exist or has moved.
      </p>
      <Link href="/" className="text-[--color-primary] underline text-sm">
        Back to home
      </Link>
    </div>
  );
}
