import SongRequestForm from "../songRequestBloc/songRequestForm";
import SongRequestInCurrent from "../songRequestBloc/songRequestInCurrent";
import { useState, useEffect } from "react";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { useHistory } from "react-router-dom";
import { subscribeToSocket } from "../../common/socket";
import { TitleSongCard } from "../songRequestBloc/titleSongCard";
export default function SongRequestBloc() {
  // useState
  const [songs, setSongs] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [titleIncurent, setTitleIncurent] = useState();
  const [isAllowed, setIsAllowed] = useState(true);

  const history = useHistory();
  const visitorInfo = JSON.parse(localStorage.getItem("usInfoMusic") || "{}");

  if (!visitorInfo) {
    history.push("/new");
  }

  const fetchData = () => {
    axios
      .get(`${FETCH}/currentSongs`)
      .then((res) => {
        setSongs(res.data);
        setLoading(true);
      })
      .catch(function (erreur) {
        console.error(erreur);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchSongIncurrent = () => {
    //fetch titre en cours
    axios
      .get(`${FETCH}/app/app`)
      .then((res) => {
        setTitleIncurent(res.data.app.titleincurent);
      })
      .catch(function (erreur) {
        console.error(erreur);
      });
  };
  useEffect(() => {
    fetchSongIncurrent();
  }, [titleIncurent]);

  useEffect(() => {
    axios
      .get(`${FETCH}/visitor/${visitorInfo.id}`)
      .then((res) => {
        if (res.data[0].isNotAllowed) {
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
      })
      .catch(function (erreur) {
        console.error(erreur);
      });
  }, [visitorInfo]);

  useEffect(() => {
    const verifyIsAllowed = () => {
      axios
        .get(`${FETCH}/visitor/${visitorInfo.id}`)
        .then((res) => {
          if (res.data[0].isNotAllowed) {
            setIsAllowed(false);
          } else {
            setIsAllowed(true);
          }
        })
        .catch(function (erreur) {
          console.error(erreur);
        });
    };
    subscribeToSocket((args: string) => {
      if (args === "visitorallowed") {
        verifyIsAllowed();
      } else if (args === "musicupdate") {
        fetchData();
      } else if (args === "title") {
        fetchSongIncurrent();
      }
    });
  }, [visitorInfo.id]);

  return (
    <div className="pb-8 mx-auto px-4 sm:px-6 lg:px-8  lg:rounded-md bg-white dark:bg-gray-900 shadow sm:mb-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="max-w-3xl mx-auto">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-400 sm:px-6">
          <TitleSongCard titleIncurent={titleIncurent} />
        </div>
        <div className="pt-8 px-4 sm:px-6 lg:col-span-3  lg:px-8 xl:pl-12 border-b border-gray-200 dark:border-gray-400 py-5">
          <SongRequestForm
            songs={songs}
            isAllowed={isAllowed}
            refetch={fetchData}
            visitorInfo={visitorInfo ? visitorInfo.id : null}
          />
        </div>
        <SongRequestInCurrent
          visitorId={visitorInfo.id}
          refetch={fetchData}
          isLoading={isLoading}
          songs={songs}
          isAllowed={isAllowed}
        />
      </div>
    </div>
  );
}
