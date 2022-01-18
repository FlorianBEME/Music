import React, { ReactElement } from "react";
import SwitchButton from "../../common/button/SwitchButton";

interface Props {
  isAccept: boolean;
  change: Function;
  src: string;
  id: number;
}

export default function PictureCardAdmin({
  isAccept,
  src,
  id,
}: Props): ReactElement {
  return (
    <div className="w-full p-4 border-2 border-gray-200 rounded-lg">
      <div className="w-2/3">
        <img src={src} alt={`illustratation numéro ${id}`} />
      </div>
      <div>
        <div></div>
        <div></div>
      </div>
      <div>
        <div>Supprimer</div>
        <SwitchButton checked={isAccept} onchange={undefined} />
      </div>
    </div>
  );
}
