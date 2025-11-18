"use client";
import { useTheme } from "next-themes";

function LoadingScreen() {
  const { theme } = useTheme();
  return (
    <div
      className="w-full  flex flex-col justify-center items-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ width: "350px" }} className="animate-pulse">
        {theme === "dark" ? (
          <img src={"/images/logo-side-light.png"} className="" alt="" />
        ) : (
          <img src={"/images/logo-side-dark.png"} className="" alt="" />
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;
