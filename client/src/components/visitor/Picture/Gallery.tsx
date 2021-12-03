import { useState, useEffect } from "react";
import Carousel, { Modal, ModalGateway } from "react-images";
import GaleryComponent from "./GaleryComponent";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { FiLoader } from "react-icons/fi";

type props = {
  changeComponent: Function;
};

export default function GalleryPhoto({ changeComponent }: props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pictures, setPictures] = useState([]);
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
      <div
        onClick={() => {
          changeComponent("menu");
        }}
        className="bg-white text-gray-900 dark:bg-gray-600 dark:text-white shadow flex justify-center w-20 py-2 rounded-lg fixed bottom-4 right-4"
      >
        Retour
      </div>

      {picturesIsLoad ? (
        pictures.length > 0 ? (
          <GaleryComponent
            openPicture={(index: number) => {
              openLightbox(index);
            }}
            photos={pictures}
          />
        ) : (
          <div className="h-96 justify-center items-center flex flex-col">
            <h2 className="animate-pulse">Aucunes photos</h2>
          </div>
        )
      ) : (
        <div className="h-96 justify-center items-center flex flex-col">
          <FiLoader size={42} className="animate-spin" />
          <h2 className="animate-pulse">Chargement</h2>
        </div>
      )}

      <ModalGateway>
        {modalIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              views={pictures}
              currentIndex={currentImage}
              styles={{
                view: (base) => ({
                  ...base,
                  display: "flex !important",
                  justifyContent: "center",
                  maxHeight: 800,
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
