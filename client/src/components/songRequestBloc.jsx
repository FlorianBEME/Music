import SongRequestForm from "./songRequestForm";
import SongRequestInCurrent from "./songRequestInCurrent";
import { useState, useEffect } from "react";
import axios from "axios";
import { FETCH } from "../FETCH";
import { useHistory } from "react-router-dom";
import { subscribeToSocket } from "./common/socket";

export default function SongRequestBloc() {
  // useState
  const [songs, setSongs] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [titleIncurent, setTitleIncurent] = useState("");
  const [isAllowed, setIsAllowed] = useState(true);

  const history = useHistory();
  const visitorInfo = JSON.parse(localStorage.getItem("usInfoMusic"));

  console.log(visitorInfo);

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
        console.log(erreur);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchSongIncurrent = () => {
    //fetch titre en cours
    axios
      .get(`${FETCH}/app/songinprogress`)
      .then((res) => {
        setTitleIncurent(res.data.app.titleincurent);
      })
      .catch(function (erreur) {
        console.log(erreur);
      });
  };
  useEffect(() => {
    fetchSongIncurrent();
  }, [titleIncurent]);

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
        console.log(erreur);
      });
  };
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
        console.log(erreur);
      });
  }, [visitorInfo]);

  useEffect(() => {
    subscribeToSocket((args) => {
      if (args === "visitorallowed") {
        verifyIsAllowed();
      }
    });
  }, []);

  useEffect(() => {
    subscribeToSocket((args) => {
      if (args === "musicupdate") {
        console.log();
        fetchData();
      } else if (args === "title") {
        fetchSongIncurrent();
      }
    });
  }, []);

  const sortSongs = () => {
    let sortedList = songs.sort((a, b) =>
      a.countVote > b.countVote ? -1 : b.countVote > a.countVote ? 1 : 0
    );
    return sortedList;
  };

  return (
    <div className="pb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8  lg:rounded-md bg-white dark:bg-gray-900 shadow sm:mb-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="max-w-3xl mx-auto">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-400 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            {titleIncurent}
          </h3>
        </div>
        <div className="pt-8 px-4 sm:px-6 lg:col-span-3  lg:px-8 xl:pl-12">
          <SongRequestForm
            songs={songs}
            isAllowed={isAllowed}
            refetch={fetchData}
            visitorInfo={visitorInfo ? visitorInfo : null}
          />
        </div>
        <SongRequestInCurrent
          refetch={fetchData}
          isLoading={isLoading}
          songs={sortSongs()}
          isAllowed={isAllowed}
        />
      </div>
    </div>
  );
}
