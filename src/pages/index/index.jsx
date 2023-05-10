import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";

import { InputMessage } from "../../common/chatIndex/Input";

export const Home = () => {
  const db = getFirestore();
  const [users, setUsers] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const { id } = useParams();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUsers(newData);
    });

    if (id) {
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

  const filteredUser = users?.filter((data) => {
    return data?.id !== userData?.uid;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[400px,1fr] b_ss">
      <div className="bg-gray-800 min-h-screen h-full user-side">
        <div className="max-h-[1080px] w-full overflow-x-hidden">
          <div className="h-full relative mt-[5.25rem] text-white chat-gs cursor-pointer">
            {filteredUser?.length >= 1 &&
              filteredUser?.map((data, i) => {
                return (
                  <Link
                    key={i}
                    id={data?.id}
                    to={`/${data?.id}`}
                    className="flex flex-row py-4  justify-center items-center gap-5 vs-f"
                  >
                    <div className="bg-gray-500 grid place-items-center rounded-full text-center h-16 w-20 uppercase">
                      {data?.username?.charAt(0)}
                    </div>
                    <div className="w-full">
                      <div className="text-lg font-semibold capitalize">
                        {data?.username}
                      </div>
                      <span className="text-gray-500">Pata hai</span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      {id && id ? (
        <div className="flex flex-col min-h-screen h-full bg-gray-900 text-white chat-side">
          <div className="flex-grow p-4 relative mt-[5.25rem] overflow-y-auto chat-gss">
            {newChat.length >= 1 &&
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
                    className={`p-2 rounded-lg ${
                      message.senderId === userData?.uid
                        ? "bg-gray-800"
                        : "bg-gray-700"
                    }`}
                  >
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
          </div>

          <InputMessage id={id} />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen h-full bg-gray-900 text-white chat-side">
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
