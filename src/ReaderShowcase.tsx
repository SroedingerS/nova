import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Maximize2,
  Palette,
  X,
} from "lucide-react";
import "./Guide.css";
const base = import.meta.env.BASE_URL;
export const readerScenes = [
  {
    id: "reading",
    title: "Своя страница",
    text: "Текст, спокойный фон и ничего лишнего. Откройте свою книгу и устройтесь поудобнее.",
    icon: BookOpen,
    alt: "Настоящий экран Nova: открытая текстовая книга",
    article: "reader-import",
  },
  {
    id: "appearance",
    title: "Ваше оформление",
    text: "Чуть крупнее буквы, свободнее строки, теплее фон. Найдите страницу, на которой глазам хорошо.",
    icon: Palette,
    alt: "Настоящий экран Nova: настройки оформления читалки",
    article: "reader-look",
  },
  {
    id: "contents",
    title: "Нужное место",
    text: "Вернитесь к началу главы или загляните вперёд. Оглавление помогает не потеряться в длинной истории.",
    icon: BookOpen,
    alt: "Настоящий экран Nova: оглавление книги",
    article: "reader-navigation",
  },
  {
    id: "bookmarks",
    title: "Запомнить важное",
    text: "Место, к которому хочется вернуться, легко сохранить. Любимые строки будут ждать вас в закладках.",
    icon: Bookmark,
    alt: "Настоящий экран Nova: закладки текстовой книги",
    article: "reader-notes",
  },
];
export function Screenshot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <figure className="guide-screenshot">
      <button
        type="button"
        className="shot-zoom"
        onClick={() => setOpen(true)}
        aria-label={`Увеличить: ${alt}`}
      >
        <img
          src={base + src}
          alt={alt}
          width="1080"
          height="2160"
          loading="lazy"
        />
        <span className="shot-zoom-label">
          <Maximize2 size={14} /> Рассмотреть
        </span>
      </button>
      {caption && <figcaption>{caption}</figcaption>}
      <dialog
        className="guide-lightbox"
        ref={dialog}
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <button
          type="button"
          className="icon-button"
          aria-label="Закрыть изображение"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        {open && <img src={base + src} alt={alt} />}
        <p>{caption || alt}</p>
      </dialog>
    </figure>
  );
}
export default function ReaderShowcase() {
  const [active, setActive] = useState(0);
  const scene = readerScenes[active];
  return (
    <section className="section container reader-story" id="reader">
      <div className="reader-story-copy">
        <span className="eyebrow">НЕ ТОЛЬКО СЛУШАТЬ</span>
        <h2>
          Ещё одна глава.
          <br />
          <em>Теперь — глазами.</em>
        </h2>
        <p className="reader-lead">
          Любимые истории не всегда звучат. Иногда им нужны тишина, удобный
          шрифт и немного вашего времени.
        </p>
        <div
          className="reader-scene-buttons"
          role="group"
          aria-label="Экраны читалки"
        >
          {readerScenes.map((item, i) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <item.icon size={19} />
              <span>{item.title}</span>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <a className="text-link" href={`${base}guide/#reader-import`}>
          Знакомство с читалкой <ArrowUpRight size={18} />
        </a>
        <p className="reader-format-note">
          EPUB · FB2 · TXT · HTML · RTF · MOBI · PDF
        </p>
      </div>
      <div className="reader-scene-stage">
        <div className="reader-stage-decoration" aria-hidden="true">
          Читать.
          <br />
          <i>Не спешить.</i>
        </div>
        <div className="reader-device">
          <Screenshot src={`reader/${scene.id}.png`} alt={scene.alt} />
        </div>
        <div className="reader-scene-caption" aria-live="polite">
          <span>0{active + 1} / 04</span>
          <p>{scene.text}</p>
        </div>
        <small>Снимки Nova 3.0.1h с эмулятора Android</small>
      </div>
    </section>
  );
}
