import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { emitEvent } from "../../common/socket";
import axios from "axios";
import { removeInput } from "../../common/removeInput";
import { FaRegCheckSquare } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";

import { FETCH } from "../../../FETCH";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type PopUpFormProps = {
  submit: Function;
};

function PopUpForm({ submit }: PopUpFormProps) {
  const imagePreviewRef: any = useRef();
  const token = localStorage.getItem("token");
  const [imagePreview, setImagePreview] = useState<any>({
    file: null,
    imagePreviewUrl: null,
  });
  const [currentFile, setCurrentFile] = useState(null);
  const [newPopup, setNewPopup] = useState({
    title: null,
    text_content: null,
    filePath: null,
    uuid: uuidv4(),
    time: null,
  });

  // preview image
  const handleImageChange = (e: any | null) => {
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
  // change state
  const handleChange = (e: any) => {
    setNewPopup({ ...newPopup, [e.target.name]: e.target.value });
  };
  // Envoie d'un nouveau pop up
  const handleSubmitPopup = (e: any) => {
    e.preventDefault();
    if (newPopup.title && newPopup.time) {
      MySwal.fire({
        title: "Êtes vous sur de vouloir envoyer cette annonce?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      }).then((result) => {
        if (result.isConfirmed) {
          // Je vérifie si mon popup contien une image
          if (currentFile) {
            // j'upload mon fichier sur le serveur
            new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append("file", currentFile);
              axios
                .post(`${FETCH}/upload/popimage`, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    "x-access-token": token,
                  },
                })
                .then((res) => {
                  // si le fichier est bien upload
                  const result = res.data;
                  axios
                    .post(
                      `${FETCH}/pop/`,
                      {
                        ...newPopup,
                        filePath: result.filePath,
                      },
                      {
                        headers: {
                          "x-access-token": token,
                        },
                      }
                    )
                    .then(() => {
                      emitEvent("update", "pop");
                      submit();
                      removeInput(["text_content", "time", "title"]);

                      MySwal.fire(
                        "Envoyé!",
                        "L'annonce s'affichera dans quelques secondes",
                        "success"
                      );
                    })
                    .catch(function (error) {
                      MySwal.fire(
                        "Erreur!",
                        "Une erreur est survenue dans la création de l'annonce.",
                        "error"
                      );
                      reject(error);
                    });
                })
                .catch(function (error) {
                  MySwal.fire(
                    "Erreur!",
                    "Une erreur est survenue dans l'upload du fichier.",
                    "error"
                  );
                  reject(error);
                });
            }).catch((err) => console.error(err));
          } else {
            axios
              .post(`${FETCH}/pop/`, newPopup, {
                headers: {
                  "x-access-token": token,
                },
              })
              .then(() => {
                emitEvent("update", "pop");
                submit();
                removeInput(["text_content", "time", "title"]);
                MySwal.fire(
                  "Envoyé!",
                  "L'annonce s'affichera dans quelques secondes",
                  "success"
                );
              })
              .catch((err) => {
                MySwal.fire(
                  "Erreur!",
                  "Une erreur est survenue dans la création de l'annonce.",
                  "error"
                );
                console.error(err);
              });
          }
        }
      });
    }
  };

  return (
    <div>
      <form
        className="space-y-6 sm:space-y-5 divide-y divide-gray-200 bg-white dark:bg-gray-700 shadow sm:rounded-lg px-4 py-5 sm:p-6"
        onSubmit={(e) => handleSubmitPopup(e)}
      >
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Envoyer une alerte
            </h3>
            {/* <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
              This information will be displayed publicly so be careful what you
              share.
            </p> */}
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            {/* titre */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
              >
                Titre*
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <input
                    required
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
            {/* Temps d'affichage */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
              >
                Temps d'affichage (Minutes)*
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <input
                    required
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    min="0"
                    type="number"
                    name="time"
                    id="time"
                    autoComplete="time"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
            {/* Contenu */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
              >
                Contenu*
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  required
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  id="text_content"
                  name="text_content"
                  // rows={3}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  defaultValue={""}
                />
                {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
                  Write a few sentences about yourself.
                </p> */}
              </div>
            </div>
            {/* Photo */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Photo
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className=" sm:max-w-xs">
                    <label
                      htmlFor="file-upload"
                      className={
                        imagePreview.file !== null
                          ? "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-green-600 rounded-md w-28 "
                          : "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-gray-300 rounded-md w-28 "
                      }
                    >
                      <i className="">
                        {imagePreview.file !== null ? (
                          <FaRegCheckSquare
                            size={20}
                            className="text-green-600"
                          />
                        ) : (
                          <AiOutlineDownload
                            size={20}
                            className="text-gray-600 dark:text-white"
                          />
                        )}
                      </i>
                      <span
                        className={
                          imagePreview.file !== null
                            ? "text-green-600"
                            : "text-gray-600 dark:text-white"
                        }
                      >
                        Upload
                      </span>
                    </label>
                    <input
                      ref={imagePreviewRef}
                      accept=".png,.jpeg,.gif,.jpg"
                      onChange={(e) => {
                        handleImageChange(e);
                      }}
                      id="file-upload"
                      type="file"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              {imagePreview.imagePreviewUrl ? (
                <div className="relative">
                  <div
                    onClick={() => {
                      setImagePreview({
                        file: null,
                        imagePreviewUrl: null,
                      });
                      imagePreviewRef.current.value = "";
                    }}
                    className="absolute right-0 bg-red-600 text-xl text-white rounded-full p-1 -mr-3 -mt-3 sm:-mr-2 sm:mt-2 transition duration-250 ease-in-out hover:bg-red-400 cursor-pointer"
                  >
                    <MdDeleteForever />
                  </div>
                  <img
                    alt="preview"
                    className="mt-5"
                    src={imagePreview.imagePreviewUrl}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="pt-6 sm:pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Envoyer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PopUpForm;
