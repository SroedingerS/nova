import { useState, type PointerEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Download,
  Headphones,
  Library,
  Play,
  Search,
} from "lucide-react";
import { screenshots } from "./content";
import release from "./release.json";

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;
const modes = [
  {
    image: 0,
    detail: 3,
    label: "Находить",
    title: "Следующая история — рядом",
    icon: Search,
    link: "#search",
  },
  {
    image: 2,
    detail: 2,
    label: "Собирать",
    title: "Ваша личная библиотека",
    icon: Library,
    link: "#library",
  },
  {
    image: 5,
    detail: 5,
    label: "Слушать",
    title: "Каждой книге — свой ритм",
    icon: Headphones,
    link: "#demo",
  },
];

export default function HeroExperience() {
  const [mode, setMode] = useState(0);
  const current = modes[mode];
  const Icon = current.icon;
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !window.matchMedia(
        "(hover: hover) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${((event.clientY - box.top - box.height / 2) / box.height) * -5}deg`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${((event.clientX - box.left - box.width / 2) / box.width) * 7}deg`,
    );
  };
  return (
    <section className="launch" id="top">
      <div className="launch-atmosphere" aria-hidden="true" />
      <div className="container launch-layout">
        <div className="launch-copy">
          <span className="eyebrow launch-eyebrow">
            <span className="status-dot" />
            АУДИОКНИГИ NOVA
          </span>
          <h1>
            Истории,
            <br />
            к которым
            <br />
            <em>возвращаются.</em>
          </h1>
          <p className="launch-lead">
            Nova — аудиокниги для Android. Выберите книгу и любимый голос:
            приложение сохранит ваше место — дома, в дороге и в тихий вечер.
          </p>
          <div className="launch-actions">
            <a className="button primary" href={release.apk}>
              <Download size={19} />
              Скачать для Android
              <ArrowUpRight size={18} />
            </a>
            <a className="launch-demo" href="#demo">
              <span>
                <Play size={17} fill="currentColor" />
              </span>
              Послушать Nova
            </a>
          </div>
          <div className="launch-proof">
            <span>
              <Check size={14} />
              Бесплатно
            </span>
            <span>
              <Check size={14} />
              Без рекламы
            </span>
            <span>Android 6.0+</span>
          </div>
          <a className="launch-explore" href="#features">
            <ArrowDown size={16} />
            <span>Прокрутите. Познакомьтесь. Попробуйте.</span>
          </a>
        </div>
        <div
          className={`launch-stage launch-mode-${mode}`}
          onPointerMove={move}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty("--tilt-x", "0deg");
            event.currentTarget.style.setProperty("--tilt-y", "0deg");
          }}
        >
          <div className="launch-orb" aria-hidden="true" />
          <svg
            className="launch-pages"
            viewBox="0 0 600 650"
            fill="none"
            aria-hidden="true"
          >
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={i}
                d={`M ${45 + i * 7} ${125 + i * 19} C ${110 + i * 8} ${95 + i * 21}, ${220 + i * 2} ${185 + i * 29}, 300 520 C ${380 - i * 2} ${185 + i * 29}, ${490 - i * 8} ${95 + i * 21}, ${555 - i * 7} ${125 + i * 19}`}
              />
            ))}
          </svg>
          <div
            className="launch-device"
            role="tabpanel"
            id="launch-screen"
            aria-labelledby={`launch-tab-${mode}`}
          >
            {modes.map((item, i) => (
              <img
                key={item.image}
                src={asset(`screenshots/${screenshots[item.image].file}`)}
                width="540"
                height="1200"
                alt={
                  i === mode
                    ? `${screenshots[item.image].title}: настоящий экран Nova`
                    : ""
                }
                aria-hidden={i !== mode}
                className={i === mode ? "visible" : ""}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            ))}
          </div>
          <a className="launch-detail" href={current.link}>
            <div className={`launch-detail-crop crop-${mode}`}>
              <img
                key={current.detail}
                src={asset(`screenshots/${screenshots[current.detail].file}`)}
                width="540"
                height="1200"
                alt="Фрагмент настоящего экрана Nova"
              />
            </div>
            <span>
              <Icon size={15} />
              {
                ["Автор и чтец", "Ваша библиотека", "Скорость · таймер · звук"][
                  mode
                ]
              }
              <ArrowUpRight size={14} />
            </span>
          </a>
          <div className="launch-controls">
            <div
              className="launch-tabs"
              role="tablist"
              aria-label="Знакомство с Nova"
            >
              {modes.map((item, i) => (
                <button
                  key={item.label}
                  id={`launch-tab-${i}`}
                  role="tab"
                  aria-selected={mode === i}
                  aria-controls="launch-screen"
                  tabIndex={mode === i ? 0 : -1}
                  onClick={() => setMode(i)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                        event.key,
                      )
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? 2
                            : (mode + (event.key === "ArrowRight" ? 1 : 2)) % 3;
                      setMode(next);
                      document.getElementById(`launch-tab-${next}`)?.focus();
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="launch-caption" aria-live="polite">
              {current.title}
            </p>
            <span className="launch-authentic">
              Настоящие экраны приложения Nova
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
