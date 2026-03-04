import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-8xl font-bold text-accent md:text-9xl">
        404
      </h1>
      <h2 className="mt-4 font-display text-2xl uppercase tracking-wider md:text-3xl">
        Page Not Found
      </h2>
      <p className="mt-4 max-w-md text-tertiary-light">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border border-primary-light px-8 py-3 font-display text-sm uppercase tracking-widest transition-colors hover:bg-primary-light hover:text-primary-dark"
      >
        Back to Home
      </Link>
    </section>
  );
}
