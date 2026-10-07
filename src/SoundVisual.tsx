import { useEffect, useRef } from "react";

export default function SoundVisual({
  analyser,
  playing,
}: {
  analyser: AnalyserNode | null;
  playing: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let visible = true;
    const data = new Uint8Array(analyser?.frequencyBinCount || 128);
    const draw = () => {
      const width = element.clientWidth,
        height = element.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (
        element.width !== Math.round(width * ratio) ||
        element.height !== Math.round(height * ratio)
      ) {
        element.width = Math.round(width * ratio);
        element.height = Math.round(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      if (analyser && playing) analyser.getByteFrequencyData(data);
      else data.fill(0);
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#cfbfa7");
      gradient.addColorStop(0.5, "#d7ba8c");
      gradient.addColorStop(1, "#ac92b8");
      context.strokeStyle = gradient;
      context.lineWidth = 3;
      context.lineCap = "round";
      const count = 48,
        step = width / count;
      for (let i = 0; i < count; i++) {
        const bin = Math.min(
          data.length - 1,
          Math.round(2 + (i / count) ** 1.6 * 65),
        );
        const amplitude =
          playing && !reduced
            ? Math.max(3, (data[bin] / 255) * (height - 20))
            : 3;
        const x = i * step + step / 2;
        context.beginPath();
        context.moveTo(x, (height - amplitude) / 2);
        context.lineTo(x, (height + amplitude) / 2);
        context.stroke();
      }
      if (playing && !reduced && visible) frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = new ResizeObserver(() => {
      if (!playing || reduced) draw();
    });
    resize.observe(element);
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) draw();
    });
    visibility.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
    };
  }, [analyser, playing]);
  return (
    <div className={`sound-visual ${playing ? "is-playing" : ""}`}>
      <div className="sound-visual-label">
        <span className="sound-indicator" />
        {playing ? "Сейчас звучит живая запись" : "У каждой истории свой голос"}
        <span>Пушкин · Метель</span>
      </div>
      <canvas ref={canvas} aria-hidden="true" />
      <p>
        {playing
          ? "Визуализация звука демофрагмента"
          : "Нажмите Play — история зазвучит"}
      </p>
    </div>
  );
}
