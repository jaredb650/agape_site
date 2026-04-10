import Link from "next/link";

interface StaticPageProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

function CtaLink({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "border border-[#363636] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#f0f0f0] transition-colors duration-200 hover:border-[#a1f081] hover:text-[#a1f081]"
      : "border border-[#363636] px-8 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#888888] transition-colors duration-200 hover:text-[#f0f0f0]";

  if (isExternal(href)) {
    const isHttp = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(isHttp && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function StaticPage({
  eyebrow,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back Home",
  secondaryHref,
  secondaryLabel,
}: StaticPageProps) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-8 md:inset-16">
        <div className="absolute left-0 top-0 h-12 w-12 border-l border-t border-[#363636]/30" />
        <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#363636]/30" />
        <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#363636]/30" />
        <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#363636]/30" />
      </div>

      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
            {eyebrow}
          </span>
          <div className="h-[1px] w-12 bg-[#363636]" />
        </div>

        <h1
          className="font-bold uppercase text-[#fafafa]"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            letterSpacing: "0.03em",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h1>

        <p className="max-w-[620px] font-body text-base leading-[1.8] text-[#888888]">
          {description}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <CtaLink href={primaryHref} variant="primary">
            {primaryLabel}
          </CtaLink>
          {secondaryHref && secondaryLabel ? (
            <CtaLink href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </CtaLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
