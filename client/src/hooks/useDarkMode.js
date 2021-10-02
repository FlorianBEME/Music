import { useState, useEffect } from "react";

export default function useDarkMode() {
  const themeStorage = localStorage.getItem("MusicRequestThemePreference");
  const [theme, setTheme] = useState(themeStorage);
  const colorTheme = theme === "light" ? "dark" : "light";

  useEffect(
    () => {
      if (themeStorage === null) {
        setTheme("light");
      }
      const root = window.document.documentElement;
      root.classList.remove(colorTheme);
      root.classList.add(theme);
      localStorage.setItem("MusicRequestThemePreference", theme);
    },
    [theme],
    colorTheme
  );
  return [colorTheme, setTheme, theme];
}
