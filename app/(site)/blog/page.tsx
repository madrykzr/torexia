import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "The Torexia Journal — modest styling tips, fabric stories and everyday elegance from our Malaysian modest fashion studio.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Stories & Styling"
        subtitle="Notes on modest dressing, our fabrics, and the thinking behind every Torexia piece."
      />
      <Section tone="cream">
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-charcoal-600">
            No journal entries yet — check back soon.
          </p>
        )}
      </Section>
    </>
  );
}
