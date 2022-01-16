import { useSelector } from "react-redux";

import SongRequestForm from "../songRequestBloc/songRequestForm";
import SongRequestInCurrent from "../songRequestBloc/songRequestInCurrent";
import { TitleSongCard } from "../songRequestBloc/titleSongCard";
import { musicIsLoading, musicList } from "../../../slicer/musicSlice";

export default function SongRequestBloc() {
  const isLoading = useSelector(musicIsLoading);
  const musics = useSelector(musicList);

  const visitorInfo = JSON.parse(localStorage.getItem("usInfoMusic") || "{}");

  return (
    <div className="pb-8 mx-auto px-4 sm:px-6 lg:px-8  lg:rounded-md bg-white dark:bg-gray-900 shadow sm:mb-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="max-w-3xl mx-auto">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-400 sm:px-6">
          <TitleSongCard />
        </div>

        <div className="pt-8 px-4 sm:px-6 lg:col-span-3  lg:px-8 xl:pl-12 border-b border-gray-200 dark:border-gray-400 py-5">
          {visitorInfo ? (
            <SongRequestForm
              musicList={musics}
              visitorInfo={visitorInfo ? visitorInfo.id : null}
            />
          ) : null}
        </div>
        <SongRequestInCurrent
          musicList={musics}
          visitorId={visitorInfo.id}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
