import React, { useState } from "react";
import { addDoc, collection, getFirestore } from "@firebase/firestore";

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
    <footer className="p-4 bg-gray-900 sticky  w-full bottom-0  z-50">
      <form onSubmit={handleSubmit} className="flex" noValidate>
        <input
          type="text"
          placeholder="Type your message..."
          name="message"
          value={message}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none"
          onChange={(e) => setMessage(e?.target?.value)}
          required
        />
        <button
          disabled={isButtonDisabled}
          className={`px-4 py-2 ml-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none ${
            isButtonDisabled ? "bg-indigo-400 hover:bg-indigo-400 " : ""
          }`}
        >
          Send
        </button>
      </form>
    </footer>
  );
};
