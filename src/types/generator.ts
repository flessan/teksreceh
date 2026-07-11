import type { TransformerId } from "@/transformers/text";

export type PersonaId =
  | "normal"
  | "alay-2010"
  | "wibu"
  | "rimsvek"
  | "discord-mod"
  | "facebook-emak"
  | "bocil-ml"
  | "bocil-ff"
  | "twitter"
  | "tiktok"
  | "jaksel";

export type GeneratorCategory =
  | "Trending"
  | "Tongkrongan"
  | "Meme Indonesia"
  | "Gaming"
  | "Developer"
  | "Fancy Text"
  | "Utilities"
  | "Sosial Media"
  | "Unicode";

export type GeneratorOption =
  | {
      id: string;
      label: string;
      type: "range";
      min: number;
      max: number;
      step: number;
      defaultValue: number;
      hint?: string;
    }
  | {
      id: string;
      label: string;
      type: "select";
      defaultValue: string;
      choices: Array<{ label: string; value: string }>;
      hint?: string;
    };

export type GeneratorExample = {
  input: string;
  output: string;
};

export type GeneratorFaq = {
  question: string;
  answer: string;
};

export type GeneratorConfig = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: GeneratorCategory;
  icon: string;
  keywords: string[];
  transformer: TransformerId;
  defaultInput: string;
  origin: string;
  examples: GeneratorExample[];
  faq: GeneratorFaq[];
  options?: GeneratorOption[];
  featured?: boolean;
};

export type TransformOptions = Record<string, number | string | boolean>;

export type TransformContext = {
  options: TransformOptions;
  persona: PersonaId;
};