import { ReactElement, useState, useEffect, SyntheticEvent } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";
import axios from "axios";

import withReactContent from "sweetalert2-react-content";
import { emitEvent } from "../../common/socket";

const MySwal = withReactContent(Swal);

interface Props {
  id: number;
  imagePath: string;
  nameItem: string;
  filePath: string;
  isActivate: boolean;
  token: string | null;
  apiPath: string;
  refetch: Function;
  emitEvent: Function;
}

export default function ItemFooterCard({
  apiPath,
  token,
  imagePath,
  id,
  nameItem,
  emitEvent,
  filePath,
  isActivate,
  refetch,
}: Props): ReactElement {
  const [activate, setActivate] = useState(false);

  useEffect(() => {
    setActivate(isActivate);
  }, [isActivate]);

  const changeStatue = (e: any) => {
    let status = e.target.checked;
    axios
      .patch(
        `${apiPath}/${id}`,
        { isActivate: status },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        refetch();
        emitEvent();
      })
      .catch((err) => console.error(err));
    setActivate(status);
  };

  const deleteItem = (e: any) => {
    MySwal.fire({
      title: "Confirmation",
      text: "Êtes-vous sur de vouloir supprimer cet item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    })
      .then((result) => {
        axios
          .delete(`${apiPath}/${id}`, {
            headers: {
              "x-access-token": token,
            },
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .then(() => {
        Swal.fire("Succés!", "L'item s'est supprimé", "success");
        refetch();
        emitEvent();
      })
      .catch(() => {
        Swal.fire("Erreur!", "Une erreur est survenue", "error");
      });
  };

  return (
    <div className="m-2">
      <div className="space-y-2  sm:w-1/5 p-6 bg-white dark:bg-gray-500 rounded-xl shadow-xl flex flex-col justify-center items-center">
        <img
          className="w-24 object-cover rounded-t-md"
          src={imagePath}
          alt=""
        />
        <div className="">
          <p className="text-2xl text-center font-bold text-gray-700 dark:text-white">
            {nameItem}
          </p>
          <p className=" text-center font-bold text-gray-400">
            {activate ? "Activé" : "Désactivé"}
          </p>
        </div>
        <div className="flex justify-between w-full">
          <button
            onClick={(e) => deleteItem(e)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm dark:bg-red-800 dark:text-red-100"
          >
            <BsFillTrashFill size={24} />
          </button>
          <Switch
            checked={isActivate ? true : false}
            onChange={(e) => {
              changeStatue(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}
