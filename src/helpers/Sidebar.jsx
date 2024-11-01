import { useContext, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { GoDotFill } from "react-icons/go";
import { UserContext } from "../context/userContext";
import axiosInstance from "../axios/interceptor";
import { socket } from "../../socket";
import Modal from "../helpers/Modal";
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const { loading, data, getUsers, setData, url, user, getSingleUser, setRoomData } = useContext(UserContext);
  const email = localStorage.getItem("userEmail");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filterUsers = data.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())) || [];

  const joinChat = async (receiverId) => {
    try {
      const response = await axiosInstance.post(`${url}/api/chat/join/chat`, {
        receiverId,
      });
      socket.emit("join_room", {
        roomId: response.data.roomDetail._id,
        userId: response.data.userDetail._id,
        receiver_id: response.data.receiverDetail._id,
      });
      setRoomData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    getSingleUser();
    socket.emit("user_online", email);
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "visible") {
    //     socket.emit("user_online", email); // Set online again when tab is focused
    //   } else {
    //     setInterval(() => {
    //       socket.emit("leave_user", email); // Set offline when tab is hidden
    //     }, 1000);
    //   }
    // };

    const handleLoad = () => {
      socket.emit("user_online", email);
    };

    const handleUnload = (e) => {
      socket.emit("leave_user", email);
    };

    socket.emit("join-user", email);

    socket.on("online", (email) => {
      getUsers();
      updateUserStatus(email, "online");
    });

    socket.on("user_offline", (email) => {
      getUsers();
      updateUserStatus(email, "offline");
    });

    window.addEventListener("blur", handleUnload);
    window.addEventListener("focus", handleLoad);

    // document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleUnload);
      window.removeEventListener("focus", handleLoad);
      socket.emit("leave_user", email);
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("join_room");
      socket.off("join-user");
      socket.off("online");
    };
  }, [email, socket]);

  const updateUserStatus = (email, status) => {
    setData((prevData) => prevData.map((user) => (user.email === email ? { ...user, status } : user)));
  };

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on input when the icon is clicked
    }
  };
  return (
    <div className="p-4 mt-4  ">
      <div className="flex sticky top-10  justify-center     items-center  shadow-md  ">
        <FaUserCircle className="text-5xl mx-auto  cursor-pointer  text-green-500  mr-4 " onClick={openModal} />

        <div onClick={handleIconClick} className="bg-[#202c33]  rounded-l-md p-2 cursor-pointer">
          <CiSearch className="text-2xl  text-gray-300" />
        </div>
        <input
          ref={inputRef}
          placeholder="Search..."
          className=" rounded-r-md border-none h-[40px] w-full   border-2 focus:outline-none text-lg bg-[#202c33]"
          type="text"
          name=""
          id=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={user[0]?.name}>
        <p>{user[0]?.email}</p>
      </Modal>
      <div className="   ">
        {loading ? (
          <p>Loading...</p>
        ) : filterUsers.length === 0 ? (
          <p className="mx-auto  text-center  text-slate-500 font-medium text-lg">No users found...</p>
        ) : (
          filterUsers.map((item) => (
            <div key={item._id} className="flex  my-4 space-x-5   cursor-pointer hover:bg-[#2a3942] rounded-md p-4 items-center" onClick={() => joinChat(item.empId)}>
              <div className="w-[25%] ">
                <CgProfile className="text-5xl mx-auto text-green-500 " />
              </div>
              {console.log(item.unreadMsg[0]?.unreadCount)}
              <ul className="  w-[75%]">
                <li className="text-xl font-semibold">{item.name}</li>

                <div className="flex items-center ">
                  <span className="">
                    <GoDotFill className={item.status === "online" ? "text-green-500" : "text-red-500"} />
                  </span>
                  <p className="text-md text-gray-500 mr-2 ">{item.status}</p>
                  <p className="text-md text-gray-500">{item.status === "offline" && item.lastSeen ? `Last seen: ${item.lastSeen}` : ""}</p>
                </div>
              </ul>
              <p className="text-md text-black bg-green-500 rounded-full px-2">{item.unreadMsg[0]?.unreadCount > 0 && item.unreadMsg[0]?.unreadCount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
