import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  ExternalLink,
  Github,
  Headphones,
  Heart,
  Library,
  Menu,
  MessageCircle,
  Moon,
  Palette,
  Pause,
  Play,
  Search,
  ShieldCheck,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tv,
  X,
  Bookmark,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { faqs, features, links, scenarios, screenshots } from "./content";
import release from "./release.json";
import AudioDemo from "./AudioDemo";
import BankSupport from "./BankSupport";

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;
const icons: Record<string, LucideIcon> = {
  search: Search,
  download: Download,
  moon: Moon,
  sliders: SlidersHorizontal,
  library: Library,
  cloud: Cloud,
  headphones: Headphones,
  tv: Tv,
  palette: Palette,
};
const nav = [
  { href: "#features", label: "Возможности" },
  { href: "#interface", label: "Интерфейс" },
  { href: "#start", label: "Как начать" },
  { href: "#support", label: "Поддержка" },
];
const shot = (index: number) => asset(`screenshots/${screenshots[index].file}`);
const date = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(release.publishedAt));

function OutLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
function DownloadLink({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a href={release.apk} className={`button primary ${className}`}>
      <Download size={19} />
      {children || "Скачать для Android"}
    </a>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection("#" + entry.target.id);
      },
      { rootMargin: "-110px 0px -45% 0px" },
    );
    for (const id of ["top", "interface", "features", "start", "support"]) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Nova — на главную">
          <img src={asset("nova-icon.webp")} width="38" height="38" alt="" />
          <span>
            nova<span className="brand-dot">.</span>
          </span>
        </a>
        <nav aria-label="Основное меню" className="desktop-nav">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href ? "active" : ""}
              aria-current={
                activeSection === item.href ? "location" : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="button small header-download" href="#download">
            Скачать Nova <ArrowDown size={16} />
          </a>
          <button
            className="icon-button menu-button"
            aria-label="Открыть меню"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
        <dialog
          id="mobile-menu"
          ref={dialog}
          className="mobile-dialog"
          onCancel={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="mobile-menu-head">
            <span className="wordmark">nova.</span>
            <button
              className="icon-button"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>
          <nav aria-label="Мобильное меню">
            {nav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span className="menu-number">0{i + 1}</span>
                {item.label}
                <ArrowUpRight size={24} />
              </a>
            ))}
          </nav>
          <a
            className="button primary"
            href="#download"
            onClick={() => setOpen(false)}
          >
            <Download size={20} />
            Скачать Nova
          </a>
          <p>Истории, которые всегда с вами.</p>
        </dialog>
      </div>
    </header>
  );
}
function Hero() {
  return (
    <section className="hero container" id="top">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="status-dot" />
          АУДИОКНИГИ NOVA <span className="eyebrow-divider">/</span> ДЛЯ ANDROID
        </div>
        <h1>
          Погрузитесь
          <br />
          <span className="accent-word">
            в историю<span className="accent-period">.</span>
          </span>
        </h1>
        <p className="hero-lead">
          Любимые книги, живые голоса и ваш ритм.
          <br className="desktop-br" />
          Дома, в дороге и перед сном — с Nova.
        </p>
        <div className="hero-buttons">
          <DownloadLink />
          <a className="button secondary" href="#demo">
            <Play size={17} fill="currentColor" />
            Попробовать плеер
          </a>
        </div>
        <div className="hero-proof">
          <span>
            <Check size={15} />
            Бесплатно
          </span>
          <span>
            <Check size={15} />
            Без рекламы
          </span>
          <span>
            <Check size={15} />
            Android 6.0+
          </span>
        </div>
        <a href="#interface" className="explore-link">
          <span className="round-arrow">
            <ArrowDown size={17} />
          </span>
          Загляните внутрь
        </a>
      </div>
      <div className="hero-visual" aria-label="Превью каталога и плеера Nova">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="hero-caption">
          <span className="tiny-star">✦</span> ОДНО ПРИЛОЖЕНИЕ.
          <br />
          <strong>ВАШИ ЛЮБИМЫЕ ИСТОРИИ.</strong>
        </div>
        <div className="hero-phone back-phone">
          <img
            src={shot(0)}
            width="540"
            height="1200"
            alt="Каталог аудиокниг Nova в тёмной теме"
            fetchPriority="high"
          />
        </div>
        <div className="hero-phone front-phone">
          <img
            src={shot(5)}
            width="540"
            height="1200"
            alt="Плеер Nova в светлой теме"
          />
        </div>
        <a href="#offline" className="floating-note offline-note">
          <span className="note-icon">
            <Download size={19} />
          </span>
          <span>
            <strong>Слушайте офлайн</strong>
            <small>Даже когда сети нет</small>
          </span>
          <Check size={16} />
        </a>
        <a href="#sleep-timer" className="floating-note timer-note">
          <Moon size={19} />
          <span>И ещё одну главу перед сном</span>
        </a>
        <span className="visual-counter">01 — ВАША НОВАЯ ПРИВЫЧКА</span>
      </div>
    </section>
  );
}
function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="container trust-inner">
        <span>
          <Headphones size={21} />
          Онлайн и офлайн
        </span>
        <span>
          <ShieldCheck size={21} />
          Без рекламных SDK
        </span>
        <span>
          <Cloud size={21} />
          Ваша библиотека с вами
        </span>
        <span>
          <Tv size={21} />
          Телефон · планшет · TV
        </span>
      </div>
    </div>
  );
}
const previewModes = [
  {
    title: "Каталог",
    image: 0,
    description: "Находите книги, которые хочется слушать.",
    detail:
      "Переключайте источник, изучайте карточки и собирайте свою следующую историю.",
    pins: [
      {
        x: 86,
        y: 7,
        label: "Источники",
        text: "Выберите источник прямо в меню. Поиск может работать по одному или нескольким источникам.",
      },
      {
        x: 28,
        y: 65,
        label: "Автор и чтец",
        text: "В карточке видны автор, чтец и информация о книге.",
      },
    ],
  },
  {
    title: "Библиотека",
    image: 2,
    description: "Место для всех ваших историй.",
    detail:
      "Слушаю сейчас, отложено на потом или уже прочитано — всё под рукой.",
    pins: [
      {
        x: 25,
        y: 14,
        label: "Слушаю сейчас",
        text: "Возвращайтесь к текущей книге и продолжайте прослушивание.",
      },
      {
        x: 18,
        y: 52,
        label: "Все книги",
        text: "Книги личной библиотеки: списки, сортировка и быстрый переход к прослушиванию.",
      },
    ],
  },
  {
    title: "Плеер",
    image: 5,
    description: "Слушайте так, как удобно именно вам.",
    detail: "Главы, скорость, закладки и таймер сна на одном экране.",
    pins: [
      {
        x: 35,
        y: 94,
        label: "Таймер сна",
        text: "Настройте остановку воспроизведения и комфортно слушайте перед сном.",
      },
      {
        x: 11,
        y: 94,
        label: "Скорость",
        text: "Подберите удобный темп прослушивания. Попробуйте регулировку в демоплеере ниже.",
      },
      {
        x: 50,
        y: 83,
        label: "Воспроизведение",
        text: "Управляйте паузой, перемоткой и переходами между главами.",
      },
    ],
  },
  {
    title: "Загрузки",
    image: 4,
    description: "История продолжается без сети.",
    detail:
      "Загрузите главы заранее, затем открывайте сохранённые книги и отдельные главы.",
    pins: [
      {
        x: 54,
        y: 30,
        label: "Книга целиком",
        text: "Можно сохранить целую книгу или только выбранные главы.",
      },
      {
        x: 42,
        y: 83,
        label: "Сохранённые главы",
        text: "Загруженные главы отмечены как офлайн. Можно запускать их по отдельности.",
      },
    ],
  },
];
function Showcase() {
  const [mode, setMode] = useState(0);
  const [pin, setPin] = useState(0);
  const current = previewModes[mode];
  return (
    <section className="section container showcase" id="interface">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / ЗАГЛЯНИТЕ ВНУТРЬ</span>
          <h2>
            Приятно смотреть.
            <br />
            <span className="muted">Ещё приятнее слушать.</span>
          </h2>
        </div>
        <p>
          Настоящие экраны Nova.
          <br />
          Выберите раздел и коснитесь подсказок.
        </p>
      </div>
      <div className="showcase-stage">
        <div className="showcase-copy">
          <div
            className="mode-tabs"
            role="tablist"
            aria-label="Разделы приложения"
            aria-orientation="vertical"
          >
            {previewModes.map((item, i) => (
              <button
                key={item.title}
                role="tab"
                id={`mode-${i}`}
                aria-controls="preview-panel"
                aria-selected={mode === i}
                tabIndex={mode === i ? 0 : -1}
                onClick={() => {
                  setMode(i);
                  setPin(0);
                }}
                onKeyDown={(event) => {
                  if (
                    ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? 3
                          : (mode + (event.key === "ArrowDown" ? 1 : 3)) % 4;
                    setMode(next);
                    setPin(0);
                    document.getElementById(`mode-${next}`)?.focus();
                  }
                }}
              >
                <span className="tab-number">0{i + 1}</span>
                {item.title}
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          <div className="preview-description">
            <h3>{current.description}</h3>
            <p>{current.detail}</p>
          </div>
          <div className="pin-info" aria-live="polite">
            <span className="pin-label">
              <span className="status-dot" />
              {current.pins[pin].label}
            </span>
            <p>{current.pins[pin].text}</p>
          </div>
        </div>
        <div
          className="preview-device-area"
          role="tabpanel"
          id="preview-panel"
          aria-labelledby={`mode-${mode}`}
        >
          <div className="preview-decoration">nova</div>
          <div className="preview-phone">
            <img
              key={current.image}
              src={shot(current.image)}
              width="540"
              height="1200"
              alt={`${current.title}: официальный экран Nova`}
              loading="lazy"
            />
            {current.pins.map((item, i) => (
              <button
                className={`hotspot ${pin === i ? "selected" : ""}`}
                key={`${mode}-${i}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                aria-label={`${item.label}: показать описание`}
                aria-pressed={pin === i}
                onClick={() => setPin(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span className="preview-footnote">
            Интерфейс можно настроить под себя
          </span>
        </div>
      </div>
    </section>
  );
}
function FeatureGrid() {
  return (
    <section className="section container" id="features">
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / ВОЗМОЖНОСТИ</span>
          <h2>
            Всё, что нужно
            <br />
            для хорошей истории<span className="mint">.</span>
          </h2>
        </div>
        <p>
          От первой найденной книги
          <br />
          до привычного вечернего ритуала.
        </p>
      </div>
      <div className="feature-grid">
        {features.map((feature) => {
          const Icon = icons[feature.icon];
          return (
            <article className="feature-card" id={feature.id} key={feature.id}>
              <div className="feature-top">
                <span>{feature.label}</span>
                <Icon size={25} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <details>
                <summary>
                  Подробнее <ArrowUpRight size={16} />
                </summary>
                <p>{feature.more}</p>
                <a className="text-link" href="#start">
                  Как начать <ArrowRight size={15} />
                </a>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
function Scenarios() {
  const [active, setActive] = useState(0);
  const current = scenarios[active];
  return (
    <section className="scenario-section" id="scenarios">
      <div className="container">
        <div className="scenario-intro">
          <span className="eyebrow">03 / В ВАШЕМ РИТМЕ</span>
          <h2>
            Есть время для жизни.
            <br />И место для историй.
          </h2>
        </div>
        <div className="scenario-tabs" aria-label="Сценарии использования">
          {scenarios.map((scenario, i) => {
            const Icon = icons[scenario.icon];
            return (
              <button
                key={scenario.id}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                <Icon size={18} />
                {scenario.title}
              </button>
            );
          })}
        </div>
        <div className="scenario-body">
          <div className="scenario-illustration">
            <div className="scene-circle" />
            <span className="scene-index">0{active + 1}</span>
            <img
              key={current.image}
              src={shot(current.image)}
              width="540"
              height="1200"
              alt={screenshots[current.image].title}
              loading="lazy"
            />
            <span className="scene-label">{current.title}</span>
          </div>
          <div className="scenario-copy">
            <span className="eyebrow">
              NOVA / {current.title.toUpperCase()}
            </span>
            <h3>{current.heading}</h3>
            <p>{current.text}</p>
            <ul>
              {current.points.map((point) => (
                <li key={point}>
                  <Check size={18} />
                  {point}
                </li>
              ))}
            </ul>
            <a href={current.link} className="text-link">
              Посмотреть подробнее <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  useEffect(() => {
    if (selected !== null) {
      if (!dialog.current?.open) dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);
  const change = (step: number) =>
    setSelected((value) =>
      value === null
        ? null
        : (value + step + screenshots.length) % screenshots.length,
    );
  return (
    <section className="section container gallery-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">05 / ВАШ СТИЛЬ</span>
          <h2>
            Рассмотрите Nova
            <br />
            поближе<span className="mint">.</span>
          </h2>
        </div>
        <p>
          Тёмная или светлая. Всегда ваша.
          <br />
          Нажмите на экран, чтобы увеличить.
        </p>
      </div>
      <div className="gallery-toolbar">
        <span>8 экранов приложения</span>
        <span>
          <ArrowRight size={16} />
          Листайте галерею
        </span>
      </div>
      <div className="gallery-track">
        {screenshots.map((item, i) => (
          <button
            className="gallery-card"
            key={item.file}
            onClick={() => setSelected(i)}
            aria-label={`Увеличить экран: ${item.title}`}
          >
            <div className="gallery-image">
              <img
                src={shot(i)}
                width="540"
                height="1200"
                alt={item.title}
                loading="lazy"
              />
              <span className="gallery-expand">
                <ArrowUpRight size={19} />
              </span>
            </div>
            <div className="gallery-title">
              <h3>{item.title}</h3>
              <span>0{i + 1}</span>
            </div>
            <p>{item.theme}</p>
          </button>
        ))}
      </div>
      <p className="gallery-note">
        Скриншоты из официального репозитория. Внешний вид зависит от вашей темы
        и версии приложения.
      </p>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="Просмотр скриншотов Nova"
        onCancel={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") change(1);
          if (event.key === "ArrowLeft") change(-1);
        }}
      >
        <div className="lightbox-top">
          <span>
            {selected === null
              ? ""
              : `${selected + 1} / ${screenshots.length} · ${screenshots[selected].title}`}
          </span>
          <button
            className="icon-button"
            aria-label="Закрыть просмотр"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
        </div>
        <div className="lightbox-main">
          <button
            className="icon-button"
            aria-label="Предыдущий экран"
            onClick={() => change(-1)}
          >
            <ChevronLeft />
          </button>
          {selected !== null && (
            <img
              src={shot(selected)}
              alt={screenshots[selected].title}
              onTouchStart={(event) => {
                touch.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touch.current !== null) {
                  const delta = event.changedTouches[0].clientX - touch.current;
                  if (Math.abs(delta) > 50) change(delta < 0 ? 1 : -1);
                }
                touch.current = null;
              }}
            />
          )}
          <button
            className="icon-button"
            aria-label="Следующий экран"
            onClick={() => change(1)}
          >
            <ChevronRight />
          </button>
        </div>
        <p>{selected === null ? "" : screenshots[selected].note}</p>
      </dialog>
    </section>
  );
}
function Devices() {
  return (
    <section className="container devices" id="devices">
      <div>
        <span className="eyebrow">БОЛЬШЕ ОДНОГО ЭКРАНА</span>
        <h2>Там, где удобно вам.</h2>
        <p>
          На телефоне в дороге, на планшете дома
          <br />
          или на Android TV с управлением с пульта.
        </p>
      </div>
      <div className="device-icons">
        <span>
          <Smartphone size={39} strokeWidth={1.3} />
          Телефон
        </span>
        <span>
          <Smartphone size={48} strokeWidth={1.3} className="tablet-icon" />
          Планшет
        </span>
        <span>
          <Tv size={61} strokeWidth={1.3} />
          Android TV
        </span>
      </div>
    </section>
  );
}
function QuickStart() {
  return (
    <section className="section container" id="start">
      <div className="section-heading">
        <div>
          <span className="eyebrow">06 / НАЧАТЬ ПРОСТО</span>
          <h2>
            От знакомства
            <br />
            до первой главы.
          </h2>
        </div>
        <p>
          Несколько шагов —<br />и ваша история начинается.
        </p>
      </div>
      <div className="steps-grid">
        {[
          {
            title: "Установите Nova",
            text: "Скачайте официальный APK и откройте его. Если Android спросит, разрешите установку для приложения, открывающего файл.",
            icon: Download,
          },
          {
            title: "Найдите свою книгу",
            text: "Выберите источник. Найдите книгу по названию или автору, откройте карточку и посмотрите описание.",
            icon: Search,
          },
          {
            title: "Нажмите Play",
            text: "Начните слушать онлайн или скачайте главы. Настройте скорость и таймер под себя.",
            icon: Play,
          },
        ].map((step, i) => (
          <article className="step" key={step.title}>
            <div className="step-number">
              0{i + 1}
              <step.icon size={22} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
      <details className="installation-details">
        <summary>
          <ShieldCheck size={20} />
          Подробная инструкция установки и обновления <span>+</span>
        </summary>
        <div>
          <ol>
            <li>
              Нажмите «Скачать для Android» на этой странице или выберите APK в
              официальном разделе Releases.
            </li>
            <li>
              Откройте скачанный APK. При запросе Android разрешите установку
              для браузера или файлового менеджера, через который открыли файл.
            </li>
            <li>
              Вернитесь к APK и подтвердите установку в системном окне. После
              установки разрешение для этого источника можно отключить.
            </li>
            <li>
              Откройте Nova, выберите доступный источник и найдите книгу. Для
              офлайн-прослушивания скачайте главы полностью.
            </li>
            <li>
              Обновляйте через настройки Nova или официальным APK поверх
              установленной версии. Для сохранения данных цифровая подпись
              должна совпадать; удалять приложение не нужно.
            </li>
          </ol>
          <OutLink href={links.forum} className="text-link">
            Обсуждение и помощь на 4PDA <ExternalLink size={15} />
          </OutLink>
        </div>
      </details>
    </section>
  );
}
function DownloadSection() {
  return (
    <section className="container download-section" id="download">
      <div className="download-copy">
        <span className="eyebrow">СЛЕДУЮЩАЯ ИСТОРИЯ НАЧИНАЕТСЯ СЕЙЧАС</span>
        <h2>
          Ваша книга
          <br />
          уже ждёт<span>.</span>
        </h2>
        <p>
          Установите Nova и найдите то,
          <br />
          что захочется дослушать до конца.
        </p>
        <div className="download-buttons">
          <DownloadLink />
          <OutLink href={links.releases} className="button secondary">
            Все файлы релиза <ArrowUpRight size={17} />
          </OutLink>
        </div>
        <div className="release-meta">
          <span>Стабильная версия {release.version}</span>
          <span>Android 6.0+</span>
          <span>≈ {Math.round(release.size / 1024 / 1024)} МБ</span>
        </div>
        <p className="release-date">
          Опубликована {date} ·{" "}
          <OutLink href={release.url}>
            Что нового <ArrowUpRight size={13} />
          </OutLink>
        </p>
      </div>
      <div className="download-art">
        <img
          src={asset("nova-icon.webp")}
          width="310"
          height="310"
          loading="lazy"
          alt="Иконка Аудиокниги Nova"
        />
        <div className="art-ring" />
        <span className="download-art-caption">ВАШИ КНИГИ. ВАШ РИТМ.</span>
      </div>
    </section>
  );
}
function FAQ() {
  return (
    <section className="section container faq-section" id="faq">
      <div className="faq-intro">
        <span className="eyebrow">07 / НА ВСЯКИЙ СЛУЧАЙ</span>
        <h2>
          Остались
          <br />
          вопросы?
        </h2>
        <p>
          Ответы, которые помогут
          <br />
          начать без лишних сложностей.
        </p>
        <OutLink href={links.telegram} className="text-link">
          Спросить в Telegram <ArrowUpRight size={17} />
        </OutLink>
      </div>
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span>+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
function Support() {
  return (
    <section className="support-section" id="support">
      <div className="container">
        <div className="support-heading">
          <div>
            <span className="eyebrow">08 / ДЕЛАЕМ NOVA ЛУЧШЕ</span>
            <h2>
              Хорошие истории
              <br />
              продолжаются вместе<span className="mint">.</span>
            </h2>
          </div>
          <Heart size={65} strokeWidth={1} />
        </div>
        <p className="support-lead">
          Nova развивается благодаря обратной связи и поддержке.
          <br />
          Если вам нравится приложение, помогите ему стать ещё лучше.
        </p>
        <BankSupport />
        <div className="support-grid">
          <article>
            <span className="support-icon">
              <Heart size={24} />
            </span>
            <h3>Дополнительный способ</h3>
            <p>
              Добровольная поддержка помогает уделять проекту больше времени.
            </p>
            <OutLink href={links.donate} className="button secondary">
              Поддержать через ЮMoney <ArrowUpRight size={17} />
            </OutLink>
            <small>
              Поддержка добровольная. Nova остаётся
              <br />
              бесплатной для всех.
            </small>
          </article>
          <article>
            <span className="support-icon">
              <MessageCircle size={24} />
            </span>
            <h3>Предложить улучшение</h3>
            <p>
              Поделитесь идеей, расскажите о проблеме или присоединитесь к
              обсуждению.
            </p>
            <OutLink href={links.telegram} className="text-link">
              Сообщество в Telegram <ArrowUpRight size={17} />
            </OutLink>
            <OutLink href={links.forum} className="text-link">
              Тема приложения на 4PDA <ArrowUpRight size={17} />
            </OutLink>
          </article>
          <ShareCard />
        </div>
      </div>
    </section>
  );
}
function ShareCard() {
  const [message, setMessage] = useState("");
  const share = async () => {
    const url = "https://sroedingers.github.io/nova/";
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Аудиокниги Nova",
          text: "Ваши книги. Ваш ритм. Nova для Android.",
          url,
        });
        setMessage("Спасибо, что рассказываете о Nova.");
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Ссылка скопирована. Отправьте её другу.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessage(`Ссылка для отправки: ${url}`);
    }
  };
  return (
    <article>
      <span className="support-icon">
        <Sparkles size={24} />
      </span>
      <h3>Рассказать друзьям</h3>
      <p>Знаете человека, который любит аудиокниги? Поделитесь с ним Nova.</p>
      <button className="text-link" onClick={share}>
        Поделиться приложением <ArrowUpRight size={17} />
      </button>
      <OutLink href={links.github} className="text-link">
        <Github size={17} />
        Проект на GitHub
      </OutLink>
      <p className="share-status" role="status">
        {message}
      </p>
    </article>
  );
}
function Footer() {
  return (
    <footer className="container footer">
      <div className="footer-top">
        <a className="brand" href="#top">
          <img src={asset("nova-icon.webp")} width="38" height="38" alt="" />
          <span>nova.</span>
        </a>
        <p>Ваши книги. Ваш ритм.</p>
        <a className="back-top" href="#top">
          Наверх <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="footer-links">
        <OutLink href={links.github}>GitHub</OutLink>
        <OutLink href={links.telegram}>Telegram</OutLink>
        <OutLink href={links.forum}>4PDA</OutLink>
        <OutLink href={links.changelog}>История изменений</OutLink>
        <OutLink href={links.privacy}>Конфиденциальность</OutLink>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Аудиокниги Nova · Schroedinger's Cat</span>
        <span>Сделано для тех, кто любит слушать.</span>
      </div>
    </footer>
  );
}
export default function App() {
  return (
    <>
      <a className="skip-link" href="#features">
        Перейти к содержимому
      </a>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Showcase />
        <FeatureGrid />
        <Scenarios />
        <AudioDemo />
        <Gallery />
        <Devices />
        <QuickStart />
        <DownloadSection />
        <FAQ />
        <Support />
      </main>
      <Footer />
    </>
  );
}
