import type { GeneratorConfig } from "@/types/generator";

const siteName = "teksreceh";
const fallbackOrigin = "https://text.thio.qzz.io";

const ensureMeta = (selector: string, create: () => HTMLMetaElement) => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) return existing;
  const element = create();
  document.head.appendChild(element);
  return element;
};

const setNamedMeta = (name: string, content: string) => {
  const meta = ensureMeta(`meta[name="${name}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute("name", name);
    return element;
  });
  meta.setAttribute("content", content);
};

const setPropertyMeta = (property: string, content: string) => {
  const meta = ensureMeta(`meta[property="${property}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute("property", property);
    return element;
  });
  meta.setAttribute("content", content);
};

const setCanonical = (url: string) => {
  const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
  link.setAttribute("rel", "canonical");
  link.setAttribute("href", url);
  if (!link.parentElement) document.head.appendChild(link);
};

const setJsonLd = (id: string, data: unknown) => {
  const script = document.getElementById(id) ?? document.createElement("script");
  script.id = id;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(data);
  if (!script.parentElement) document.head.appendChild(script);
};

export const updateHomeSeo = () => {
  const origin = window.location.origin || fallbackOrigin;
  const description = "teksreceh adalah museum generator teks internet Indonesia yang ringan, chat-like, open source, dan siap kontribusi di GitHub.";
  document.title = `${siteName} - Generator Teks Paling Ngaco Se-Indonesia`;
  setNamedMeta("description", description);
  setNamedMeta("keywords", "teks receh, generator teks indonesia, alay generator, rimsvek generator, uwu generator");
  setPropertyMeta("og:title", `${siteName} - Generator Teks Paling Ngaco Se-Indonesia`);
  setPropertyMeta("og:description", description);
  setPropertyMeta("og:type", "website");
  setPropertyMeta("og:url", origin);
  setNamedMeta("twitter:card", "summary_large_image");
  setNamedMeta("twitter:title", `${siteName} - Generator Teks Internet Indonesia`);
  setNamedMeta("twitter:description", description);
  setCanonical(origin);
  setJsonLd("jsonld-app", {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    codeRepository: "https://github.com/flessan/teksreceh",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description,
  });
};

export const updateGeneratorSeo = (generator: GeneratorConfig) => {
  const origin = window.location.origin || fallbackOrigin;
  const url = `${origin}/${generator.slug}`;
  const title = `${generator.title} - ${siteName}`;
  document.title = title;
  setNamedMeta("description", generator.description);
  setNamedMeta("keywords", generator.keywords.join(", "));
  setPropertyMeta("og:title", title);
  setPropertyMeta("og:description", generator.description);
  setPropertyMeta("og:type", "website");
  setPropertyMeta("og:url", url);
  setNamedMeta("twitter:card", "summary_large_image");
  setNamedMeta("twitter:title", title);
  setNamedMeta("twitter:description", generator.description);
  setCanonical(url);
  setJsonLd("jsonld-app", {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: generator.title,
        url,
        codeRepository: "https://github.com/flessan/teksreceh",
        applicationCategory: "UtilitiesApplication",
        description: generator.description,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: origin },
          { "@type": "ListItem", position: 2, name: generator.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: generator.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  });
};
