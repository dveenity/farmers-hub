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
          Good Morning{" "}
          <IoPartlySunnySharp style={{ color: "rgb(80, 80, 255)" }} />
        </span>
      );
    } else if (min < 60 && hour < 16) {
      setClock(
        <span>
          Good Day <IoSunny style={{ color: "yellow" }} />
        </span>
      );
    } else if (min < 60 && hour < 24) {
      setClock(
        <span>
          Good Evening <BsFillMoonStarsFill style={{ color: "black" }} />
        </span>
      );
    }
  }, []);
  return <h2 className="clock">{clock}</h2>;
};

export default Clock;
