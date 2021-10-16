import { useState, useEffect } from "react";

export default function useDarkMode() {
  const themeStorage = localStorage.getItem("MusicRequestThemePreference");
  const [theme, setTheme] = useState(themeStorage || "light");
  const colorTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    console.log(theme);
    const root = window.document.documentElement.classList;

    root.remove(colorTheme);
    root.add(theme);
    localStorage.setItem("MusicRequestThemePreference", theme);
  }, [colorTheme, theme, themeStorage]);

  return [colorTheme, setTheme, theme] as const;
}
