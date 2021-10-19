import { ReactElement, Fragment, useState } from "react";
import { Switch } from "@headlessui/react";

import { Menu, Transition } from "@headlessui/react";

import { DotsVerticalIcon } from "@heroicons/react/solid";

interface Props {
  key: number;
  imagePath: string;
  nameItem: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ItemFooterCard({
  imagePath,
  key,
  nameItem,
}: Props): ReactElement {
  const [activate, setActivate] = useState(false);
  return (
    <div>
      <div className="w-3/5 sm:w-2/5 p-6 bg-white rounded-xl shadow-xl flex flex-col justify-center items-center">
        <img
          className="w-24 object-cover rounded-t-md"
          src={imagePath}
          alt=""
        />
        <div className="">
          <p className="text-2xl text-center font-bold text-gray-700">
            {nameItem}
          </p>
          <p className=" text-center font-bold text-gray-400">
            {activate ? "Activé" : "Désactivé"}
          </p>
          <div className="flex justify-between">
            <button className="text-lg block font-semibold py-2 px-6 text-green-100 hover:text-white bg-green-400 rounded-lg shadow">
              Supprimé
            </button>
            {activate ? (
              <button className="text-lg block font-semibold py-2 px-6 text-green-100 hover:text-white bg-green-400 rounded-lg shadow">
                X
              </button>
            ) : (
              <button className="text-lg block font-semibold py-2 px-6 text-green-100 hover:text-white bg-green-400 rounded-lg shadow">
                V
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
