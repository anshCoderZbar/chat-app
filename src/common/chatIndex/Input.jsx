import React from "react";

export const InputMessage = () => {
  return (
    <footer className="p-4 bg-gray-800 fixed bottom-0 w-full z-50">
      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none"
        />
        <button className="px-4 py-2 ml-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none">
          Send
        </button>
      </div>
    </footer>
  );
};
