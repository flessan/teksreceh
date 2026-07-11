import type { GeneratorConfig } from "@/types/generator";

export const searchGenerators = (generators: GeneratorConfig[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return generators;

  return generators
    .map((generator) => {
      const haystack = [generator.title, generator.description, generator.category, generator.slug, ...generator.keywords].join(" ").toLowerCase();
      const score = haystack.includes(normalized) ? (generator.title.toLowerCase().startsWith(normalized) ? 3 : 1) : 0;
      return { generator, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.generator.title.localeCompare(b.generator.title))
    .map((item) => item.generator);
};