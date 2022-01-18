import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { appParam } from "../../../slicer/appSlice";

import "./css/songInCurrentCard.css";

export function TitleSongCard() {
  const app = useSelector(appParam);

  const [songinprogress, setsonginprogress]: any = useState();
  const [isLoad, setisLoad]: any = useState(false);

  useEffect(() => {
    setsonginprogress({
      title: app.app.titleincurent.title,
      artist: app.app.titleincurent.artist,
    });
    setisLoad(true);
    return () => {};
  }, [app.app.titleincurent.artist, app.app.titleincurent.title]);

  return (
    <div className="flex items-center space-x-4">
      <div id="bars">
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500 "></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
        <div className="bar bg-gradient-to-t dark:from-green-400 dark:to-blue-500 to-pink-500 from-yellow-500"></div>
      </div>
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {isLoad ? songinprogress.title + " - " + songinprogress.artist : null}
      </h3>
    </div>
  );
}
