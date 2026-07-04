import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/constants";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-200">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs tracking-wide text-charcoal-600">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </div>
      <h3 className="mt-2 font-heading text-lg leading-snug text-charcoal transition-colors group-hover:text-coffee sm:text-xl">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal-600">
        {post.excerpt}
      </p>
      <span className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-blush transition-colors group-hover:text-coffee">
        Read More →
      </span>
    </Link>
  );
}
