import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";

import { InputMessage } from "../../common/chatIndex/Input";
import { ArrowIcon, LoadingChatIcon } from "../../common/assets/icons";
import { AppContext } from "../../store";
import bgImg from "../../common/assets/images/background.jpg";

export const Home = () => {
  const db = getFirestore();
  const chatContainerRef = useRef(null);
  const { setToggle, toggle } = AppContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [active, setActive] = useState({ toggle: false, name: "" });
  const [loading, setLoading] = useState(false);
  const [lastChat, setLastChat] = useState([]);
  const { id } = useParams();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const activeUser = sessionStorage.getItem("activeUserName");

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const newData = snapshot?.docs?.map((doc) => ({
        ...doc.data(),
      }));
      const filteredUser = newData.filter((data) => {
        return data?.id !== userData?.uid;
      });
      const accHolder = newData.filter((data) => {
        if (data.id === userData?.uid) {
          sessionStorage.setItem("activeUserName", data.username);
        }
      });
      setUsers(filteredUser);
    });

    if (id) {
      setLoading(true);
      const unsubscribeChat = onSnapshot(collection(db, "chat"), (snapshot) => {
        const newData = snapshot?.docs?.map((doc) => ({
          ...doc.data(),
        }));
        const filteredChat = newData?.filter(
          (data) =>
            (data.receiverId.toLowerCase() === id.toLowerCase() &&
              data.senderId.toLowerCase() === userData?.uid.toLowerCase()) ||
            (data.receiverId.toLowerCase() === userData?.uid.toLowerCase() &&
              data.senderId.toLowerCase() === id.toLowerCase())
        );
        setUserChat(filteredChat);
        setLoading(false);
      });

      return () => {
        unsubscribeChat();
      };
    }

    return () => {
      unsubscribeUsers();
    };
  }, [db, id, userData?.uid]);

  const sort = (a, b) => {
    return a?.time?.seconds - b?.time?.seconds;
  };
  const newChat = userChat.sort(sort);

  useEffect(() => {
    const unsubscribeLastChat = onSnapshot(
      collection(db, "chat"),
      (snapshot) => {
        const newData = snapshot?.docs?.map((doc) => ({
          ...doc.data(),
        }));

        const newUser = users?.filter((data) => {
          return data.id !== userData?.uid;
        });

        const newId = newUser?.map((element) => {
          const newChat = newData?.filter((data) => {
            return (
              (data.receiverId === element.id &&
                data.senderId === userData.uid) ||
              (data.senderId === element.id && data.receiverId === userData.uid)
            );
          });

          const sortedChat = newChat?.sort(sort);

          return sortedChat?.length > 0
            ? sortedChat[sortedChat?.length - 1]
            : null;
        });
        setLastChat(newId);
      }
    );
    return () => {
      unsubscribeLastChat();
    };
  }, [db, userData?.uid, users]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", userData?.uid),
      (snapshot) => {
        const newData = snapshot?.data();
        setSelectedUsers(
          newData?.friendsList?.filter(
            (data) =>
              (data?.requestStatus === true &&
                data?.requestSenderId !== userData?.uid) ||
              (data?.requestStatus === true &&
                data?.requestReceiverId !== userData?.uid)
          )
        );
      }
    );

    return () => unsubscribe();
  }, [db, id]);

  const filteredSearchedUser = selectedUsers?.filter((data) => {
    return (
      (data.receiverName !== activeUser &&
        data.receiverName
          .toLowerCase()
          .includes(searchUser.toLocaleLowerCase())) ||
      (data.senderName !== activeUser &&
        data.senderName.toLowerCase().includes(searchUser.toLocaleLowerCase()))
    );
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [newChat]);

  return (
    <div className="grid z-40 grid-cols-[1fr,1fr] w-[100%] relative md:grid-cols-[350px,1fr] b_ss overflow-y-hidden">
      <div className="bg-white overflow-y-hidden  row-span-full border-r-[1px] border-[#e6e6e6]  md:shadow-lg col-span-full md:col-span-1 h-screen max-h-screen user-side">
        <div className="px-8 h-20 flex justify-between items-center ">
          <Link to="/" className="font-bold text-xl">
            Chats
          </Link>
          <div
            onClick={() => setToggle(!toggle)}
            className="border-2 p-1 rounded-md border-black cursor-pointer md:hidden md:pointer-events-none"
          >
            <div className="h-[2px] w-7 my-1 rounded-lg bg-black"></div>
            <div className="h-[2px] w-7 my-1 rounded-lg bg-black"></div>
            <div className="h-[2px] w-7 my-1 rounded-lg bg-black"></div>
          </div>
        </div>
        <div className="m-auto w-full px-8 py-4 mb-3">
          <input
            type="text"
            placeholder="Search chats"
            name="searchUser"
            onChange={(e) => setSearchUser(e.target.value)}
            value={searchUser}
            className="w-full
            py-2 px-4 rounded-lg bg-transparent text-black border-[1px] border-[#e6e6e6] focus:outline-none text-sm"
          />
        </div>
        <div className="max-h-[1080px] w-full overflow-x-hidden">
          <div className="h-[91vh] relative  text-black chat-gs overflow-x-hidden overflow-y-scroll cursor-pointer">
            {filteredSearchedUser?.length >= 1 ? (
              filteredSearchedUser?.map((data, i) => {
                return (
                  <Link
                    key={i}
                    id={
                      data?.requestSenderId !== userData?.uid
                        ? data?.requestSenderId
                        : data?.requestReceiverId
                    }
                    to={`/${
                      data?.requestSenderId !== userData?.uid
                        ? data?.requestSenderId
                        : data?.requestReceiverId
                    }`}
                    onClick={() =>
                      setActive({
                        toggle: true,
                        name:
                          data?.senderName !== activeUser
                            ? data?.senderName
                            : data?.receiverName,
                      })
                    }
                    className={`flex flex-row py-4 justify-center  border-b   items-center gap-5 vs-f ${
                      data?.requestSenderId === id ||
                      data?.requestReceiverId === id
                        ? "md:bg-gray-200 md:text-gray-900 md:border-white"
                        : ""
                    }`}
                  >
                    <div className="border-[1px] border-[#e6e6e6] bg-blue-50  relative grid place-items-center rounded-full text-center font-semibold text-xl h-12 w-16 uppercase">
                      {activeUser !== data?.senderName
                        ? data?.senderName?.charAt(0)
                        : data?.receiverName?.charAt(0)}
                      {data?.setLogin ? (
                        <div className="absolute h-4 w-4 bottom-0 right-1 bg-green-500 rounded-full"></div>
                      ) : null}
                    </div>
                    <div className="w-full">
                      <h5 className="text-base font-semibold capitalize">
                        {activeUser !== data?.senderName
                          ? data?.senderName
                          : data?.receiverName}
                      </h5>

                      {lastChat?.length >= 1 &&
                        lastChat?.map((chat, i) => {
                          const isMessageVisible =
                            (chat?.receiverId === data.requestReceiverId ||
                              chat?.receiverId === data.requestSenderId) &&
                            (chat?.senderId === data.requestReceiverId ||
                              chat?.senderId === data.requestSenderId);

                          return (
                            <div className="text-[#969696]" key={i}>
                              {isMessageVisible && (
                                <p>
                                  {chat?.message?.length > 35
                                    ? chat?.message?.slice(0, 25) + "..."
                                    : chat?.message}
                                </p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </Link>
                );
              })
            ) : (
              <h1 className="h-[91vh] grid place-items-center">
                Please add user from search
              </h1>
            )}
          </div>
        </div>
      </div>
      {id && id ? (
        <div
          className={`${
            active.toggle
              ? "translate-x-0 transition-ease-in duration-500 bg-white"
              : "translate-x-full transition-ease-out duration-500 bg-white"
          }  w-full  col-span-full md:col-span-1 row-span-full  md:translate-x-0 h-screen min-h-screen  text-black `}
        >
          <div className="px-1 md:px-8 fixed w-full bg-white h-20 max-h-20 flex items-center border-b-[1px] border-[#e6e6e6]">
            <div
              onClick={() => {
                setActive({ toggle: false, name: active?.name });
                setTimeout(() => {
                  navigate("/");
                }, 500);
              }}
              className="flex items-center gap-3 "
            >
              <div className="block md:hidden">
                <ArrowIcon />
              </div>
            </div>
            <div className="border-[1px] border-[#e6e6e6]  bg-blue-50   relative grid place-items-center rounded-full text-center font-semibold text-xl h-12 w-12 uppercase mr-4">
              {active && active?.name?.charAt(0)}
            </div>
            <h1 className="font-bold capitalize text-base">
              {active && active?.name}
            </h1>
          </div>
          <div
            ref={chatContainerRef}
            className="mt-20 p-3 overflow-y-auto overflow-x-hidden h-[78%] md:h-4/5"
            style={{
              backgroundImage: `url(${bgImg})`,
              backgroundPosition: "center",
              width: "100%",
            }}
          >
            {loading ? (
              <div className="grid place-items-center h-[80vh]">
                <LoadingChatIcon />
              </div>
            ) : (
              newChat.length >= 1 &&
              newChat?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === userData?.uid
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`p-3 rounded-xl  ${
                      message.senderId === userData?.uid
                        ? "border-none !rounded-br-none bg-blue-100 text-black"
                        : "border-none !rounded-bl-none bg-slate-200 text-black"
                    }`}
                  >
                    <p className="text-sm md:text-base font-normal ">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 fixed w-full bottom-0 bg-white border-t-[1px] pb-12  border-[#e6e6e6]">
            <InputMessage id={id} />
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col min-h-screen white chat-side text-black ">
          <div className="flex justify-center items-center h-screen mt-[5.25rem]">
            <h1 className="text-lg">Select a user to start a chat </h1>
          </div>
        </div>
      )}
    </div>
  );
};
