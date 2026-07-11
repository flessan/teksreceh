import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { personas } from "@/data/generators";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { transformText } from "@/transformers/text";
import type { GeneratorConfig, PersonaId, TransformOptions } from "@/types/generator";
import { cn } from "@/utils/cn";

type HistoryEntry = {
  slug: string;
  title: string;
  input: string;
  output: string;
  at: number;
};

type GeneratorWorkspaceProps = {
  generator: GeneratorConfig;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  onRecent: (slug: string) => void;
};

const randomInputs = [
  "Halo, aku mau makan dulu ya.",
  "kritik respect oke gas anti tempik",
  "lu cupu sini by one",
  "selamat pagi semoga sehat selalu",
  "real banget min",
  "aku lapar tapi meeting masih panjang",
];

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

const getInitialOptions = (generator: GeneratorConfig): TransformOptions =>
  Object.fromEntries((generator.options ?? []).map((option) => [option.id, option.defaultValue]));

const ActionButton = ({ children, onClick, tone = "white" }: { children: ReactNode; onClick: () => void; tone?: "primary" | "blue" | "white" }) => {
  const tones = {
    primary: "bg-blue-600 text-white dark:border-[#4b6386]",
    blue: "bg-sky-300 text-[#101827]",
    white: "bg-white text-[#101827] dark:bg-[#1c2a3f] dark:text-slate-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 border-[#172033] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386] dark:shadow-[3px_3px_0_#2f4564]",
        tones[tone],
      )}
    >
      {children}
    </button>
  );
};

const FieldLabel = ({ children }: { children: ReactNode }) => <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">{children}</span>;

export function GeneratorWorkspace({ generator, isFavorite, onToggleFavorite, onRecent }: GeneratorWorkspaceProps) {
  const params = new URLSearchParams(window.location.search);
  const sharedInput = params.get("g") === generator.slug ? params.get("q") : null;
  const [input, setInput] = useState(sharedInput ?? generator.defaultInput);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [autoCopy, setAutoCopy] = useLocalStorage<boolean>("teks-receh-auto-copy", false);
  const [persona, setPersona] = useLocalStorage<PersonaId>("teks-receh-persona", "normal");
  const [options, setOptions] = useState<TransformOptions>(() => getInitialOptions(generator));
  const [seed, setSeed] = useState(0);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("teks-receh-history", []);

  useEffect(() => {
    const nextParams = new URLSearchParams(window.location.search);
    const nextSharedInput = nextParams.get("g") === generator.slug ? nextParams.get("q") : null;
    setInput(nextSharedInput ?? generator.defaultInput);
    setOptions(getInitialOptions(generator));
    setSeed((value) => value + 1);
    onRecent(generator.slug);
  }, [generator, onRecent]);

  const defaultOptions = useMemo(() => getInitialOptions(generator), [generator]);
  const optionKey = JSON.stringify(options);
  const output = useMemo(
    () =>
      transformText(
        input,
        {
          options: advancedOpen ? options : defaultOptions,
          persona: advancedOpen ? persona : "normal",
        },
        generator.transformer,
      ),
    [advancedOpen, defaultOptions, generator.transformer, input, optionKey, options, persona, seed],
  );

  const showToast = (message: string) => setToast(message);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(output);
    setCopied(true);
    showToast("Output disalin.");
    window.setTimeout(() => setCopied(false), 650);
  }, [output]);

  const handleClear = () => {
    setInput("");
    showToast("Input dibersihkan.");
  };

  const handleSwap = () => {
    setInput(output);
    setSeed((value) => value + 1);
    showToast("Output jadi input.");
  };

  const handleRandom = () => {
    setInput(generator.examples[0]?.input ?? randomInputs[Math.floor(Math.random() * randomInputs.length)] ?? "Halo warga +62");
    setSeed((value) => value + 1);
    showToast("Contoh dipakai.");
  };

  const handleShare = async () => {
    const url = new URL(window.location.origin);
    url.searchParams.set("g", generator.slug);
    if (input.trim()) url.searchParams.set("q", input);
    if (navigator.share) {
      await navigator.share({ title: generator.title, text: generator.description, url: url.toString() });
      return;
    }
    await copyToClipboard(url.toString());
    showToast("Share URL disalin.");
  };

  useEffect(() => {
    if (!input.trim() || !output.trim()) return;
    const handle = window.setTimeout(() => {
      setHistory((current) => {
        const next = [{ slug: generator.slug, title: generator.title, input, output, at: Date.now() }, ...current];
        return next.filter((item, index, array) => array.findIndex((candidate) => candidate.slug === item.slug && candidate.input === item.input) === index).slice(0, 10);
      });
    }, 700);
    return () => window.clearTimeout(handle);
  }, [generator.slug, generator.title, input, output, setHistory]);

  useEffect(() => {
    if (!advancedOpen || !autoCopy || !output.trim()) return;
    const handle = window.setTimeout(() => {
      void copyToClipboard(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 500);
    }, 650);
    return () => window.clearTimeout(handle);
  }, [advancedOpen, autoCopy, output]);

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(() => setToast(""), 1700);
    return () => window.clearTimeout(handle);
  }, [toast]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isTyping = activeTag === "textarea" || activeTag === "input" || activeTag === "select";
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void handleCopy();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c" && !isTyping && window.getSelection()?.toString() === "") {
        event.preventDefault();
        void handleCopy();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [handleCopy]);

  const inputLength = input.length;
  const outputLength = output.length;

  return (
    <div className="rounded-[2rem] border-2 border-[#172033] bg-white shadow-[8px_8px_0_#172033] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[8px_8px_0_#2f4564]">
      <div className="grid gap-4 border-b-2 border-[#172033] p-4 dark:border-[#4b6386] lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-[#172033] bg-sky-300 text-3xl shadow-[3px_3px_0_#172033]" aria-hidden="true">
            {generator.icon}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300">{generator.category}</p>
            <h1 className="mt-1 text-3xl font-black leading-none tracking-tight sm:text-5xl">{generator.title}</h1>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-zinc-700 dark:text-zinc-200">{generator.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ActionButton tone="blue" onClick={handleRandom}>
            Pakai contoh
          </ActionButton>
          <ActionButton tone={isFavorite ? "blue" : "white"} onClick={() => onToggleFavorite(generator.slug)}>
            {isFavorite ? "Favorited" : "Favorite"}
          </ActionButton>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {generator.examples.map((example) => (
            <button
              type="button"
              key={`${example.input}-${example.output}`}
              onClick={() => setInput(example.input)}
              className="rounded-full border-2 border-[#172033] bg-sky-100 px-3 py-2 text-xs font-black text-[#101827] transition hover:bg-sky-300 dark:border-[#4b6386]"
            >
              contoh: {example.input.slice(0, 28)}
            </button>
          ))}
          <span className="rounded-full border-2 border-[#172033] bg-white px-3 py-2 text-xs font-black text-[#101827] dark:border-[#4b6386] dark:bg-[#142033] dark:text-slate-100">
            {inputLength} in / {outputLength} out
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block rounded-3xl border-2 border-[#172033] bg-blue-50 p-4 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#142033] dark:shadow-[5px_5px_0_#2f4564]">
            <FieldLabel>Input</FieldLabel>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis teks mentah di sini..."
              className="min-h-72 w-full resize-y rounded-2xl border-2 border-[#172033] bg-white p-4 text-base font-semibold leading-7 text-[#101827] outline-none focus:bg-sky-50 dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:text-slate-100 dark:focus:bg-[#20324b]"
            />
          </label>

          <label className={cn("block rounded-3xl border-2 border-[#172033] bg-sky-100 p-4 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#172943] dark:shadow-[5px_5px_0_#2f4564]", copied && "translate-x-1 translate-y-1 shadow-none")}>
            <FieldLabel>Realtime Output</FieldLabel>
            <textarea
              value={output}
              readOnly
              placeholder="Hasil muncul otomatis..."
              className="min-h-72 w-full resize-y rounded-2xl border-2 border-[#172033] bg-white p-4 text-base font-semibold leading-7 text-[#101827] outline-none dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:text-slate-100"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 rounded-3xl border-2 border-[#172033] bg-[#eaf6ff] p-3 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#142033] dark:shadow-[5px_5px_0_#2f4564]">
          <ActionButton tone="primary" onClick={handleCopy}>
            Copy
          </ActionButton>
          <ActionButton onClick={handleClear}>Clear</ActionButton>
          <ActionButton onClick={handleSwap}>Swap</ActionButton>
          <ActionButton tone="blue" onClick={handleRandom}>
            Random
          </ActionButton>
          <ActionButton tone="blue" onClick={handleShare}>
            Share URL
          </ActionButton>
          <ActionButton onClick={() => setAdvancedOpen((value) => !value)}>
            {advancedOpen ? "Tutup advanced" : "Advanced"}
          </ActionButton>
        </div>

        {advancedOpen ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-4">
              <div className="rounded-3xl border-2 border-[#172033] bg-[#eaf6ff] p-4 shadow-[4px_4px_0_#172033] dark:border-[#4b6386] dark:bg-[#142033] dark:shadow-[4px_4px_0_#2f4564]">
                <FieldLabel>Persona</FieldLabel>
                <select
                  value={persona}
                  onChange={(event) => setPersona(event.target.value as PersonaId)}
                  className="w-full rounded-2xl border-2 border-[#172033] bg-white px-3 py-3 text-sm font-black text-[#101827] outline-none dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:text-slate-100"
                >
                  {personas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs font-semibold leading-5 text-zinc-600 dark:text-zinc-300">{personas.find((item) => item.id === persona)?.description}</p>
              </div>

              {(generator.options ?? []).map((option) => (
                <div key={option.id} className="rounded-3xl border-2 border-[#172033] bg-sky-100 p-4 shadow-[4px_4px_0_#172033] dark:border-[#4b6386] dark:bg-[#172943] dark:shadow-[4px_4px_0_#2f4564]">
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel>{option.label}</FieldLabel>
                    <span className="rounded-full border-2 border-[#172033] bg-blue-200 px-3 py-1 text-xs font-black text-[#101827]">{String(options[option.id] ?? option.defaultValue)}</span>
                  </div>
                  {option.type === "range" ? (
                    <input
                      type="range"
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      value={Number(options[option.id] ?? option.defaultValue)}
                      onChange={(event) => setOptions((current) => ({ ...current, [option.id]: Number(event.target.value) }))}
                      className="w-full accent-blue-500"
                    />
                  ) : (
                    <select
                      value={String(options[option.id] ?? option.defaultValue)}
                      onChange={(event) => setOptions((current) => ({ ...current, [option.id]: event.target.value }))}
                      className="w-full rounded-2xl border-2 border-[#172033] bg-white px-3 py-3 text-sm font-black text-[#101827] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:text-slate-100"
                    >
                      {option.choices.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {option.hint ? <p className="mt-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">{option.hint}</p> : null}
                </div>
              ))}

              <label className="flex items-center justify-between gap-3 rounded-3xl border-2 border-[#172033] bg-blue-100 p-4 text-sm font-black shadow-[4px_4px_0_#172033] dark:border-[#4b6386] dark:bg-[#172943] dark:shadow-[4px_4px_0_#2f4564]">
                Auto copy output
                <input type="checkbox" checked={autoCopy} onChange={(event) => setAutoCopy(event.target.checked)} className="size-5 accent-blue-500" />
              </label>
            </aside>

            <main className="space-y-4">
              <div className="rounded-3xl border-2 border-[#172033] bg-blue-100 p-4 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#172943] dark:shadow-[5px_5px_0_#2f4564]">
                <FieldLabel>Mini lore</FieldLabel>
                <p className="text-sm font-semibold leading-6 text-zinc-700 dark:text-zinc-200">{generator.origin}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border-2 border-[#172033] bg-white p-4 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[5px_5px_0_#2f4564]">
                  <FieldLabel>FAQ</FieldLabel>
                  <div className="space-y-2">
                    {generator.faq.map((item) => (
                      <details key={item.question} className="rounded-2xl border-2 border-[#172033] bg-[#eaf6ff] p-3 dark:border-[#4b6386] dark:bg-[#142033]">
                        <summary className="cursor-pointer text-sm font-black">{item.question}</summary>
                        <p className="mt-2 text-sm font-semibold leading-6 text-zinc-700 dark:text-zinc-200">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {history.length ? (
                  <div className="rounded-3xl border-2 border-[#172033] bg-sky-100 p-4 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#172943] dark:shadow-[5px_5px_0_#2f4564]">
                    <FieldLabel>History lokal</FieldLabel>
                    <div className="grid gap-2">
                      {history.slice(0, 4).map((item) => (
                        <button
                          type="button"
                          key={`${item.slug}-${item.at}`}
                          onClick={() => setInput(item.input)}
                          className="rounded-2xl border-2 border-[#172033] bg-white p-3 text-left shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[3px_3px_0_#2f4564]"
                        >
                          <span className="block truncate text-sm font-black">{item.title}</span>
                          <span className="block truncate text-xs font-semibold text-zinc-600 dark:text-zinc-300">{item.input}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </main>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 translate-y-4 rounded-2xl border-2 border-[#172033] bg-blue-600 px-5 py-3 text-sm font-black text-white opacity-0 shadow-[5px_5px_0_#172033] transition dark:border-[#4b6386]",
          toast && "translate-y-0 opacity-100",
        )}
      >
        {toast}
      </div>
    </div>
  );
}