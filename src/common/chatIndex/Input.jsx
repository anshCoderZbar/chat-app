import React, { useState } from "react";
import { addDoc, collection, getFirestore } from "@firebase/firestore";
import { SendIcon } from "../assets/icons";

export const InputMessage = ({ id }) => {
  const db = getFirestore();

  const [message, setMessage] = useState("");

  const data = JSON.parse(sessionStorage.getItem("userData"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.length >= 1) {
      setMessage("");
      const writeUserMessage = (senderId, message, receiverId) => {
        const messageCollection = collection(db, "chat");
        const messageDoc = {
          senderId: senderId,
          message: message,
          receiverId: receiverId,
          time: new Date(),
        };
        try {
          const docRef = addDoc(messageCollection, messageDoc);
          console.log("Document written with ID: ", docRef.id);
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      };
      writeUserMessage(data?.uid, message, id);
    } else return;
  };
  const isButtonDisabled = message.length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex" noValidate>
      <input
        type="text"
        placeholder="Write a message..."
        name="message"
        value={message}
        className="w-full px-4 py-2 rounded-lg bg-transparent text-black border-[1px] border-[#e6e6e6] focus:outline-none text-sm"
        onChange={(e) => setMessage(e?.target?.value)}
        required
      />
      <button
        disabled={isButtonDisabled}
        className={`px-4 py-2 ml-2 text-white bg-blue-500 rounded-md cursor-pointer transition-all duration-300 hover:bg-blue-600 focus:outline-none ${
          isButtonDisabled
            ? "bg-blue-400 transition-all  duration-300 hover:bg-blue-400 "
            : ""
        }`}
      >
        <SendIcon />
      </button>
    </form>
  );
};
