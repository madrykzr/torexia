import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/constants";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-[0_1px_2px_rgba(28,28,28,0.03)] transition-shadow duration-500 hover:shadow-[0_16px_40px_-16px_rgba(28,28,28,0.16)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream-200">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-center gap-2 px-1 text-xs tracking-wide text-charcoal-600">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="mt-2 px-1 font-heading text-lg leading-snug text-charcoal transition-colors group-hover:text-coffee sm:text-xl">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 px-1 text-sm leading-relaxed text-charcoal-600">
        {post.excerpt}
      </p>
      <span className="mb-1 mt-4 inline-block px-1 text-xs font-medium uppercase tracking-[0.15em] text-blush transition-colors group-hover:text-coffee">
        Read More →
      </span>
    </Link>
  );
}
