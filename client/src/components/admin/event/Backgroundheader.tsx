import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { AiOutlineDownload } from "react-icons/ai";
import { FaRegCheckSquare } from "react-icons/fa";

import MusicBandeau from "../../../assets/musicbandeau.jpg";
import { FETCH } from "../../../FETCH";
import { emitEvent } from "../../common/SocketPublicComponent";
import { updateEventBgInStore } from "../../../slicer/eventSlice";

const MySwal = withReactContent(Swal);

export interface IAppProps {
  event: any;
  token: string | null;
}

export function Backgroundheader(props: IAppProps) {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState<any>({
    file: null,
    imagePreviewUrl: null,
  });
  const [currentFile, setCurrentFile] = useState<any>();

  // changement de l'image d'en-tête
  const changeImageTop = (e: any) => {
    e.preventDefault();
    MySwal.fire({
      title: "Êtes-vous sur de vouloir modifier l'image d'en-tête?",
      text: "Cela entraînera la suppression de l'ancienne image!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        new Promise((resolve, reject) => {
          let extension: string | undefined;
          if (currentFile) {
            extension = currentFile.name.split(".").pop();
          }

          const nameFile = "bg-music." + extension;

          const formData = new FormData();
          formData.append("file", currentFile);
          axios
            .post(`${FETCH}/upload/bg/${props.event.id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-access-token": props.token,
              },
            })
            .then((res) => {
              axios
                .put(
                  `${FETCH}/events/${props.event.id}`,
                  { bg_music: nameFile },
                  {
                    headers: {
                      "x-access-token": props.token,
                    },
                  }
                )
                .then((el) => {
                  Swal.fire("Modifié!", "", "success");
                  resolve({ img: res.data, event: el.data });
                })
                .catch(function (error) {
                  Swal.fire("Erreur!", "", "error");
                  reject(error);
                });
            })
            .catch(function (error) {
              reject(error);
            });
        })
          .then((res: any) => {
            dispatch(updateEventBgInStore(res.img.filePath));
            emitEvent("update", "event", res.event);
            Swal.fire("Succés!", "L'image est changé", "success");
          })
          .catch(() => {
            Swal.fire("Erreur!", "Une erreur est survenue", "error");
          });
      }
    });
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

  return (
    <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Image d'en-tete
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
          <p>Modifier l'image d'en-tête</p>
        </div>
        <div className="flex justify-between flex-col sm:flex-row">
          <form
            className="mt-5 flex items-center space-x-4"
            onSubmit={(e) => changeImageTop(e)}
          >
            <div className=" sm:max-w-xs">
              <label
                htmlFor="file-upload-header"
                className={
                  imagePreview.file !== null
                    ? "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-green-600 rounded-md w-28 "
                    : "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-gray-300 rounded-md w-28 "
                }
              >
                <i className="">
                  {imagePreview.file !== null ? (
                    <FaRegCheckSquare size={20} className="text-green-600" />
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
                accept=".png,.jpeg,.gif,.jpg"
                onChange={(e) => {
                  handleImageChange(e);
                }}
                id="file-upload-header"
                type="file"
                className="hidden"
              />
            </div>
            <button
              disabled={imagePreview.file === null}
              type="submit"
              className={
                imagePreview.file !== null
                  ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md sm:ml-3 sm:w-auto sm:text-sm"
                  : " cursor-not-allowed text-white bg-gray-400 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md sm:ml-3 sm:w-auto sm:text-sm"
              }
            >
              Modifier
            </button>
          </form>
          {currentFile !== null || currentFile !== undefined ? (
            <img
              alt="banniere"
              className="w-52 rounded-sm mt-2 sm:mt-0 self-center"
              src={
                imagePreview.imagePreviewUrl
                  ? imagePreview.imagePreviewUrl
                  : props.event.bg_music !== null
                  ? `/uploads/${props.event.bg_music}`
                  : MusicBandeau
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
