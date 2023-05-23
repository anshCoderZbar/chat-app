import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";

import { InputMessage } from "../../common/chatIndex/Input";
import { ArrowIcon, LoadingChatIcon } from "../../common/assets/icons";

export const Home = () => {
  const db = getFirestore();
  const [users, setUsers] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
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
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        const filteredChat = newData.filter(
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
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        const newUser = users.filter((data) => {
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

          const sortedChat = newChat.sort(sort);

          return sortedChat.length > 0
            ? sortedChat[sortedChat.length - 1]
            : null;
        });
        setLastChat(newId);
      }
    );
    return () => {
      unsubscribeLastChat();
    };
  }, [db, userData?.uid, users]);

  // new code

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", userData?.uid),
      (snapshot) => {
        const newData = snapshot.data();
        setSelectedUsers(
          newData?.friendsList?.filter(
            (data) =>
              (data.requestStatus === true &&
                data.requestSenderId !== userData?.uid) ||
              (data.requestStatus === true &&
                data.requestReceiverId !== userData?.uid)
          )
        );
      }
    );

    return () => unsubscribe();
  }, [db, id]);

  return (
    <div className="grid grid-cols-[1fr,1fr] relative  md:grid-cols-[400px,1fr] b_ss">
      <div className="bg-gray-800 min-h-screen row-span-full col-span-full md:col-span-1  h-full user-side">
        <div className="max-h-[1080px] w-full overflow-x-hidden">
          <div className="h-[91vh] relative mt-[5.25rem] text-white chat-gs overflow-x-hidden overflow-y-scroll cursor-pointer">
            {selectedUsers?.length >= 1 &&
              selectedUsers?.map((data, i) => {
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
                      setActive({ toggle: true, name: data?.senderName })
                    }
                    className={`flex flex-row py-4 justify-center border-b border-[#2e374c] items-center gap-5 vs-f ${
                      data?.requestSenderId === id ||
                      data?.requestReceiverId === id
                        ? "md:border md:border-white"
                        : ""
                    }`}
                  >
                    <div className="bg-gray-500 relative grid place-items-center rounded-full text-center font-semibold text-xl h-16 w-20 uppercase">
                      {activeUser !== data?.senderName
                        ? data?.senderName?.charAt(0)
                        : data?.receiverName?.charAt(0)}
                      {data?.setLogin ? (
                        <div className="absolute h-4 w-4 bottom-0 right-1 bg-green-500 rounded-full"></div>
                      ) : null}
                    </div>
                    <div className="w-full">
                      <div className="text-lg font-semibold capitalize">
                        {activeUser !== data?.senderName
                          ? data?.senderName
                          : data?.receiverName}
                      </div>
                      {lastChat?.length >= 1 &&
                        lastChat?.map((chat, i) => {
                          return (
                            <div className="text-gray-200" key={i}>
                              {chat?.receiverId === data.id ||
                              chat?.senderId === data?.id
                                ? chat?.message.length > 35
                                  ? chat?.message?.slice(0, 35) + "..."
                                  : chat?.message
                                : null}
                            </div>
                          );
                        })}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      {id && id ? (
        <div
          className={`flex flex-col bg-gray-900 ${
            active.toggle
              ? "translate-x-0 transition-ease-in duration-500 bg-gray-900"
              : "translate-x-full transition-ease-out duration-500 bg-gray-900"
          }  w-full  col-span-full md:col-span-1 row-span-full  md:translate-x-0 min-h-screen  h-full  text-white chat-side`}
        >
          <div className="flex-grow p-4 relative mt-[5.25rem] overflow-y-auto overflow-x-hidden">
            <div className="back block fixed  md:hidden ">
              <div className="main_top_bar">
                <div
                  className="prvs"
                  onClick={() =>
                    setActive({ toggle: false, name: active?.name })
                  }
                >
                  <ArrowIcon />
                </div>
                <div className="user_name capitalize">
                  <strong>{active && active?.name}</strong>
                </div>
              </div>
            </div>
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
                    className={`p-3 rounded-lg ${
                      message.senderId === userData?.uid
                        ? "bg-gray-700 !rounded-br-none"
                        : "bg-gray-700 !rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <InputMessage id={id} />
        </div>
      ) : (
        <div className="hidden md:flex flex-col min-h-screen bg-gray-900 chat-side text-white ">
          <div className="flex justify-center items-center h-screen mt-[5.25rem]">
            <h1 className="text-lg">
              Hello! Please select a user to start a chat with
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};
