import { useState } from "react";
import { Check, Copy } from "lucide-react";

const banks = [
  { name: "Т-Банк", number: "2200702052825648", logo: "tbank.webp" },
  { name: "Сбер", number: "2202200678077205", logo: "sber.webp" },
];

function BankCard({ bank }: { bank: (typeof banks)[number] }) {
  const [message, setMessage] = useState(
    "Нажмите на номер, чтобы скопировать.",
  );
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bank.number);
      setCopied(true);
      setMessage("Номер скопирован. Вставьте его в перевод по номеру карты.");
    } catch {
      setMessage(
        "Копирование недоступно. Выделите и скопируйте номер вручную.",
      );
    }
  };
  return (
    <article className="bank-card">
      <div className="bank-card-header">
        <img
          src={`${import.meta.env.BASE_URL}support/${bank.logo}`}
          alt=""
          width="46"
          height="46"
          loading="lazy"
        />
        <div>
          <h3>{bank.name}</h3>
          <p>Поддержать развитие Nova</p>
        </div>
      </div>
      <button
        className="bank-copy"
        onClick={copy}
        aria-label={`Скопировать номер карты ${bank.name}: ${bank.number}`}
      >
        <span>{bank.number.match(/.{4}/g)?.join(" ")}</span>
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>
      <p className="bank-copy-status" role="status">
        {message}
      </p>
    </article>
  );
}

export default function BankSupport() {
  return (
    <div className="bank-support">
      {banks.map((bank) => (
        <BankCard key={bank.name} bank={bank} />
      ))}
    </div>
  );
}
