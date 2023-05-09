import React from "react";
import { InputMessage } from "../../common/chatIndex/Input";

export const Home = () => {
  const chatMessages = [
    {
      id: 1,
      sender: "John",
      message: "1st Hello! lorem loremasdofjlas hklsadfhoajsdl",
    },
    {
      id: 2,
      sender: "Jane",
      message: "Hi there!",
    },
    {
      id: 3,
      sender: "John",
      message: "How are you?",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen h-full  bg-gray-900 text-white mb-16">
      <div className="flex-grow p-4 relative top-16 bottom-16 mt-5 mb-14">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "John" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`p-2 rounded-lg ${
                message.sender === "John" ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              <p className="text-sm font-bold">{message.sender}</p>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <InputMessage />
    </div>
  );
};
