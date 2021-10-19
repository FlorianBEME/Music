import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { emitEvent, subscribeToSocket } from "../../common/socket";
import { HexColorPicker } from "react-colorful";

interface Props {}

export default function Settings({}: Props) {
  return <div></div>;
}
