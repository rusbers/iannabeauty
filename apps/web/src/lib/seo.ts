import type { Metadata } from "next";

import { getBaseUrl } from "@/config";
import type { Maybe } from "@/types";

interface OgImageOptions {
  type?: string;
  id?: string;
}

function getOgImage({ type, id }: OgImageOptions = {}): string {
  const params = new URLSearchParams();
  if (id) params.set("id", id);
  if (type) params.set("type", type);
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/api/og?${params.toString()}`;
  return logoUrl;
}

interface MetaDataInput {
  _type?: Maybe<string>;
  seoDescription?: Maybe<string>;
  seoTitle?: Maybe<string>;
  slug?: Maybe<{ current: string | null }> | string | null;
  title?: Maybe<string>;
  description?: Maybe<string>;
  _id?: Maybe<string>;
}

export function getMetaData(data: MetaDataInput): Metadata {
  const { _type, seoDescription, seoTitle, slug, title, description, _id } =
    data ?? {};

  const baseUrl = getBaseUrl();
  const pageSlug = typeof slug === "string" ? slug : (slug?.current ?? "");
  const pageUrl = `${baseUrl}${pageSlug}`;

  const meta = {
    title: seoTitle ?? title ?? "",
    description: seoDescription ?? description ?? "",
  };

  const ogImage = getOgImage({
    type: _type ?? undefined,
    id: _id ?? undefined,
  });

  return {
    title: `${meta.title} | Ianna Beauty`,
    description: meta.description,
    metadataBase: new URL(baseUrl),
    // TODO: Add creator and authors when we have them
    creator: "My Studio",
    authors: [{ name: "My Studio" }],
    icons: {
      icon: `${baseUrl}/favicon.ico`,
    },
    // TODO: Add keywords
    keywords: [],
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      // TODO: Add creator when we have it
      creator: "@my-studio",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      countryName: "Ireland",
      description: meta.description,
      title: meta.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };
}
