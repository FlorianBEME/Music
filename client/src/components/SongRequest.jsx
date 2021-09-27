import React from "react";
import SongRequestBloc from "../components/songRequestBloc.jsx";
import MusicBandeau from "../assets/musicbandeau.jpg";
import ThemeSelect from "./common/ThemeSelect";
import NavBar from "./NavBar.jsx";

const SongRequest = (props) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="relative h-32">
        <div className="absolute inset-0">
          {props.eventLoad ? (
            <img
              className="w-full h-full object-cover"
              src={
                props.event.length > 0 && props.event[0].bg_music !== null
                  ? `/uploads/${props.event[0].bg_music}`
                  : MusicBandeau
              }
              alt="banniere"
            />
          ) : null}
        </div>
        <div className="relative max-w-7xl mx-auto h-32 sm:px-8 px-2">
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl ">
              {props.event[0].name}
            </h1>
          </div>
        </div>
      </div>
      <NavBar />
      <SongRequestBloc />
    </div>
  );
};

export default SongRequest;
