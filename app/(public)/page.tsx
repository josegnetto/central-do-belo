import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestPosts } from "@/lib/posts";
import { PostCard } from "@/components/public/PostCard";
import { LeadStory } from "@/components/public/LeadStory";
import { Headline } from "@/components/public/Headline";
import { AdSlot } from "@/components/public/AdSlot";
import { Reveal } from "@/components/ui/Reveal";
import { StarMark } from "@/components/ui/StarMark";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { buildWebSiteJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

function WebSiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }}
    />
  );
}

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-1 flex items-center justify-between gap-3 border-b-2 border-accent pb-2">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-ink">
        <StarMark className="h-3.5 w-3.5" />
        {title}
      </h2>
      {href && linkLabel ? (
        <Link
          href={href}
          className="group flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wide text-accent transition-colors duration-300 hover:text-accent-dark"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

export default async function HomePage() {
  const posts = await getLatestPosts(13);
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center md:px-6">
        <WebSiteJsonLd />
        <h1 className="text-2xl font-bold text-ink">{SITE_NAME}</h1>
        <p className="mt-3 text-muted">
          Nenhuma publicação ainda. Assim que o primeiro conteúdo for publicado, ele aparece aqui.
        </p>
      </div>
    );
  }

  // A coluna de destaques só faz sentido com material para preencher; com
  // pouca publicação, a manchete ocupa a largura toda em vez de deixar um
  // vazio ao lado.
  const sidebar = rest.slice(0, 4);
  const hasSidebar = sidebar.length >= 2;
  const gridPosts = rest.slice(hasSidebar ? sidebar.length : 0);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <WebSiteJsonLd />

      {/* Manchete + destaques: a primeira tela é notícia, não institucional. */}
      <section className="border-b border-line py-6 md:py-8">
        <div className={hasSidebar ? "grid gap-8 lg:grid-cols-3" : ""}>
          <div className={hasSidebar ? "lg:col-span-2" : "mx-auto max-w-4xl"}>
            <LeadStory post={featured} />
          </div>

          {hasSidebar ? (
            <aside className="lg:col-span-1">
              <SectionHeading title="Destaques" />
              <div className="divide-y divide-line">
                {sidebar.map((post) => (
                  <Headline key={post.id} post={post} />
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      <div className="py-6">
        <AdSlot slot="home-top" className="min-h-24" />
      </div>

      {gridPosts.length > 0 ? (
        <section className="pb-12">
          <SectionHeading title="Últimas publicações" href="/publicacoes" linkLabel="Ver todas" />
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
