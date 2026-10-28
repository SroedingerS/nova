import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Link as LinkIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  guideArticles,
  guideCategories,
  guideReviewedVersion,
  matchesGuide,
  normalizeGuideQuery,
  type GuideCategory,
} from "./guide-data";
import settings from "./guide-settings.json";
import { Screenshot } from "./ReaderShowcase";
import { links } from "./content";
import "./Guide.css";
const base = import.meta.env.BASE_URL;
const articleMap = new Map(guideArticles.map((a) => [a.id, a]));
function revealArticle(id: string) {
  requestAnimationFrame(() => {
    const article = document.getElementById(id);
    article?.scrollIntoView({ block: "start", behavior: "instant" });
    article?.querySelector("summary")?.focus({ preventScroll: true });
  });
}
export default function Guide() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GuideCategory | "all">("all");
  const [selected, setSelected] = useState("");
  const [copied, setCopied] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    function fromHash() {
      const id = window.location.hash.slice(1);
      if (articleMap.has(id)) {
        setSelected(id);
        setCategory("all");
        setQuery("");
        revealArticle(id);
      } else if (id === "settings") {
        setSettingsOpen(true);
        setCategory("all");
        setQuery("");
      }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);
  const normalized = normalizeGuideQuery(query);
  const filteredSettings = useMemo(
    () =>
      settings.filter((s) => {
        const article = articleMap.get(s.article)!;
        return (
          (category === "all" || article.category === category) &&
          normalized
            .split(" ")
            .filter(Boolean)
            .every((word) =>
              normalizeGuideQuery(
                s.title + " " + s.path + " " + s.keywords,
              ).includes(word),
            )
        );
      }),
    [normalized, category],
  );
  const articles = useMemo(
    () =>
      guideArticles.filter(
        (article) =>
          (category === "all" || category === article.category) &&
          (matchesGuide(article, query) ||
            (normalized &&
              filteredSettings.some((s) => s.article === article.id))),
      ),
    [category, query, normalized, filteredSettings],
  );
  function go(id: string) {
    setQuery("");
    setCategory("all");
    setSelected(id);
    if (window.location.hash !== "#" + id) window.location.hash = id;
    revealArticle(id);
  }
  function toggle(id: string, open: boolean) {
    setSelected(open ? id : "");
    window.history.replaceState(
      null,
      "",
      open ? "#" + id : window.location.pathname,
    );
  }
  async function copy(id: string) {
    try {
      await navigator.clipboard.writeText(
        new URL("#" + id, window.location.href).href,
      );
      setCopied(id);
    } catch {
      setCopied("failed");
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(""), 2500);
  }
  return (
    <div className="guide-page">
      <a className="skip-link" href="#guide-results">
        Перейти к инструкции
      </a>
      <header className="guide-header">
        <div className="container guide-header-inner">
          <a className="brand" href={base}>
            <img src={base + "nova-icon.webp"} width="38" height="38" alt="" />
            <span>nova.</span>
          </a>
          <span className="guide-header-label">ИНСТРУКЦИЯ</span>
          <a href={base} className="guide-home">
            <ArrowLeft size={16} /> На сайт
          </a>
          <a href={`${base}#download`} className="button small">
            Скачать Nova <ArrowUpRight size={15} />
          </a>
        </div>
      </header>
      <main>
        <section className="container guide-hero">
          <div>
            <span className="eyebrow">ОСВОИТЬСЯ. НАСТРОИТЬ. НАСЛАЖДАТЬСЯ.</span>
            <h1>
              Больше историй.
              <br />
              <em>Меньше вопросов.</em>
            </h1>
            <p>
              Ваш путеводитель по Nova. От первой книги до маленьких настроек,
              которые делают её по-настоящему вашей.
            </p>
            <a
              className="text-link"
              href="#first-book"
              onClick={(e) => {
                e.preventDefault();
                go("first-book");
              }}
            >
              Впервые здесь? Начнём с одной книги <ArrowRight size={18} />
            </a>
          </div>
          <div className="guide-hero-note" aria-hidden="true">
            <BookOpen size={34} strokeWidth={1} />
            <span>
              На полях
              <br />
              <i>любимых историй.</i>
            </span>
            <small>NOVA · КОРОТКО О ВАЖНОМ</small>
          </div>
        </section>
        <section
          className="container guide-search-area"
          aria-label="Поиск по инструкции"
        >
          <label className="guide-search">
            <Search size={24} />
            <span className="sr-only">Что вы хотите сделать?</span>
            <input
              ref={search}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected("");
              }}
              type="search"
              placeholder="Например: таймер сна, шрифт или книги без интернета"
              maxLength={160}
            />
            {query && (
              <button
                type="button"
                className="icon-button"
                aria-label="Очистить поиск"
                onClick={() => {
                  setQuery("");
                  search.current?.focus();
                }}
              >
                <X size={19} />
              </button>
            )}
          </label>
          <div className="guide-search-hints">
            <span>Часто ищут:</span>
            {[
              ["Без интернета", "downloads"],
              ["Чтение вслух", "reader-voice"],
              ["Размер шрифта", "reader-look"],
              ["Электронная бумага", "eink"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={"#" + id}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </section>
        <div className="container guide-layout">
          <aside className="guide-sidebar">
            <span className="eyebrow">ВЫБЕРИТЕ ТЕМУ</span>
            <nav aria-label="Разделы инструкции">
              <button
                type="button"
                aria-pressed={category === "all"}
                onClick={() => {
                  setCategory("all");
                  setSelected("");
                }}
              >
                Вся инструкция <span>{guideArticles.length}</span>
              </button>
              {guideCategories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-pressed={category === c.id}
                  onClick={() => {
                    setCategory(c.id);
                    setSelected("");
                  }}
                >
                  {c.title}
                  <span>
                    {guideArticles.filter((a) => a.category === c.id).length}
                  </span>
                </button>
              ))}
            </nav>
            <a
              className="guide-setting-link"
              href="#settings"
              onClick={() => setSettingsOpen(true)}
            >
              <SlidersHorizontal size={18} /> Все настройки{" "}
              <ArrowUpRight size={16} />
            </a>
            <p className="guide-version">
              По возможностям Nova {guideReviewedVersion}.
              <br />
              Вид экранов зависит от устройства и темы.
            </p>
          </aside>
          <section
            className="guide-results"
            id="guide-results"
            aria-label="Статьи инструкции"
          >
            <div className="guide-result-heading">
              <div>
                <span className="eyebrow">
                  {query
                    ? "РЕЗУЛЬТАТЫ ПОИСКА"
                    : "НЕБОЛЬШИЕ ПОДСКАЗКИ ДЛЯ БОЛЬШИХ ИСТОРИЙ"}
                </span>
                <h2>
                  {query
                    ? `По запросу «${query}»`
                    : category === "all"
                      ? "Что хочется узнать?"
                      : guideCategories.find((c) => c.id === category)?.title}
                </h2>
              </div>
              <span className="guide-count" aria-live="polite">
                Статей: {articles.length}
              </span>
            </div>
            <div className="guide-article-grid">
              {articles.map((article) => (
                <details
                  className="guide-article"
                  key={article.id}
                  id={article.id}
                  open={selected === article.id}
                >
                  <summary
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(article.id, selected !== article.id);
                    }}
                  >
                    <span className="guide-article-category">
                      {
                        guideCategories.find((c) => c.id === article.category)
                          ?.title
                      }
                    </span>
                    <h3>{article.title}</h3>
                    <p>{article.intro}</p>
                    <span className="guide-card-action">
                      {selected === article.id ? "Свернуть" : "Разобраться"}{" "}
                      <ChevronDown size={18} />
                    </span>
                  </summary>
                  <div
                    className={`guide-article-body ${article.image ? "has-shot" : ""}`}
                  >
                    <div>
                      <ol>
                        {article.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      {article.note && (
                        <p className="guide-note">
                          <span>НА ЗАМЕТКУ</span>
                          {article.note}
                        </p>
                      )}
                      {settings.some((s) => s.article === article.id) && (
                        <div className="guide-controls">
                          <h4>Где искать настройки</h4>
                          {settings
                            .filter((s) => s.article === article.id)
                            .map((s) => (
                              <div key={s.title}>
                                <strong>{s.title}</strong>
                                <span>
                                  {s.path}
                                  {s.device !== "Все устройства"
                                    ? ` · ${s.device}`
                                    : ""}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="guide-related">
                        <h4>Рядом с этой темой</h4>
                        {article.related.map((id) => (
                          <a
                            key={id}
                            href={"#" + id}
                            onClick={(e) => {
                              e.preventDefault();
                              go(id);
                            }}
                          >
                            {articleMap.get(id)!.title}
                            <ArrowRight size={15} />
                          </a>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="guide-copy"
                        onClick={() => copy(article.id)}
                      >
                        {copied === article.id ? (
                          <Check size={16} />
                        ) : (
                          <LinkIcon size={16} />
                        )}
                        <span aria-live="polite">
                          {copied === article.id
                            ? "Ссылка скопирована"
                            : copied === "failed"
                              ? "Ссылка на статью — в адресной строке"
                              : "Скопировать ссылку на подсказку"}
                        </span>
                      </button>
                    </div>
                    {article.image && (
                      <Screenshot
                        src={article.image}
                        alt={article.title}
                        caption={
                          article.image.startsWith("reader/")
                            ? "Читалка Nova 3.0.1h · снимок с эмулятора"
                            : "Экран Nova · оформление может отличаться"
                        }
                      />
                    )}
                  </div>
                </details>
              ))}
            </div>
            {articles.length === 0 && (
              <div className="guide-empty">
                <Search size={30} />
                <h3>Пока ничего не нашлось</h3>
                <p>
                  Попробуйте короче: «голос», «папка» или «облако». Можно также
                  убрать выбранный раздел.
                </p>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    search.current?.focus();
                  }}
                >
                  Показать все темы
                </button>
              </div>
            )}
            <details
              className="guide-settings"
              id="settings"
              open={settingsOpen || !!normalized}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setSettingsOpen(!settingsOpen);
                  if (normalized) setQuery("");
                }}
              >
                <SlidersHorizontal size={22} />
                <span>
                  <strong>Навигатор по настройкам</strong>
                  <small>Названия пунктов и путь к ним в Nova</small>
                </span>
                <span className="guide-count">{filteredSettings.length}</span>
                <ChevronDown size={18} />
              </summary>
              <div className="guide-settings-list">
                {filteredSettings.map((s) => (
                  <a
                    href={"#" + s.article}
                    key={s.title}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.article);
                    }}
                  >
                    <span>
                      <strong>{s.title}</strong>
                      <small>
                        {s.path}
                        {s.device !== "Все устройства" ? ` · ${s.device}` : ""}
                      </small>
                    </span>
                    <ArrowUpRight size={17} />
                  </a>
                ))}
                {!filteredSettings.length && (
                  <p>
                    Подходящих настроек не найдено. Попробуйте другой запрос.
                  </p>
                )}
              </div>
            </details>
            <div className="guide-help">
              <BookOpen size={25} />
              <div>
                <h3>Не нашли ответ?</h3>
                <p>
                  Расскажите, на каком шаге возник вопрос. Версия приложения и
                  пара подробностей помогут разобраться быстрее.
                </p>
              </div>
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Обсудить в Telegram <ArrowUpRight size={18} />
              </a>
            </div>
          </section>
        </div>
      </main>
      <footer className="container guide-footer">
        <a href={base} className="brand">
          nova.
        </a>
        <p>Ваши книги. Ваш ритм.</p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          К началу инструкции ↑
        </a>
      </footer>
    </div>
  );
}
