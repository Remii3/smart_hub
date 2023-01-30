import React, { useEffect, useState } from "react";
import ParallaxBg from "../../assets/img/ParallaxBg";

export default function Parallax() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    // window.addEventListener(
    //   "scroll",
    //   function () {
    //     let value = window.scrollY;
    //     // mountain.style.left = value * 0.25 + 'px';
    //   }, //onScroll, { passive: true }
    //   0
    // );
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  console.log(offset);

  return (
    <div className="">
      <ParallaxBg />
    </div>
  );
}
