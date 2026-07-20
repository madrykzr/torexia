import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { BlogCard } from "@/components/blog/BlogCard";
import { PortableBody } from "@/components/blog/PortableBody";
import {
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/sanity-content";
import { formatDate } from "@/lib/constants";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: `${post.title} | Torexia`,
      description: post.excerpt,
      images: [{ url: post.cover, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const more = (await getAllPosts())
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <>
      {/* Cover hero */}
      <section className="relative flex min-h-[56svh] items-end overflow-hidden">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee/85 via-coffee/30 to-coffee/40" />
        <div className="relative mx-auto w-full max-w-3xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <div className="flex items-center gap-2 text-xs tracking-wide text-blush-300">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-3 font-heading text-3xl leading-tight text-cream sm:text-5xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article body */}
      <Section tone="cream">
        <article className="mx-auto max-w-2xl">
          <PortableBody value={post.body} />

          <div className="mt-12 border-t border-line pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-coffee transition-colors hover:text-blush"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Journal
            </Link>
          </div>
        </article>
      </Section>

      {/* More posts */}
      {more.length > 0 && (
        <Section tone="cream" className="pt-0">
          <div className="border-t border-line pt-16">
            <h2 className="font-heading text-2xl text-charcoal sm:text-3xl">
              More from the Journal
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
              {more.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
