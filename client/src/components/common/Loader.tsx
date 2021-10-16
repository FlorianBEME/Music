import { ReactElement } from "react";
import { FiLoader } from "react-icons/fi";

export default function Loader(): ReactElement {
  return (
    <div className="w-full h-full justify-center items-center flex flex-col dark:text-white">
      <FiLoader size={42} className="animate-spin " />
      <h2 className="animate-pulse">Chargement</h2>
    </div>
  );
}
