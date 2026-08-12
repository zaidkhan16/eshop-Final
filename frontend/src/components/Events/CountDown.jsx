import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.days === "undefined" &&
      typeof timeLeft.hours === "undefined" &&
      typeof timeLeft.minutes === "undefined" &&
      typeof timeLeft.seconds === "undefined"
    ) {
      if (data?._id) {
        axios.delete(`${server}/event/delete-shop-event/${data._id}`).catch(() => {});
      }
    }
    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const difference = +new Date(data?.Finish_Date || Date.now() + 86400000) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const keys = ["days", "hours", "minutes", "seconds"];
  const hasTime = keys.some((k) => typeof timeLeft[k] !== "undefined");

  return (
    <div className="my-4">
      {hasTime ? (
        <div className="flex items-center gap-3">
          {keys.map((unit) => (
            <div
              key={unit}
              className="flex flex-col items-center bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3 min-w-[70px] shadow-lg border border-indigo-500/20"
            >
              <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-indigo-300">
                {String(timeLeft[unit] ?? 0).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                {unit}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-bold text-sm">
          <span>⏰ Event Expired</span>
        </div>
      )}
    </div>
  );
};

export default CountDown;
