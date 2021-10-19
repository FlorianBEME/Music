import { ReactElement, useState, useEffect } from "react";

import { BsFillTrashFill } from "react-icons/bs";

import Switch from "@mui/material/Switch";

interface Props {
  key: number;
  imagePath: string;
  nameItem: string;
  filePath: string;
}

export default function ItemFooterCard({
  imagePath,
  key,
  nameItem,
  filePath,
}: Props): ReactElement {
  const [activate, setActivate] = useState(false);

  useEffect(() => {
    // setActivate()
  }, []);

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
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm dark:bg-red-800 dark:text-red-100">
            <BsFillTrashFill size={24} />
          </button>
          <Switch
            defaultChecked
            checked={activate}
            onChange={() => setActivate(!activate)}
          />
        </div>
      </div>
    </div>
  );
}
