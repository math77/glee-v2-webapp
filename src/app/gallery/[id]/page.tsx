import type { Metadata } from "next";
import GalleryPage from "../page";
import { SITE_URL } from "@/utils/siteConfig";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = `GLEE #${id} — Onchain Generative Art`;
  const description = "A fully onchain generative gradient. Every transfer changes its form.";
  const url = `${SITE_URL}/gallery/${id}`;
  return {
    title,
    description,
    openGraph: { title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Renders the gallery page with the token's modal pre-opened via a query param.
// The client-side GalleryPage component reads ?token= on mount and opens the lightbox.
export default async function GalleryTokenPage({ params }: Props) {
  const { id } = await params;
  return <GalleryPage initialTokenId={id} />;
}