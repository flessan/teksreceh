import { CommandPalette } from "@/components/CommandPalette";
import { GeneratorWorkspace } from "@/components/GeneratorWorkspace";
import { categories, defaultGenerator, generatorBySlug, generators } from "@/data/generators";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/utils/cn";
import { updateHomeSeo } from "@/utils/seo";
import { FilePen, Info, Moon, Search, Sun, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const repositoryUrl = "https://github.com/flessan/teksreceh";

const getRoute = () => (window.location.pathname.replace(/^\/+|\/+$/g, "") === "tentang" ? "about" : "home");

const getInitialSlug = () => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("g");
  if (fromQuery && generatorBySlug.has(fromQuery)) return fromQuery;

  const fromHash = window.location.hash.replace("#", "");
  if (fromHash && generatorBySlug.has(fromHash)) return fromHash;

  const fromPath = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (fromPath && generatorBySlug.has(fromPath)) return fromPath;

  return defaultGenerator.slug;
};

function GeneratorDropdown({ value, onChange }: { value: string; onChange: (slug: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const active = generatorBySlug.get(value) ?? defaultGenerator;

  const groups = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return categories
      .filter((category) => category.name !== "Trending")
      .map((category) => ({
        category,
        items: generators.filter((generator) => {
          if (generator.category !== category.name) return false;
          if (!keyword) return true;
          const haystack = `${generator.title} ${generator.description} ${generator.keywords.join(" ")}`.toLowerCase();
          return haystack.includes(keyword);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleSelect = (slug: string) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">Ganti generator</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-3xl border-2 border-[#172033] bg-white px-5 py-4 text-left text-base font-black text-[#101827] shadow-[5px_5px_0_#172033] transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:text-slate-100 dark:shadow-[5px_5px_0_#2f4564] dark:hover:bg-[#20324b]"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {active.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate">{active.title}</span>
            <span className="mt-1 block truncate text-xs font-semibold text-zinc-500 dark:text-slate-300">{active.category}</span>
          </span>
        </span>
        <span className={cn("text-lg transition", open && "rotate-180")} aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-3 max-h-[440px] overflow-hidden rounded-3xl border-2 border-[#172033] bg-white shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[5px_5px_0_#2f4564]">
          <div className="border-b-2 border-[#172033] bg-white p-3 dark:border-[#4b6386] dark:bg-[#1c2a3f]">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari generator..."
              className="w-full rounded-2xl border-2 border-[#172033] bg-[#eaf6ff] px-4 py-3 text-sm font-black text-[#101827] outline-none placeholder:text-slate-500 focus:bg-sky-50 dark:border-[#4b6386] dark:bg-[#142033] dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div role="listbox" className="max-h-[340px] overflow-y-auto p-2">
            {groups.length ? (
              groups.map((group) => (
                <div key={group.category.name} className="mb-2 last:mb-0">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-slate-300">
                    {group.category.icon} {group.category.name}
                  </p>
                  <ul>
                    {group.items.map((generator) => {
                      const isActive = generator.slug === value;
                      return (
                        <li key={generator.slug}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => handleSelect(generator.slug)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-bold transition",
                              isActive
                                ? "bg-sky-300 text-[#101827] dark:bg-[#27476f] dark:text-slate-100"
                                : "text-[#101827] hover:bg-sky-100 dark:text-slate-100 dark:hover:bg-[#20324b]",
                            )}
                          >
                            <span className="text-lg" aria-hidden="true">
                              {generator.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{generator.title}</span>
                              <span className="block truncate text-xs font-semibold text-zinc-500 dark:text-slate-300">{generator.description}</span>
                            </span>
                            {isActive ? <span className="text-xs font-black">aktif</span> : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-sm font-semibold text-zinc-500 dark:text-slate-300">Tidak ada generator yang cocok.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AboutPage({ onHome }: { onHome: () => void }) {
  useEffect(() => {
    document.title = "Tentang teksreceh - Generator Teks Internet Indonesia";
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border-2 border-[#172033] bg-white p-6 shadow-[8px_8px_0_#172033] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[8px_8px_0_#2f4564] sm:p-10">
        <p className="inline-flex rounded-full border-2 border-[#172033] bg-sky-300 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#101827]">tentang proyek</p>
        <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">teksreceh adalah museum cara ngetik netizen +62.</h1>
        <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-zinc-700 dark:text-zinc-200">
          Proyek ini mengumpulkan generator teks yang berguna, absurd, dan lokal: alay, uwu, rimsvek, bocil game, fancy unicode, sampai utility developer. Fokusnya bukan banyak-banyakan tools, tapi membuat budaya mengetik internet Indonesia mudah dicoba dan diarsipkan.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["100% client-side", "open source", "mobile friendly"].map((item) => (
            <div key={item} className="rounded-3xl border-2 border-[#172033] bg-sky-100 p-5 text-lg font-black shadow-[4px_4px_0_#172033] dark:border-[#4b6386] dark:bg-[#172943] dark:shadow-[4px_4px_0_#2f4564]">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" onClick={onHome} className="rounded-2xl border-2 border-[#172033] bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-[4px_4px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386]">
            Buka generator
          </button>
          <a href={repositoryUrl} target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-[#172033] bg-sky-200 px-6 py-4 text-sm font-black text-[#101827] shadow-[4px_4px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0_#2f4564]">
            Kontribusi di GitHub
          </a>
          <a href="https://tako.id/fLeSs/gift" target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-[#172033] bg-sky-200 px-6 py-4 text-sm font-black text-[#101827] shadow-[4px_4px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0_#2f4564]">
            Traktir makan di Tako.id
          </a>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [activeSlug, setActiveSlug] = useState(getInitialSlug);
  const [commandOpen, setCommandOpen] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<string[]>("teks-receh-favorites", []);
  const [, setRecent] = useLocalStorage<string[]>("teks-receh-recent", []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("teks-receh-dark", window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);

  const activeGenerator = generatorBySlug.get(activeSlug) ?? defaultGenerator;

  const goHome = useCallback(() => {
    const url = new URL(window.location.href);
    url.pathname = "/";
    url.searchParams.set("g", activeSlug);
    window.history.pushState({}, "", url);
    setRoute("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSlug]);

  const goAbout = useCallback(() => {
    window.history.pushState({}, "", "/tentang");
    setRoute("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectGenerator = useCallback((slug: string) => {
    setActiveSlug(slug);
    setRoute("home");
    const url = new URL(window.location.href);
    url.pathname = "/";
    url.searchParams.set("g", slug);
    url.hash = "";
    window.history.replaceState({}, "", url);
  }, []);

  const recordRecent = useCallback(
    (slug: string) => {
      setRecent((current) => [slug, ...current.filter((item) => item !== slug)].slice(0, 8));
    },
    [setRecent],
  );

  const toggleFavorite = useCallback(
    (slug: string) => {
      setFavorites((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current]));
    },
    [setFavorites],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (route === "home") updateHomeSeo();
  }, [route]);

  useEffect(() => {
    const handleUrlChange = () => {
      setRoute(getRoute());
      setActiveSlug(getInitialSlug());
    };
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#eaf6ff] text-[#101827] selection:bg-sky-300 selection:text-[#101827] dark:bg-[#142033] dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b-2 border-[#172033] bg-[#eaf6ff]/95 backdrop-blur dark:border-[#4b6386] dark:bg-[#142033]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" onClick={goHome} className="flex items-center gap-3 text-left">
            <span className="grid size-11 place-items-center rounded-2xl border-2 border-[#172033] bg-sky-300 text-sm font-black lowercase shadow-[4px_4px_0_#172033] dark:shadow-[4px_4px_0_#2f4564]"><img src="/icon.svg" alt="Logo" className="w-6 h-6" /></span>
            <span>
              <span className="block text-lg font-black lowercase leading-none tracking-tight">teksreceh</span>
              <span className="hidden text-xs font-bold text-zinc-600 dark:text-zinc-300 sm:block">generator teks internet Indonesia</span>
            </span>
          </button>
          <div className="flex items-center gap-2">

        {/* Tombol Generator */}
        <button
          type="button"
          onClick={goHome}
          className={cn(
            "hidden items-center gap-2 rounded-2xl border-2 border-[#172033] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386] dark:shadow-[3px_3px_0_#2f4564] sm:inline-flex",
            // FIX: Bungkus "home" dengan tanda kutip jika itu merupakan string teks biasa
            route === "home" ? "bg-sky-300 text-[#101827]" : "bg-white text-[#101827] dark:bg-[#1c2a3f] dark:text-slate-100"
          )}
        >
          <Wand2 className="h-4 w-4" />
          <span>Generator</span>
        </button>

        {/* Tombol Tentang */}
        <button
          type="button"
          onClick={goAbout}
          className={cn(
            "hidden items-center gap-2 rounded-2xl border-2 border-[#172033] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386] dark:shadow-[3px_3px_0_#2f4564] sm:inline-flex",
            // FIX: Bungkus "about" dengan tanda kutip jika itu merupakan string teks biasa
            route === "about" ? "bg-sky-300 text-[#101827]" : "bg-white text-[#101827] dark:bg-[#1c2a3f] dark:text-slate-100"
          )}
        >
          <Info className="h-4 w-4" />
          <span>Tentang</span>
        </button>

        {/* Tombol GitHub */}
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-2xl border-2 border-[#172033] bg-white px-4 py-2 text-sm font-black text-[#101827] shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:text-slate-100 dark:shadow-[3px_3px_0_#2f4564] md:inline-flex"
        >
          <FilePen className="h-4 w-4" />
          <span>GitHub</span>
        </a>

        {/* Tombol Ctrl K */}
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-2 rounded-2xl border-2 border-[#172033] bg-blue-200 px-4 py-2 text-sm font-black text-[#101827] shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[3px_3px_0_#2f4564]"
        >
          <Search className="h-4 w-4" />
          <span>Ctrl / ⌘ + K</span>
        </button>

        {/* Tombol Dark Mode */}
        <button
          type="button"
          onClick={() => setDarkMode((value) => !value)}
          className="flex items-center justify-center rounded-2xl border-2 border-[#172033] bg-sky-300 px-4 py-2 text-sm font-black text-[#101827] shadow-[3px_3px_0_#172033] transition active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[3px_3px_0_#2f4564]"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
          </div>
        </div>
      </header>

      {route === "about" ? (
        <AboutPage onHome={goHome} />
      ) : (
        <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
          <GeneratorDropdown value={activeGenerator.slug} onChange={selectGenerator} />

          <section id="workspace" className="scroll-mt-24">
            <GeneratorWorkspace generator={activeGenerator} isFavorite={favorites.includes(activeGenerator.slug)} onToggleFavorite={toggleFavorite} onRecent={recordRecent} />
          </section>
        </main>
      )}

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-sm font-bold text-zinc-700 dark:text-zinc-300 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-[#172033] bg-white p-5 shadow-[5px_5px_0_#172033] dark:border-[#4b6386] dark:bg-[#1c2a3f] dark:shadow-[5px_5px_0_#2f4564]">
          teksreceh berjalan client-side, offline-ready, dan kontribusinya terbuka di{" "}
          <a href={repositoryUrl} target="_blank" rel="noreferrer" className="underline decoration-4 underline-offset-4">
            github.com/flessan/teksreceh
          </a>
          .
        </div>
      </footer>

      <CommandPalette generators={generators} open={commandOpen} onClose={() => setCommandOpen(false)} onNavigate={selectGenerator} />
    </div>
  );
}
