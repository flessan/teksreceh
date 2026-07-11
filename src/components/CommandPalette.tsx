import { useEffect, useMemo, useState } from "react";
import { searchGenerators } from "@/lib/search";
import type { GeneratorConfig } from "@/types/generator";

type CommandPaletteProps = {
  generators: GeneratorConfig[];
  open: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
};

export function CommandPalette({ generators, open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchGenerators(generators, query).slice(0, 9), [generators, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-16 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Tutup command palette" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-scale-in overflow-hidden rounded-[2rem] border-2 border-[#172033] bg-[#eaf6ff] shadow-[10px_10px_0_#172033] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[10px_10px_0_#2f4564]">
        <div className="border-b-2 border-[#172033] p-4 dark:border-[#4b6386]">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">Command Palette</p>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari generator, kategori, atau meme..."
            className="w-full rounded-2xl border-2 border-[#172033] bg-white px-4 py-3 text-base font-black text-[#101827] outline-none placeholder:text-slate-500 dark:border-[#4b6386] dark:bg-[#142033] dark:text-slate-100"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {results.map((generator) => (
            <button
              key={generator.slug}
              type="button"
              onClick={() => {
                onNavigate(generator.slug);
                onClose();
              }}
              className="mb-2 flex w-full items-center gap-3 rounded-2xl border-2 border-[#172033] bg-white p-3 text-left shadow-[3px_3px_0_#172033] transition hover:bg-sky-100 active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386] dark:bg-[#142033] dark:shadow-[3px_3px_0_#2f4564] dark:hover:bg-[#20324b]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-[#172033] bg-sky-200 text-lg text-[#101827]">{generator.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-[#101827] dark:text-slate-100">{generator.title}</span>
                <span className="block truncate text-xs font-semibold text-zinc-600 dark:text-zinc-300">{generator.description}</span>
              </span>
              <span className="hidden text-xs font-black text-zinc-500 sm:block">{generator.category}</span>
            </button>
          ))}
          {!results.length ? <p className="p-6 text-center text-sm font-black text-zinc-600 dark:text-zinc-300">Belum ketemu. Coba kata kunci lain.</p> : null}
        </div>
      </div>
    </div>
  );
}