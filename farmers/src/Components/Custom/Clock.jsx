import { useEffect, useState } from "react";

const Clock = () => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();

    if (min < 60 && hour < 12) {
      setClock("Good Morning");
    } else if (min < 60 && hour < 16) {
      setClock("Good Day");
    } else if (min < 60 && hour < 24) {
      setClock("Good Evening");
    }
  }, []);
  return <h1 className="clock">{clock}</h1>;
};

export default Clock;
