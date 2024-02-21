import { useEffect, useState } from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { IoPartlySunnySharp, IoSunny } from "react-icons/io5";

const Clock = () => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();

    if (min < 60 && hour < 12) {
      setClock(
        <span>
          Good Morning <IoPartlySunnySharp />
        </span>
      );
    } else if (min < 60 && hour < 16) {
      setClock(
        <span>
          Good Day <IoSunny />
        </span>
      );
    } else if (min < 60 && hour < 24) {
      setClock(
        <span>
          Good Evening <BsFillMoonStarsFill />
        </span>
      );
    }
  }, []);
  return <h1 className="clock">{clock}</h1>;
};

export default Clock;
