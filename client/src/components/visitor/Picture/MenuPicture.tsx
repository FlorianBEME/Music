import React, { ReactElement, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";

import logoCamera from "../../../assets/appareil-photo(1).png";
import logoGalery from "../../../assets/galerie.png";
import { FETCH } from "../../../FETCH";
import { emitEvent } from "../../common/socketio/SocketPublicComponent";

const MySwal = withReactContent(Swal);

interface Props {
  changeComponent: Function;
}

export default function MenuPicture({ changeComponent }: Props): ReactElement {
  const hiddenFileInput: any = React.useRef(null);

  const [imagePreview, setImagePreview] = useState<any>({
    file: null,
    imagePreviewUrl: null,
  });
  const [currentFile, setCurrentFile] = useState<any>();

  const handleClickFileInput = () => {
    hiddenFileInput.current.click();
  };

  // preview image
  const handleImageChange = (e: any) => {
    if (e.target.files[0] !== undefined) {
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        setImagePreview({
          file: file,
          imagePreviewUrl: reader.result,
        });
      };

      setCurrentFile(file);
      reader.readAsDataURL(file);
    } else {
      setImagePreview({
        file: null,
        imagePreviewUrl: null,
      });
    }
  };

  const uploadPicture = () => {
    const formData = new FormData();
    formData.append("file", currentFile);
    axios
      .post(`${FETCH}/upload/picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        emitEvent("eventpiture", res.data);
        MySwal.fire("Votre photo a été envoyée!", "", "success");
        setImagePreview({
          file: null,
          imagePreviewUrl: null,
        });
      })
      .catch(function (error) {
        MySwal.fire("Erreur!", "", "error");
      });
  };

  return (
    <div className="flex flex-col items-center space-y-7 mb-7">
      <div className="flex justify-center items-center flex-col space-y-3">
        {!imagePreview.file ? (
          <div className="flex justify-center items-center flex-col space-y-3">
            <div
              onClick={handleClickFileInput}
              className=" w-40 h-40 p-8 cursor-pointer flex justify-center items-center bg-indigo-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full"
            >
              <span>
                <img src={logoCamera} alt="logo of camera" />
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".png,.jpeg,.gif,.jpg"
                className="sr-only"
                onChange={handleImageChange}
                ref={hiddenFileInput}
              />
            </div>
            <p className="dark:text-gray-300 text-lg">Ajouter une photo</p>
          </div>
        ) : (
          <div className=" flex flex-col space-y-1 items-center  text-white dark:text-gray-200 rounded-2xl">
            <img
              src={imagePreview.imagePreviewUrl}
              alt="fichier de l'utilisateur"
              className="max-h-28 rounded-lg mb-2"
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                uploadPicture();
              }}
              className="flex justify-around w-screen "
            >
              <button
                onClick={() => {
                  setImagePreview({
                    file: null,
                    imagePreviewUrl: null,
                  });
                }}
                type="button"
                className="text-white bg-red-600 dark:bg-red-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md sm:ml-3 sm:w-auto sm:text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="text-white bg-green-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md sm:ml-3 sm:w-auto sm:text-sm"
              >
                Envoyer
              </button>
            </form>
          </div>
        )}
      </div>
      <div
        className="flex justify-center items-center flex-col space-y-3 cursor-pointer"
        onClick={() => changeComponent("gallery")}
      >
        <div className="py-2 w-40 h-40 p-8 flex justify-center items-center bg-indigo-600 dark:bg-gray-600  text-white dark:text-gray-200 rounded-full">
          <img src={logoGalery} alt="logo of galery" />
        </div>
        <p className="dark:text-gray-300 text-lg">Acceder à la librairie</p>
      </div>
    </div>
  );
}
