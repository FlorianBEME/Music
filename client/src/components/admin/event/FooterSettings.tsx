import { useEffect, useState, SyntheticEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FaRegCheckSquare } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";

import { removeInput } from "../../common/removeInput";
import { emitEvent } from "../../common/socketio/SocketPublicComponent";
import { FETCH } from "../../../FETCH";
import ItemFooterCard from "./footerSettingsComponents/ItemFooterCard";
import {
  addNewItemFooterInStore,
  appParam,
  updateCopyrightTextInStore,
} from "../../../slicer/appSlice";

const MySwal = withReactContent(Swal);

export default function FooterSettings() {
  const dispatch = useDispatch();
  const eventSetting = useSelector(appParam);
  const token = localStorage.getItem("token");

  const [copyright, setCopyright] = useState<any>();
  const [imagePreviewFooter, setImagePreviewFooter] = useState<any>({
    file: null,
    imagePreviewUrl: null,
  });
  const [currentFile, setCurrentFile] = useState<any>();
  const [newItem, setNewItem] = useState<any>({ name: "", path_to: "" });
  const [oldText, setoldText] = useState("Saisir votre Texte");

  useEffect(() => {
    if (eventSetting.footerCopyright != null) {
      setoldText(eventSetting.footerCopyright);
    }
  }, [eventSetting]);

  // preview image
  const handleImageChangeFooter = (e: any) => {
    if (e.target.files[0] !== undefined) {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        setImagePreviewFooter({
          file: file,
          imagePreviewUrl: reader.result,
        });
      };
      setCurrentFile(file);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewFooter({
        file: null,
        imagePreviewUrl: null,
      });
    }
  };
  // changement de l'image d'en-tête
  const addNewItemInFooter = (e: SyntheticEvent) => {
    e.preventDefault();
    if (currentFile && newItem.name.length > 0 && newItem.path_to.length > 0) {
      MySwal.fire({
        title: "Confirmation",
        text: "Êtes-vous sur de vouloir ajouter ce nouvel icone au pied de page?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, je suis sur !",
      }).then((result) => {
        if (result.isConfirmed) {
          new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", currentFile);
            axios
              .post(`${FETCH}/upload/footer`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "x-access-token": token,
                },
              })
              .then((res) => {
                const result = res.data;
                axios
                  .post(
                    `${FETCH}/footer`,
                    {
                      ...newItem,
                      filePath: result.filePath,
                    },
                    {
                      headers: {
                        "x-access-token": token,
                      },
                    }
                  )
                  .then((el) => {
                    Swal.fire("Modifié!", "", "success");
                    resolve(el);
                  })
                  .catch(function (error) {
                    reject(error);
                  });
              })
              .catch(function (error) {
                reject(error);
              });
          })
            .then((el: any) => {
              dispatch(addNewItemFooterInStore(el.data));
              emitEvent("update", "footer-item-add", el.data);
              Swal.fire("Succés!", "L'item est ajouté", "success");
            })
            .catch(() => {
              Swal.fire("Erreur!", "Une erreur est survenue", "error");
            });
        }
      });
    } else {
      Swal.fire("Erreur!", "Veuillez remplir tout les champs", "error");
    }
  };
  // modification du copyright
  const modifyCopyright = (e: SyntheticEvent) => {
    e.preventDefault();
    MySwal.fire({
      title: "Confirmation",
      text: "Êtes-vous sur de vouloir modifier le texte du copyright?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${FETCH}/copyright/1`, copyright, {
            headers: {
              "x-access-token": token,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              dispatch(updateCopyrightTextInStore(res.data.text));
              emitEvent("update", "footer-copyright-modify", res.data.text);
              removeInput(["text"]);
              Swal.fire("Modifié!", "", "success");
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };

  return (
    <div className="bg-white my-2.5 dark:bg-gray-700 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Footer
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
                required
                onChange={(e) =>
                  setNewItem({ ...newItem, [e.target.name]: e.target.value })
                }
                placeholder="Instagram"
                type="text"
                name="name"
                id="name"
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
                onChange={(e) =>
                  setNewItem({ ...newItem, [e.target.name]: e.target.value })
                }
                placeholder="https://instagram.com"
                type="url"
                name="path_to"
                id="path_to"
                className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-lg sm:text-sm border-gray-300"
              />
            </div>
          </div>
          <div className="sm:col-span-4">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              * Attention: un format avec fond transparent (png) de forme carré
              est préférable
            </span>
            <div className="flex flex-col  justify-between sm:flex-row">
              <div className="w-full sm:max-w-xs flex justify-between sm:justify-start items-center sm:justify-">
                <label
                  htmlFor="file-upload-footer"
                  className={
                    imagePreviewFooter.file !== null
                      ? "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-green-600 rounded-md w-28 "
                      : "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-gray-300 rounded-md w-28 "
                  }
                >
                  <i className="">
                    {imagePreviewFooter.file !== null ? (
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
                      imagePreviewFooter.file !== null
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
                    handleImageChangeFooter(e);
                  }}
                  id="file-upload-footer"
                  type="file"
                  className="hidden"
                  name="file"
                />
                {imagePreviewFooter.imagePreviewUrl ? (
                  <img
                    alt="banniere"
                    className="w-20 rounded-sm self-center mx-5"
                    src={imagePreviewFooter.imagePreviewUrl}
                  />
                ) : null}
              </div>
              <button
                type="submit"
                className="mt-4 sm:mt-0 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  sm:w-auto sm:text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Gerer les icones
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
          <p>Liste des icones</p>
        </div>
        <div className="flex flex-wrap">
          {eventSetting.itemFooter.length === 0 ? (
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
              Aucun icone enregistré actuellement
            </div>
          ) : (
            eventSetting.itemFooter.map((item: any) => {
              return (
                <ItemFooterCard
                  key={item.id}
                  apiPath={`${FETCH}/footer`}
                  token={token}
                  id={item.id}
                  imagePath={item.filePath}
                  nameItem={item.name}
                  filePath={item.filePath}
                  isActivate={item.isActivate}
                />
              );
            })
          )}
        </div>
      </div>
      {/* Modification du texte copyright */}
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Modifier le texte "copyright"
        </h3>{" "}
        <form
          className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
          onSubmit={(e) => modifyCopyright(e)}
        >
          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Texte
            </label>
            <div className="mt-1 flex rounded-full shadow-sm">
              <input
                required
                onChange={(e) =>
                  setCopyright({
                    ...copyright,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder={
                  { oldText } ? oldText : "©Copyright 2016L. Durand."
                }
                type="text"
                name="text"
                id="text"
                className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-lg sm:text-sm border-gray-300"
              />
            </div>
          </div>
          <div className="sm:col-span-4">
            <div className="flex flex-col  justify-between sm:flex-row">
              <button
                type="submit"
                className="mt-4 sm:mt-0 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  sm:w-auto sm:text-sm"
              >
                Modifier
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
