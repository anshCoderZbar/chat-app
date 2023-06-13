// import {
//   arrayUnion,
//   collection,
//   doc,
//   getFirestore,
//   onSnapshot,
//   updateDoc,
// } from "@firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { AddFriend } from "../../common/assets/icons";
// import { useNotifications } from "reapop";

// const DropdownSearchMenu = () => {
//   const db = getFirestore();
//   const { notify } = useNotifications();
//   const [selectedOption, setSelectedOption] = useState("");
//   const [users, setUsers] = useState([]);
//   const [thisUser, setThisUser] = useState();
//   const userData = JSON.parse(sessionStorage.getItem("userData"));

//   useEffect(() => {
//     const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
//       const newData = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//       }));
//       const filteredUser = newData.filter((data) => {
//         return data?.id !== userData?.uid;
//       });
//       const sender = newData.filter((data) => {
//         return data?.id === userData?.uid;
//       });
//       setThisUser(...sender);
//       setUsers(filteredUser);
//     });
//   }, []);

//   const searchedUser = users?.filter((user) => {
//     return (
//       user?.username?.toLowerCase().includes(selectedOption.toLowerCase()) ||
//       user?.email?.toLowerCase().includes(selectedOption.toLowerCase())
//     );
//   });

//   const sendFriendRequest = (id, name) => {
//     const friendSide = doc(db, "users", id);
//     const mySide = doc(db, "users", userData?.uid);
//     const friendRequest = {
//       requestSenderId: userData.uid,
//       requestReceiverId: id,
//       senderName: thisUser?.username,
//       receiverName: name,
//       requestStatus: false,
//     };
//     updateDoc(friendSide, {
//       friendsList: arrayUnion(friendRequest),
//     });
//     updateDoc(mySide, {
//       friendsList: arrayUnion(friendRequest),
//     })
//       .then((res) => {
//         notify("Friend Request Sent", "success");
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={selectedOption}
//         onChange={(e) => setSelectedOption(e?.target?.value)}
//         className="block w-full py-2 px-3 pr-8 leading-tight bg-gray-800 border border-gray-300 rounded-md shadow-sm text-white focus:outline-none focus:border-gray-500"
//         placeholder="Search Username"
//       />

//       {selectedOption && (
//         <ul className="absolute z-10 w-full py-2 mt-1 text-base bg-gray-700 border border-gray-300 rounded-md shadow-sm">
//           {searchedUser?.length >= 1 ? (
//             searchedUser?.map((user, i) => (
//               <li
//                 key={i}
//                 className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-600"
//               >
//                 <span className="text-white">{user.username}</span>
//                 <div
//                   onClick={() => sendFriendRequest(user?.id, user?.username)}
//                   className="flex-shrink-0 text-white py-1 px-3 rounded-md"
//                 >
//                   <AddFriend />
//                 </div>
//               </li>
//             ))
//           ) : (
//             <li className="flex items-center justify-center px-3 py-2">
//               <span className="text-white">No matching user found</span>
//             </li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default DropdownSearchMenu;

import {
  arrayUnion,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { AddFriend, ConfirmIcon, PendingIcon } from "../../common/assets/icons";
import { useNotifications } from "reapop";

const DropdownSearchMenu = () => {
  const db = getFirestore();
  const { notify } = useNotifications();
  const [selectedOption, setSelectedOption] = useState("");
  const [users, setUsers] = useState([]);
  const [thisUser, setThisUser] = useState();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      const filteredUser = newData.filter((data) => {
        return data?.id !== userData?.uid;
      });
      const sender = newData.filter((data) => {
        return data?.id === userData?.uid;
      });
      setThisUser(...sender);
      setUsers(filteredUser);
    });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  const searchedUser = users?.filter((user) => {
    return (
      user?.username?.toLowerCase().includes(selectedOption.toLowerCase()) ||
      user?.email?.toLowerCase().includes(selectedOption.toLowerCase())
    );
  });

  const sendFriendRequest = (id, name) => {
    const friendSide = doc(db, "users", id);
    const mySide = doc(db, "users", userData?.uid);
    const friendRequest = {
      requestSenderId: userData.uid,
      requestReceiverId: id,
      senderName: thisUser?.username,
      receiverName: name,
      requestStatus: false,
    };
    updateDoc(friendSide, {
      friendsList: arrayUnion(friendRequest),
    });
    updateDoc(mySide, {
      friendsList: arrayUnion(friendRequest),
    })
      .then((res) => {
        notify("Friend Request Sent", "success");
      })
      .catch((err) => console.log(err));
  };

  const getRequestStatus = (user) => {
    const friendRequest = user?.friendsList?.find(
      (request) =>
        request.requestSenderId === userData?.uid ||
        request.requestReceiverId === userData?.uid
    );

    if (friendRequest) {
      if (friendRequest.requestStatus) {
        return (
          <div onClick={() => notify("user alerady added", "info")}>
            <ConfirmIcon />
          </div>
        );
      } else {
        return (
          <div
            className="text-black"
            onClick={() => notify(`please wait until respond`, "info")}
          >
            <PendingIcon />
          </div>
        );
      }
    }

    return (
      <div onClick={() => sendFriendRequest(user?.id, user?.username)}>
        <AddFriend />
      </div>
    );
  };

  return (
    <div className="relative bg-white ">
      <input
        type="text"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e?.target?.value)}
        className="block  w-full py-2 px-3 pr-8 leading-tight bg-transparent border border-black rounded-md shadow-sm text-black focus:outline-none placeholder:text-black"
        placeholder="Search Username"
      />
      {selectedOption && (
        <ul className=" z-10 w-full max-h-72 overflow-y-auto py-2 mt-1 text-base border border-gray-300 rounded-md shadow-sm">
          {searchedUser?.length >= 1 ? (
            searchedUser?.map((user, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-3 py-2 cursor-pointer "
              >
                <span className="text-black capitalize">{user.username}</span>
                <div className="flex-shrink-0 text-white py-1 px-3 rounded-md">
                  {getRequestStatus(user)}
                </div>
              </li>
            ))
          ) : (
            <li className="flex items-center justify-center px-3 py-2">
              <span className="text-black">No matching user found</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSearchMenu;
