import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/events", label: "Events" },
  { href: "/music", label: "Music" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-secondary-dark px-6 py-12 md:px-10">
      <div className="mx-auto max-w-[940px]">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/">
              <Image
                src="/images/agape_logo_white.png"
                alt="AGAPE Music"
                width={100}
                height={50}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-tertiary-light">
              Pushing the Limits of Electronic Music
              <br />
              in NYC&apos;s Underground.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-xs uppercase tracking-widest text-tertiary-light transition-colors hover:text-primary-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col items-center gap-2 text-sm text-tertiary-light md:items-end">
            <a
              href="mailto:andres@agapemusic.us"
              className="transition-colors hover:text-primary-light"
            >
              andres@agapemusic.us
            </a>
            <a
              href="mailto:bookings@agapemusic.us"
              className="transition-colors hover:text-primary-light"
            >
              bookings@agapemusic.us
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-secondary-dark pt-6 text-center">
          <p className="text-xs text-tertiary-dark">
            &copy; {new Date().getFullYear()} AGAPE Music. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
