import type { ImageResult } from "../models/Word";

export interface ImageSearchProvider {
  search(query: string): Promise<ImageResult[]>;
}

interface CommonsPage {
  pageid: number;
  title: string;
  imageinfo?: Array<{
    url: string;
    thumburl?: string;
    extmetadata?: {
      Artist?: { value?: string };
      LicenseShortName?: { value?: string };
    };
  }>;
}

function plainText(html = ""): string {
  const node = document.createElement("div");
  node.innerHTML = html;
  return node.textContent?.trim() || "";
}

export class WikimediaImageSearchProvider implements ImageSearchProvider {
  async search(query: string): Promise<ImageResult[]> {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "12",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "900",
    });
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
    );
    if (!response.ok) throw new Error("Image search failed");
    const data = (await response.json()) as {
      query?: { pages?: Record<string, CommonsPage> };
    };
    return Object.values(data.query?.pages ?? {})
      .flatMap((page): ImageResult[] => {
        const image = page.imageinfo?.[0];
        if (!image?.url || !image.thumburl) return [];
        const artist = plainText(image.extmetadata?.Artist?.value);
        const license = image.extmetadata?.LicenseShortName?.value || "Wikimedia Commons";
        return [{
          id: String(page.pageid),
          url: image.url,
          thumbnailUrl: image.thumburl,
          title: page.title.replace(/^File:/, ""),
          attribution: [artist, license].filter(Boolean).join(" · "),
        }];
      })
      .slice(0, 10);
  }
}

export const imageSearchProvider: ImageSearchProvider =
  new WikimediaImageSearchProvider();
