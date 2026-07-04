import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 text-base leading-relaxed text-charcoal-600 first:mt-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 font-heading text-2xl text-charcoal first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-heading text-xl text-charcoal first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-blush pl-6 font-heading text-xl leading-snug text-coffee">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-charcoal-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-base leading-relaxed text-charcoal-600">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-charcoal">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-coffee underline underline-offset-2 transition-colors hover:text-blush"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-2xl bg-cream-200">
          <Image
            src={urlFor(value).width(1400).quality(80).auto("format").url()}
            alt={value.alt ?? ""}
            width={1400}
            height={933}
            className="h-auto w-full object-cover"
          />
        </figure>
      );
    },
  },
};

export function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
