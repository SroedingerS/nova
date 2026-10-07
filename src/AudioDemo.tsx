import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Headphones,
  Heart,
  List,
  Moon,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume2,
} from "lucide-react";

const timeText = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

export default function AudioDemo() {
  const audio = useRef<HTMLAudioElement>(null);
  const graph = useRef<{
    context: AudioContext;
    bass: BiquadFilterNode;
    treble: BiquadFilterNode;
  } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(90);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [favorite, setFavorite] = useState(false);
  const [bookmark, setBookmark] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerSetting, setTimerSetting] = useState(0);
  const [equalizer, setEqualizer] = useState("normal");
  const [chapters, setChapters] = useState(false);
  const [message, setMessage] = useState(
    "Нажмите воспроизведение, чтобы послушать живую озвучку.",
  );
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (!playing || timer <= 0) return;
    const interval = window.setInterval(
      () =>
        setTimer((left) => {
          if (left <= 1) {
            audio.current?.pause();
            setMessage("Таймер сработал. Можно продолжить историю.");
            return 0;
          }
          return left - 1;
        }),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [playing, timer > 0]);
  useEffect(
    () => () => {
      void graph.current?.context.close();
    },
    [],
  );
  const seek = (value: number) => {
    if (!audio.current) return;
    audio.current.currentTime = Math.max(0, Math.min(value, duration));
    setTime(audio.current.currentTime);
  };
  const configureEq = async (preset: string) => {
    if (!audio.current) return;
    if (!graph.current) {
      const context = new AudioContext();
      const source = context.createMediaElementSource(audio.current);
      const bass = context.createBiquadFilter();
      bass.type = "lowshelf";
      bass.frequency.value = 220;
      const treble = context.createBiquadFilter();
      treble.type = "highshelf";
      treble.frequency.value = 2800;
      source.connect(bass).connect(treble).connect(context.destination);
      graph.current = { context, bass, treble };
    }
    await graph.current.context.resume();
    graph.current.bass.gain.value =
      preset === "warm" ? 4 : preset === "clear" ? -3 : 0;
    graph.current.treble.gain.value =
      preset === "clear" ? 3 : preset === "warm" ? -2 : 0;
    setEqualizer(preset);
  };
  const toggle = async () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      return;
    }
    try {
      if (graph.current) await graph.current.context.resume();
      if (audio.current.ended) seek(0);
      await audio.current.play();
      setMessage("Александр Пушкин · «Метель» · читает Xenium5.");
    } catch {
      setMessage("Не удалось включить звук. Попробуйте снова.");
    }
  };
  return (
    <section className="section container demo-section" id="demo">
      <div className="demo-copy">
        <span className="eyebrow">ПОПРОБУЙТЕ САМИ</span>
        <h2>
          Сначала —
          <br />
          <em>послушайте.</em>
        </h2>
        <p>
          Послушайте фрагмент, измените скорость, сохраните место. Управление
          расположено так же, как в Nova — всё нужное под рукой.
        </p>
        <div className="demo-explainer">
          <Headphones size={21} />
          <span>
            Интерфейс по настоящему экрану Nova.
            <br />
            <small>Браузерная демонстрация основных настроек плеера.</small>
          </span>
        </div>
        <p className="sample-credit">
          Александр Пушкин, «Метель». Читает Xenium5.
          <br />
          <a
            href="https://librivox.org/belkin-tales-by-alexander-pushkin/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Запись LibriVox
          </a>{" "}
          ·{" "}
          <a
            href="https://librivox.org/pages/public-domain/"
            target="_blank"
            rel="noopener noreferrer"
          >
            общественное достояние
          </a>
          .<br />
          Таймер для демонстрации работает в секундах.
        </p>
      </div>
      <div className="nova-player">
        <audio
          ref={audio}
          src={`${import.meta.env.BASE_URL}audio/metel-xenium5.mp3`}
          preload="metadata"
          onLoadedMetadata={() => {
            if (audio.current && Number.isFinite(audio.current.duration))
              setDuration(audio.current.duration);
          }}
          onTimeUpdate={() => setTime(audio.current?.currentTime || 0)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() =>
            setMessage(
              "Не удалось загрузить аудиофрагмент. Попробуйте обновить страницу.",
            )
          }
        />
        <div className="nova-player-toolbar">
          <a href="#interface" aria-label="Посмотреть интерфейс приложения">
            <ChevronLeft size={22} />
          </a>
          <BookOpen size={22} aria-hidden="true" />
          <button
            onClick={() => setChapters(!chapters)}
            aria-expanded={chapters}
            aria-label="Показать демофрагмент"
          >
            <List size={21} />
            <span>1 / 1</span>
          </button>
          <span className="nova-demo-label">ДЕМО</span>
          <button
            aria-label={
              favorite
                ? "Убрать из избранного в демо"
                : "Добавить в избранное в демо"
            }
            aria-pressed={favorite}
            onClick={() => {
              setFavorite(!favorite);
              setMessage(
                favorite
                  ? "Убрано из избранного в этой демонстрации."
                  : "Добавлено в избранное в этой демонстрации.",
              );
            }}
          >
            <Heart size={22} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>
        {chapters && (
          <div className="nova-chapter-list">
            <button
              onClick={() => {
                seek(0);
                setChapters(false);
              }}
            >
              1. Метель — демофрагмент <span>{timeText(duration)}</span>
            </button>
          </div>
        )}
        <div className="nova-book">
          <div
            className="nova-book-cover"
            aria-label="Типографическая обложка демофрагмента «Метель»"
          >
            <small>
              АЛЕКСАНДР
              <br />
              ПУШКИН
            </small>
            <strong>Метель</strong>
            <span>ПОВЕСТИ БЕЛКИНА</span>
            <i aria-hidden="true">❄</i>
          </div>
          <div className="nova-book-info">
            <p>Фрагмент 1 из 1</p>
            <h3>Метель</h3>
            <span>
              Повести покойного
              <br />
              Ивана Петровича Белкина
            </span>
            <small>Живая озвучка · русский язык</small>
          </div>
        </div>
        <div className="nova-book-meta">
          <span>Автор: Александр Пушкин</span>
          <span>Чтец: Xenium5</span>
        </div>
        <div className="nova-bookmarks">
          <button
            onClick={() => {
              setBookmark(time);
              setMessage(
                `Место сохранено: ${timeText(time)}. Кнопка «Мои закладки» вернёт вас сюда.`,
              );
            }}
          >
            <Bookmark size={19} />
            Сохранить место
          </button>
          <button
            onClick={() => {
              if (bookmark === null)
                setMessage("Закладок пока нет. Нажмите «Сохранить место».");
              else {
                seek(bookmark);
                setMessage(`Возвращение к закладке ${timeText(bookmark)}.`);
              }
            }}
          >
            <List size={19} />
            Мои закладки {bookmark !== null && <Check size={14} />}
          </button>
        </div>
        <div className="nova-series">
          <ChevronLeft size={17} />
          <span>Повести Белкина</span>
          <ChevronRight size={17} />
        </div>
        <div className="nova-progress-card">
          <div className="nova-progress-title">
            <span>Прогресс фрагмента</span>
            <strong>{Math.round((time / duration) * 100)}%</strong>
          </div>
          <label className="sr-only" htmlFor="demo-progress">
            Позиция воспроизведения
          </label>
          <input
            id="demo-progress"
            className="nova-progress"
            type="range"
            min="0"
            max={duration}
            step=".1"
            value={time}
            onChange={(event) => seek(Number(event.target.value))}
          />
          <div className="nova-times">
            <span>{timeText(time)}</span>
            <span>{timeText(duration)}</span>
          </div>
          <div className="nova-remaining">
            <span>До конца фрагмента:</span>
            <strong>{timeText(duration - time)}</strong>
          </div>
          <div className="nova-controls">
            <button aria-label="В начало фрагмента" onClick={() => seek(0)}>
              <SkipBack size={23} />
            </button>
            <button
              className="nova-skip"
              aria-label="Назад на 15 секунд"
              onClick={() => seek(time - 15)}
            >
              <RotateCcw size={29} />
              <small>15</small>
            </button>
            <button
              className="nova-play"
              aria-label={
                playing
                  ? "Приостановить демофрагмент"
                  : "Воспроизвести демофрагмент"
              }
              onClick={toggle}
            >
              {playing ? (
                <Pause fill="currentColor" size={28} />
              ) : (
                <Play fill="currentColor" size={28} />
              )}
            </button>
            <button
              className="nova-skip"
              aria-label="Вперёд на 15 секунд"
              onClick={() => seek(time + 15)}
            >
              <RotateCw size={29} />
              <small>15</small>
            </button>
            <button
              aria-label="В конец фрагмента"
              onClick={() => {
                audio.current?.pause();
                seek(duration);
              }}
            >
              <SkipForward size={23} />
            </button>
          </div>
        </div>
        <div className="nova-settings">
          <label>
            <Gauge size={20} />
            <span>Скорость</span>
            <select
              aria-label="Скорость воспроизведения"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            >
              {[0.75, 1, 1.25, 1.5, 2].map((value) => (
                <option key={value} value={value}>
                  {value}×
                </option>
              ))}
            </select>
          </label>
          <label>
            <Moon size={20} />
            <span>Таймер</span>
            <select
              aria-label="Демонстрационный таймер сна"
              value={timer > 0 ? timerSetting : 0}
              onChange={(event) => {
                setTimerSetting(Number(event.target.value));
                setTimer(Number(event.target.value));
                setMessage(
                  Number(event.target.value)
                    ? "Таймер остановит звук через выбранное число секунд."
                    : "Таймер отключён.",
                );
              }}
            >
              <option value="0">Выкл.</option>
              <option value="15">15 сек.</option>
              <option value="30">30 сек.</option>
            </select>
            {timer > 0 && <small>{timer}с</small>}
          </label>
          <label>
            <Volume2 size={20} />
            <span>Громкость</span>
            <input
              aria-label="Громкость"
              type="range"
              min="0"
              max="1"
              step=".05"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
          </label>
          <label>
            <SlidersHorizontal size={20} />
            <span>Эквалайзер</span>
            <select
              aria-label="Эквалайзер демоплеера"
              value={equalizer}
              onChange={(event) => {
                void configureEq(event.target.value).catch(() =>
                  setMessage("Эквалайзер недоступен в этом браузере."),
                );
              }}
            >
              <option value="normal">Обычный</option>
              <option value="warm">Тёплый</option>
              <option value="clear">Чёткий</option>
            </select>
          </label>
        </div>
        <p className="nova-player-status" role="status">
          {message}
        </p>
      </div>
    </section>
  );
}
