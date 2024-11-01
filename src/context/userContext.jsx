import axios from "axios";
import { createContext, useEffect, useState } from "react";
import axiosInstance from "../axios/interceptor";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  let url = "http://192.168.103.172:4000";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get(`/api/user/get/users/`);
      if (response.data.message === "success") {
        setData(response.data.data);
        console.log(response.data.data, "data");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getSingleUser = async () => {
    try {
      const response = await axiosInstance.get(`${url}/api/user/get/single/user`);
      if (response.data.data !== null) setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async (chat_id) => {
    try {
      const response = await axios.get(`${url}/api/chat/get/messages/${chat_id}`);
      console.log(response.data, "++++");
      setMessagesData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const value = {
    url,
    data,
    loading,
    getUsers,
    getSingleUser,
    user,
    roomData,
    setRoomData,
    messagesData,
    setMessagesData,
    getMessages,
    setData,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
