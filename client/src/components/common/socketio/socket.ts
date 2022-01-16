import io from "socket.io-client";
import { ENDPOINT } from "../../../FETCH";

export const socket: any = io(ENDPOINT);
