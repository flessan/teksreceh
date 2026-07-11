import type { PersonaId, TransformContext } from "@/types/generator";

export type TransformerId =
  | "alay"
  | "uwu"
  | "rimsvek"
  | "typo"
  | "randomCaps"
  | "reverse"
  | "shorten"
  | "bocilMl"
  | "bocilFf"
  | "jaksel"
  | "emakFacebook"
  | "waRt"
  | "sigmaBocah"
  | "discord"
  | "twitter"
  | "tiktok"
  | "brainrot"
  | "tiktokComment"
  | "copypasta"
  | "facebookMarketplace"
  | "toxicRank"
  | "bubble"
  | "bold"
  | "italic"
  | "smallCaps"
  | "circled"
  | "monospace"
  | "fraktur"
  | "doubleStruck"
  | "superscript"
  | "subscript"
  | "mirror"
  | "upsideDown"
  | "glitch"
  | "zalgo"
  | "invisible"
  | "lorem"
  | "uuid"
  | "slug"
  | "password"
  | "base64"
  | "rot13"
  | "caesar"
  | "morse"
  | "binary"
  | "hex"
  | "urlEncode"
  | "urlDecode"
  | "htmlEncode"
  | "jsonEscape"
  | "hash";

type Transformer = (input: string, context: TransformContext) => string;

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)] ?? items[0];

const optionNumber = (context: TransformContext, key: string, fallback: number) => {
  const value = context.options[key];
  return typeof value === "number" ? value : fallback;
};

const safeDecode = (value: string, decoder: (text: string) => string) => {
  try {
    return decoder(value);
  } catch {
    return "Input belum valid buat di-decode. Coba cek lagi simbol persennya.";
  }
};

const withPersona = (text: string, persona: PersonaId) => {
  if (!text.trim() || persona === "normal") return text;

  const context: TransformContext = { options: { intensity: 7, level: 2, cringe: 2 }, persona: "normal" };

  const personaTransformers: Partial<Record<PersonaId, Transformer>> = {
    "alay-2010": alay,
    wibu: uwu,
    rimsvek,
    "discord-mod": discord,
    "facebook-emak": emakFacebook,
    "bocil-ml": bocilMl,
    "bocil-ff": bocilFf,
    twitter,
    tiktok,
    jaksel,
  };

  const transform = personaTransformers[persona];
  return transform ? transform(text, context) : text;
};

const applyPersona = (base: string, context: TransformContext) => withPersona(base, context.persona);

const alayMap: Record<string, string> = {
  a: "4",
  i: "1",
  e: "3",
  o: "0",
  s: "5",
  g: "9",
  t: "7",
};

const alay = (input: string, context: TransformContext) => {
  const intensity = optionNumber(context, "intensity", 5);
  const transformed = input
    .split("")
    .map((char, index) => {
      const lower = char.toLowerCase();
      let next = intensity >= 3 && alayMap[lower] && Math.random() < intensity / 11 ? alayMap[lower] : char;
      if (intensity >= 5 && /[a-z]/i.test(next) && Math.random() < intensity / 14) {
        next = index % 2 === 0 ? next.toUpperCase() : next.toLowerCase();
      }
      if (intensity >= 7 && /[au]$/i.test(char) && Math.random() < 0.35) next += pick(["w", "W", "h"]);
      if (intensity >= 9 && /[a-z]$/i.test(char) && Math.random() < 0.08) next += next;
      return next;
    })
    .join("");

  return intensity >= 8 ? `${transformed} ${pick(["cuyy", "xixixi", "y4hzz", ":v", "CYY"])}` : transformed;
};

const uwu = (input: string, context: TransformContext) => {
  const level = optionNumber(context, "level", optionNumber(context, "cringe", 2));
  let text = input.replace(/[rl]/gi, (match) => (match === match.toUpperCase() ? "W" : "w"));
  text = text.replace(/n([aeiou])/gi, (match, vowel: string) => `${match[0]}y${vowel}`);
  if (level >= 2) text = text.replace(/bro/gi, "bwo").replace(/halo/gi, "hawwo").replace(/kak/gi, "kakaa");
  if (level >= 3) text = `${text}${pick(["~ UwU", " owo", " rawr x3", " >///<"])} `;
  return text.trim();
};

const rimsvekDictionary: Record<string, string[]> = {
  kritik: ["krimtik", "krimtimk"],
  respect: ["rimspek", "rimsvek"],
  rimspek: ["rimsvek"],
  oke: ["omke"],
  gas: ["gams"],
  anti: ["amti"],
  tempik: ["temvick", "temvik"],
  bangsat: ["bamgsat"],
  kontol: ["komtol"],
  goblok: ["gomblok"],
  halo: ["hamlo"],
  aku: ["amku"],
  makan: ["mamkan"],
  dulu: ["dumlu"],
};

const rimsvekWord = (word: string, intensity: number) => {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  const dictionaryHit = rimsvekDictionary[clean];
  if (dictionaryHit && Math.random() < 0.95) {
    const picked = pick(dictionaryHit);
    return word[0] === word[0]?.toUpperCase() ? picked[0]?.toUpperCase() + picked.slice(1) : picked;
  }
  if (word.length < 4 || Math.random() > intensity / 11) return word;

  const chars = word.split("");
  const index = Math.max(1, Math.min(chars.length - 2, Math.floor(Math.random() * (chars.length - 1))));
  if (/[bcdfghjklmnpqrstvwxyz]/i.test(chars[index] ?? "")) {
    chars.splice(index, 0, pick(["m", "v", "k"]));
  } else {
    [chars[index], chars[index + 1]] = [chars[index + 1] ?? chars[index], chars[index] ?? chars[index + 1]];
  }
  return chars.join("");
};

const rimsvek = (input: string, context: TransformContext) => {
  const intensity = optionNumber(context, "intensity", 6);
  return input.replace(/\b[\w]+\b/g, (word) => rimsvekWord(word, intensity));
};

const adjacency: Record<string, string[]> = {
  a: ["s", "q", "w", "z"],
  b: ["v", "g", "h", "n"],
  c: ["x", "d", "f", "v"],
  d: ["s", "e", "r", "f", "c", "x"],
  e: ["w", "s", "d", "r"],
  f: ["d", "r", "t", "g", "v", "c"],
  g: ["f", "t", "y", "h", "b", "v"],
  h: ["g", "y", "u", "j", "n", "b"],
  i: ["u", "j", "k", "o"],
  j: ["h", "u", "i", "k", "m", "n"],
  k: ["j", "i", "o", "l", "m"],
  l: ["k", "o", "p"],
  m: ["n", "j", "k"],
  n: ["b", "h", "j", "m"],
  o: ["i", "k", "l", "p"],
  p: ["o", "l"],
  q: ["w", "a"],
  r: ["e", "d", "f", "t"],
  s: ["a", "w", "e", "d", "x", "z"],
  t: ["r", "f", "g", "y"],
  u: ["y", "h", "j", "i"],
  v: ["c", "f", "g", "b"],
  w: ["q", "a", "s", "e"],
  x: ["z", "s", "d", "c"],
  y: ["t", "g", "h", "u"],
  z: ["a", "s", "x"],
};

const typoWord = (word: string, rate: number) => {
  if (word.length < 3 || Math.random() > rate / 10) return word;
  const mode = pick(["swap", "double", "near", "drop"]);
  const index = Math.floor(Math.random() * word.length);
  const chars = word.split("");

  if (mode === "swap" && index < chars.length - 1) [chars[index], chars[index + 1]] = [chars[index + 1] ?? "", chars[index] ?? ""];
  if (mode === "double") chars.splice(index, 0, chars[index] ?? "");
  if (mode === "near") {
    const lower = (chars[index] ?? "").toLowerCase();
    const replacement = pick(adjacency[lower] ?? [lower]);
    chars[index] = chars[index] === chars[index]?.toUpperCase() ? replacement.toUpperCase() : replacement;
  }
  if (mode === "drop") chars.splice(index, 1);
  return chars.join("");
};

const typo = (input: string, context: TransformContext) => {
  const rate = optionNumber(context, "intensity", 5);
  const suffix = rate > 7 && Math.random() < 0.35 ? ` ${pick(["njir", "bjir", "wkwk", "jir"])}` : "";
  return input.replace(/\b[\w]+\b/g, (word) => typoWord(word, rate)) + suffix;
};

const randomCaps = (input: string) =>
  input
    .split("")
    .map((char) => (/[a-z]/i.test(char) ? (Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()) : char))
    .join("");

const reverse = (input: string) => input.split("").reverse().join("");

const shorten = (input: string) =>
  input
    .replace(/\baku\b/gi, "gw")
    .replace(/\bkamu\b/gi, "lu")
    .replace(/\byang\b/gi, "yg")
    .replace(/\bdengan\b/gi, "dgn")
    .replace(/\buntuk\b/gi, "utk")
    .replace(/\bkarena\b/gi, "krn")
    .replace(/\btidak\b/gi, "tdk")
    .replace(/\bsekarang\b/gi, "skrg")
    .replace(/[aeiou](?=[bcdfghjklmnpqrstvwxyz])/gi, "");

const bocilMl = (input: string) => `${input.toUpperCase().replace(/KAMU|LU/g, "U")} ${pick(["EZ", "CUPUU", "MABAR GAS", "BY ONE SINI"])}\n${pick(["EZ EZ", "NO RETRI NO PARTY", "SAVAGE DULU GA SIH"])} 🗿🗿`;

const bocilFf = (input: string) => `${input.toUpperCase()}\nADU MEKANIK? ${pick(["HEADSHOT BANG", "SG 2 ONLY", "HTTPS BANG", "SG KAYU", "ROOM NIH"])} 🤣`;

const jaksel = (input: string) =>
  `${input} ${pick(["which is", "literally", "basically", "to be fair"])} ${pick(["vibes-nya dapet", "mindset-nya harus agile", "ini tuh valid banget", "lowkey works"])}.`;

const emakFacebook = (input: string) => `Assalamualaikum 🙏 ${input} 🙏 semoga sehat selalu ya saudara-saudaraku ❤️❤️ GBU`;

const waRt = (input: string) => `INFO!!!\nDIHARAPKAN SELURUH WARGA MEMPERHATIKAN:\n${input.toUpperCase()}\nTERIMA KASIH.`;

const sigmaBocah = (input: string) => `${input}\nTidak semua pahlawan memakai jubah. Ada yang rank Epic tapi mental Mythic. SIGMA 🗿`;

const discord = (input: string) => `Greetings, esteemed member. Your message has been acknowledged: "${input}". Please keep the channel civil and on-topic.`;

const twitter = (input: string) => `${input}\n\nini bukan sekadar opini, ini fenomena sosial yang perlu kita obrolin pelan-pelan.`;

const tiktok = (input: string) => `${input}\nRIL KAH? ${pick(["VALID", "RIL MIN", "FAX NO PRINTER", "AKHIRNYA ADA YANG BILANG"])}.`;

const brainrot = (input: string) =>
  input
    .replace(/\bbang\b/gi, "bang 🗿")
    .replace(/\biya\b/gi, "iya jir")
    .replace(/\bngapain\b/gi, "ngapain bjir") + ` ${pick(["anjay", "gurinjay", "ytta aja", "bjir", "ril", "skibidi versi +62"])} `;

const tiktokComment = (input: string) => `${input.toUpperCase()}\n${pick(["RIL", "RIL MIN", "RIL KAH", "VALID", "FAX NO PRINTER", "KETUA MEMASAK"])}.`;

const copypasta = (input: string) =>
  `${input}\n\nGue ulangi ya, ${input}. Ini bukan perkara sepele. Ini sudah masuk ranah lore tongkrongan, arsip nasional, dan bahan sidang grup WA.`;

const facebookMarketplace = (input: string) => `${input}\nP\nREADY?\nNETT GA BANG?\nLOKASI MANA?`;

const toxicRank = (input: string) =>
  input
    .replace(/bodoh/gi, "OTAK UBI")
    .replace(/cupu/gi, "EZ")
    // cape ah, tambahin sendiri
    .replace(/kalah/gi, "TUTORIAL DULU") + " 🗿";

const mapCodePoint = (input: string, lowerStart: number, upperStart: number, digitStart?: number) =>
  input.replace(/[A-Za-z0-9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) return String.fromCodePoint(lowerStart + code - 97);
    if (code >= 65 && code <= 90) return String.fromCodePoint(upperStart + code - 65);
    if (digitStart !== undefined && code >= 48 && code <= 57) return String.fromCodePoint(digitStart + code - 48);
    return char;
  });

const bubble = (input: string): string => {
  // 1. Ubah semua angka 0 menjadi simbol ⓪ terlebih dahulu
  const safeInput = input.replace(/0/g, "\u24ea");

  // 2. Baru proses karakter sisanya dengan mapCodePoint
  return mapCodePoint(safeInput, 0x24d0, 0x24b6, 0x245f);
};

const bold = (input: string) => mapCodePoint(input, 0x1d41a, 0x1d400, 0x1d7ce);
const italic = (input: string) => mapCodePoint(input, 0x1d44e, 0x1d434);
const monospace = (input: string) => mapCodePoint(input, 0x1d68a, 0x1d670, 0x1d7f6);
const fraktur = (input: string) => mapCodePoint(input, 0x1d51e, 0x1d504);
const doubleStruck = (input: string) => mapCodePoint(input, 0x1d552, 0x1d538, 0x1d7d8);

const smallCapsMap: Record<string, string> = {
  a: "ᴀ",
  b: "ʙ",
  c: "ᴄ",
  d: "ᴅ",
  e: "ᴇ",
  f: "ғ",
  g: "ɢ",
  h: "ʜ",
  i: "ɪ",
  j: "ᴊ",
  k: "ᴋ",
  l: "ʟ",
  m: "ᴍ",
  n: "ɴ",
  o: "ᴏ",
  p: "ᴘ",
  q: "ǫ",
  r: "ʀ",
  s: "s",
  t: "ᴛ",
  u: "ᴜ",
  v: "ᴠ",
  w: "ᴡ",
  x: "x",
  y: "ʏ",
  z: "ᴢ",
};

const superscriptMap: Record<string, string> = {
  a: "ᵃ",
  b: "ᵇ",
  c: "ᶜ",
  d: "ᵈ",
  e: "ᵉ",
  f: "ᶠ",
  g: "ᵍ",
  h: "ʰ",
  i: "ⁱ",
  j: "ʲ",
  k: "ᵏ",
  l: "ˡ",
  m: "ᵐ",
  n: "ⁿ",
  o: "ᵒ",
  p: "ᵖ",
  r: "ʳ",
  s: "ˢ",
  t: "ᵗ",
  u: "ᵘ",
  v: "ᵛ",
  w: "ʷ",
  x: "ˣ",
  y: "ʸ",
  z: "ᶻ",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

const subscriptMap: Record<string, string> = {
  a: "ₐ",
  e: "ₑ",
  h: "ₕ",
  i: "ᵢ",
  j: "ⱼ",
  k: "ₖ",
  l: "ₗ",
  m: "ₘ",
  n: "ₙ",
  o: "ₒ",
  p: "ₚ",
  r: "ᵣ",
  s: "ₛ",
  t: "ₜ",
  u: "ᵤ",
  v: "ᵥ",
  x: "ₓ",
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

const replaceByMap = (input: string, map: Record<string, string>) => input.replace(/[A-Za-z0-9]/g, (char) => map[char.toLowerCase()] ?? char);
const smallCaps = (input: string) => replaceByMap(input, smallCapsMap);
const superscript = (input: string) => replaceByMap(input, superscriptMap);
const subscript = (input: string) => replaceByMap(input, subscriptMap);

const mirrorMap: Record<string, string> = {
  a: "ɒ",
  b: "d",
  c: "ɔ",
  d: "b",
  e: "ɘ",
  f: "Ꮈ",
  g: "ǫ",
  h: "ʜ",
  i: "i",
  j: "ꞁ",
  k: "ʞ",
  l: "l",
  m: "m",
  n: "ᴎ",
  o: "o",
  p: "q",
  q: "p",
  r: "ɿ",
  s: "ꙅ",
  t: "ƚ",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "ʏ",
  z: "ƹ",
};

const upsideMap: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "l",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  ".": "˙",
  ",": "'",
  "?": "¿",
  "!": "¡",
};

const mirror = (input: string) => replaceByMap(input.split("").reverse().join(""), mirrorMap);
const upsideDown = (input: string) => replaceByMap(input.split("").reverse().join(""), upsideMap);

const glitch = (input: string) =>
  input
    .split("")
    .map((char, index) => (index % 3 === 0 ? `${char}${pick(["_", "-", "#", "//"])}` : char))
    .join("");

const zalgoMarks = ["̴", "̵", "̷", "͏", "̕", "̚", "̓", "̽", "͒", "͑", "̾", "̿", "͆", "̎", "͗", "͐", "̫", "̖", "̻", "̙"];
const zalgo = (input: string, context: TransformContext) => {
  const intensity = optionNumber(context, "intensity", 4);
  return input
    .split("")
    .map((char) => char + Array.from({ length: Math.floor(Math.random() * intensity) }, () => pick(zalgoMarks)).join(""))
    .join("");
};

const invisible = (input: string) => input.split("").join("\u200B");

const lorem = (_input: string, context: TransformContext) => {
  const sentences = optionNumber(context, "sentences", 3);
  const source = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  ];
  return Array.from({ length: sentences }, (_, index) => source[index % source.length]).join(" ");
};

const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
  const random = Math.floor(Math.random() * 16);
  const value = char === "x" ? random : (random & 0x3) | 0x8;
  return value.toString(16);
}));

const slug = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const password = (_input: string, context: TransformContext) => {
  const length = optionNumber(context, "length", 16);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const base64 = (input: string) => btoa(unescape(encodeURIComponent(input)));

const rot13 = (input: string) =>
  input.replace(/[a-z]/gi, (char) => String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < "n" ? 13 : -13)));

const caesar = (input: string, context: TransformContext) => {
  const shift = optionNumber(context, "shift", 3);
  return input.replace(/[a-z]/gi, (char) => {
    const base = char === char.toUpperCase() ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
};

const morseMap: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
};

const morse = (input: string) =>
  input
    .toLowerCase()
    .split("")
    .map((char) => (char === " " ? "/" : morseMap[char] ?? char))
    .join(" ");

const binary = (input: string) => Array.from(input, (char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
const hex = (input: string) => Array.from(input, (char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
const htmlEncode = (input: string) =>
  input.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
const jsonEscape = (input: string) => JSON.stringify(input).slice(1, -1);
const hash = (input: string) => {
  let value = 5381;
  for (let index = 0; index < input.length; index += 1) value = (value * 33) ^ input.charCodeAt(index);
  return (value >>> 0).toString(16).padStart(8, "0");
};

export const transformers: Record<TransformerId, Transformer> = {
  alay,
  uwu,
  rimsvek,
  typo,
  randomCaps,
  reverse,
  shorten,
  bocilMl,
  bocilFf,
  jaksel,
  emakFacebook,
  waRt,
  sigmaBocah,
  discord,
  twitter,
  tiktok,
  brainrot,
  tiktokComment,
  copypasta,
  facebookMarketplace,
  toxicRank,
  bubble,
  bold,
  italic,
  smallCaps,
  circled: bubble,
  monospace,
  fraktur,
  doubleStruck,
  superscript,
  subscript,
  mirror,
  upsideDown,
  glitch,
  zalgo,
  invisible,
  lorem,
  uuid,
  slug,
  password,
  base64,
  rot13,
  caesar,
  morse,
  binary,
  hex,
  urlEncode: (input) => encodeURIComponent(input),
  urlDecode: (input) => safeDecode(input, decodeURIComponent),
  htmlEncode,
  jsonEscape,
  hash,
};

export const transformText = (input: string, context: TransformContext, transformerId: TransformerId) =>
  applyPersona(transformers[transformerId](input, context), context);
