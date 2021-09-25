import { useState } from "react";
import axios from "axios";
import { FETCH } from "../FETCH";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeInput } from "./common/removeInput";

const SongRequestForm = (props) => {
  const [data, setData] = useState({
    title: "",
    artist: "",
    countVote: null,
    unavailable: 0,
    isValid: 0,
    isNew: 1,
  });

  const changeName = (e) => {
    setData({ ...data, title: e.target.value });
  };

  const changeArtist = (e) => {
    setData({ ...data, artist: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.isAllowed) {
      // on vérifie si l'artiste est déja dans la liste
      let artistFiltered = [];
      props.songs.forEach((item) => {
        if (item.artist.toLowerCase() === data.artist.toLowerCase()) {
          artistFiltered.push(item);
        }
      });
      // on vérifie si le titre est dans la liste
      if (
        artistFiltered.filter(
          (item) => item.title.toLowerCase() === data.title.toLowerCase()
        ).length < 1
      ) {
        axios
          .post(`${FETCH}/currentSongs`, {
            ...data,
            countVote: 0,
          })
          .then(() => {
            toast.success("Musique envoyé!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            removeInput(["title", "artist"]);
          })
          .catch(function (error) {
            toast.error("Erreur", { position: toast.POSITION.TOP_RIGHT });
            console.log(error);
          });
      } else {
        toast.error("Chanson déja dans la liste", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      toast.error("Vous n'êtes pas autorisé!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto lg:max-w-none">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col justify-center items-center space-y-4"
      >
        <div className="flex space-x-4">
          <div>
            <label htmlFor="title" className="sr-only">
              Titre
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              autoComplete="title"
              className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
              placeholder="Titre"
              onChange={(e) => changeName(e)}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Artiste
            </label>
            <input
              required
              id="artist"
              name="artist"
              type="artist"
              autoComplete="artist"
              className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-400 rounded-md"
              placeholder="Artiste"
              onChange={(e) => changeArtist(e)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default SongRequestForm;
