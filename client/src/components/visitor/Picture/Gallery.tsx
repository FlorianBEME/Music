import { useState, useEffect } from "react";
import Carousel, { Modal, ModalGateway } from "react-images";
import GaleryComponent from "./GaleryComponent";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { FiLoader } from "react-icons/fi";
import { subscribeToSocket } from "../../common/socket";

type props = {
  changeComponent: Function;
};

export default function GalleryPhoto({ changeComponent }: props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pictures, setPictures] = useState<never | any>([]);
  const [picturesIsLoad, setPicturesIsload] = useState(false);

  useEffect(() => {
    axios
      .get(`${FETCH}/eventpicture/available`)
      .then((res) => {
        setPicturesIsload(true);
        setPictures(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    return () => {};
  }, []);

  // socket;
  useEffect(() => {
    subscribeToSocket((args: any) => {
      const newPicture: any = args.data;
      if (args.data === "addnewpicture") {
        setPictures((pictures: any) => [...pictures, newPicture]);
      }
    });
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setModalIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setModalIsOpen(false);
  };

  return (
    <div>
      {pictures.length > 0 ? (
        <div
          onClick={() => {
            changeComponent("menu");
          }}
          className="dark:text-red-100 dark:bg-red-700   text-red-700 bg-red-100 hover:bg-red-200  shadow flex justify-center w-20 py-2 rounded-lg fixed bottom-4 right-4"
        >
          Retour
        </div>
      ) : null}

      {picturesIsLoad ? (
        pictures.length > 0 ? (
          <GaleryComponent
            openPicture={(index: number) => {
              openLightbox(index);
            }}
            photos={pictures}
          />
        ) : (
          <div className="min-h-96 justify-center items-center flex flex-col">
            <h2 className="dark:text-white">Aucunes photos</h2>
            <div
              onClick={() => {
                changeComponent("menu");
              }}
              className="mt-2 dark:text-red-100 dark:bg-red-700   text-red-700 bg-red-100 hover:bg-red-200 shadow flex justify-center w-20 py-2 rounded-lg"
            >
              Retour
            </div>
          </div>
        )
      ) : (
        <div className="h-96 justify-center items-center flex flex-col">
          <FiLoader size={42} className="animate-spin" />
          <h2 className="animate-pulse">Chargement</h2>
          <div
            onClick={() => {
              changeComponent("menu");
            }}
            className="bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow flex justify-center w-20 py-2 rounded-lg fixed bottom-4 right-4"
          >
            Retour
          </div>
        </div>
      )}

      <ModalGateway>
        {modalIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              frameProps={{ autoSize: "height" }}
              views={pictures}
              currentIndex={currentImage}
              styles={{
                view: (base) => ({
                  ...base,
                  display: "flex !important",
                  justifyContent: "center",
                  overflow: "hidden",
                }),
              }}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
}
