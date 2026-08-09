import Link from "next/link";

/** Slim announcement bar shown at the top of the home page when enabled. */
export function PromoBanner({
  text,
  href,
}: {
  text: string;
  href?: string | null;
}) {
  const inner = (
    <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-white">
      {text}
    </p>
  );
  return (
    <div className="bg-coffee px-4 py-2.5">
      {href ? (
        <Link href={href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
