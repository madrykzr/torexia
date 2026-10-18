import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { PortableBody } from "@/components/blog/PortableBody";
import { getPolicyBySlug, getPolicySlugs } from "@/lib/sanity-content";
import { formatDate } from "@/lib/constants";

export async function generateStaticParams() {
  const slugs = await getPolicySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPolicyBySlug(slug);
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
    alternates: { canonical: `/policies/${slug}` },
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPolicyBySlug(slug);
  if (!page) notFound();

  return (
    <Section tone="cream" className="pt-36 sm:pt-40">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-heading text-4xl text-charcoal sm:text-5xl">
          {page.title}
        </h1>
        {page.updated && (
          <p className="mt-3 text-xs tracking-wide text-charcoal-600">
            Last updated {formatDate(page.updated)}
          </p>
        )}
        <div className="mt-10">
          <PortableBody value={page.body} />
        </div>
        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-coffee transition-colors hover:text-blush"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </article>
    </Section>
  );
}
