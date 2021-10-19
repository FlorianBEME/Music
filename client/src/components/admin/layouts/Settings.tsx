import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { emitEvent, subscribeToSocket } from "../../common/socket";
import { HexColorPicker } from "react-colorful";
import ItemFooterCard from "../settings/ItemFooterCard";
import int from "../../../assets/int.png";

export default function Settings() {
  return (
    <div>
      <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Pied de page
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
            <p>Gérer le pied de page</p>
          </div>
          <div className="">
            <ItemFooterCard key={1} imagePath={int} nameItem="Instagram" />
          </div>
        </div>
      </div>
    </div>
  );
}
