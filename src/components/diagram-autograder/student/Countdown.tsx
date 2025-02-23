import { useState } from "react";

const Countdown = ({ date }: { date: string }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const target = new Date(date || 0);

  setInterval(() => {
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (d < 0) setDays(0);
    else setDays(d);

    const h = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (h < 0) setHours(0);
    else setHours(h);

    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    if (m < 0) setMinutes(0);
    else setMinutes(m);

    const s = Math.floor((difference % (1000 * 60)) / 1000);
    if (s < 0) setSeconds(0);
    else setSeconds(s);
  }, 1000);

  return (
    <p className="font-mono mt-0">
      <Item number={days} />:
      <Item number={hours} />:
      <Item number={minutes} />:
      <Item number={seconds} />
    </p>
  );
};

const Item = ({ number }: { number: number }) => {
  return <span>{`${number.toString().padStart(2, "0")}`}</span>;
};

export default Countdown;
