import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { emitEvent, subscribeToSocket } from "../../common/socket";
import { HexColorPicker } from "react-colorful";
import ItemFooterCard from "../settings/ItemFooterCard";
import int from "../../../assets/int.png";
import { FaRegCheckSquare } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";

const MySwal = withReactContent(Swal);

export default function Settings() {
  const [imagePreview, setImagePreview] = useState<any>({});
  const [currentFile, setCurrentFile] = useState<any>();
  const [newItem, setNewItem] = useState({ name: "", path_to: "" });
  const [itemsInFooter, setItemsInFooter] = useState<any>([]);

  useEffect(() => {
    axios
      .get(`${FETCH}/footer`)
      .then((res) => {
        setItemsInFooter(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {
      setItemsInFooter([]);
    };
  }, []);
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
  // changement de l'image d'en-tête
  const addNewItemInFooter = (e: any) => {
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
        // new Promise((resolve, reject) => {
        //   let extension: string | undefined;
        //   if (currentFile) {
        //     extension = currentFile.name.split(".").pop();
        //   }
        //   const nameFile = "bg-music." + extension;
        //   const formData = new FormData();
        //   formData.append("file", currentFile);
        //   axios
        //     .post(`${FETCH}/upload/bg/${eventCurrent.id}`, formData, {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //         "x-access-token": token,
        //       },
        //     })
        //     .then((res) => {
        //       axios
        //         .put(
        //           `${FETCH}/events/${eventCurrent.id}`,
        //           { bg_music: nameFile },
        //           {
        //             headers: {
        //               "x-access-token": token,
        //             },
        //           }
        //         )
        //         .then(() => {
        //           Swal.fire("Modifié!", "", "success");
        //           resolve(res);
        //         })
        //         .catch(function (error) {
        //           Swal.fire("Erreur!", "", "error");
        //           reject(error);
        //         });
        //     })
        //     .catch(function (error) {
        //       reject(error);
        //     });
        // })
        //   .then(() => {
        //     Swal.fire("Succés!", "L'image est changé", "success");
        //     emitEvent("update", "event");
        //   })
        //   .catch(() => {
        //     Swal.fire("Erreur!", "Une erreur est survenue", "error");
        //   });
      }
    });
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Icone
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
            <p>Ajouter un icone</p>
          </div>

          <form
            className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
            // {/* className="mt-5 flex items-center space-x-4 flex-col" */}
            onSubmit={(e) => addNewItemInFooter(e)}
          >
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Nom
              </label>
              <div className="mt-1 flex rounded-full shadow-sm">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-lg sm:text-sm border-gray-300"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Lien
              </label>
              <div className="mt-1 flex rounded-full shadow-sm">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-lg sm:text-sm border-gray-300"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                * Attention format avec fond transparent (png) de taille ....
              </span>
              <div className="flex justify-between">
                <div className=" sm:max-w-xs flex justify-between items-center">
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
                    accept=".png,.jpeg,.gif,.jpg"
                    onChange={(e) => {
                      handleImageChange(e);
                    }}
                    id="file-upload"
                    type="file"
                    className="hidden"
                  />
                  {imagePreview.imagePreviewUrl ? (
                    <img
                      alt="banniere"
                      className="w-20 rounded-sm self-center mx-5"
                      src={imagePreview.imagePreviewUrl}
                    />
                  ) : null}
                </div>
                <button
                  type="submit"
                  className=" w-full  inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  sm:w-auto sm:text-sm"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg mt-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Gerer les icones
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
              <p>Liste des icones</p>
            </div>
            <div className="">
              {itemsInFooter.map((item: any) => {
                return (
                  <ItemFooterCard
                    key={item.id}
                    imagePath={item.filePath}
                    nameItem={item.name}
                    filePath={item.filePath}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
