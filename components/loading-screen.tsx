import { useTheme } from "next-themes";
import React from "react";

function LoadingScreen() {
  const { theme } = useTheme();
  return (
    <div
      className="w-full  flex flex-col justify-center items-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ width: "350px" }} className="animate-pulse">
        <img
          src={
            theme === "dark"
              ? "/images/logo-side-light.png"
              : "/images/logo-side-dark.png"
          }
          className=""
          alt=""
        />
      </div>
    </div>
  );
}

export default LoadingScreen;
