import { io } from "socket.io-client";

const userEmail = localStorage.getItem("userEmail");

export const socket = io("http://192.168.103.172:4000", { query: { email: userEmail } });
