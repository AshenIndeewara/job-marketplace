import { HealthCard } from '@/components/HealthCard';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Find part-time work in Sri Lanka</h1>
        <p className="text-[--color-foreground-muted]">
          Job marketplace scaffold is up. Auth, jobs and applications arrive in
          their own tickets.
        </p>
      </section>
      <HealthCard />
    </div>
  );
}
