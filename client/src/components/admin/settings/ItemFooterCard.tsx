import { ReactElement, Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import { DotsVerticalIcon } from "@heroicons/react/solid";

interface Props {
  key: number;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ItemFooterCard(): ReactElement {
  return (
    <div>
      <div className="w-1/4 p-6 bg-white rounded-xl shadow-xl ">
        <img
          className="w-64 object-cover rounded-t-md"
          src="https://images.unsplash.com/photo-1509223197845-458d87318791"
          alt=""
        />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-700">Zebra succulent</h1>
          <p className="text-sm mt-2 text-gray-700">Two sizes</p>
          <div className="mt-3 space-x-4 flex p-1"></div>
          <div className="mt-4 mb-2 flex justify-between pl-4 pr-2">
            <button className="block text-xl font-semibold text-gray-700 cursor-auto">
              $12.99
            </button>
            <button className="text-lg block font-semibold py-2 px-6 text-green-100 hover:text-white bg-green-400 rounded-lg shadow hover:shadow-md transition duration-300">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
