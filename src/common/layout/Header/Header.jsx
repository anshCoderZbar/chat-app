// import React, { useEffect, useState } from "react";
// import { Logo, SearchIcon } from "../../assets/icons";
// import { Link, useNavigate } from "react-router-dom";
// import { doc, getFirestore, onSnapshot, updateDoc } from "@firebase/firestore";
// import DropdownSearchMenu from "../../../components/Search";
// import { PopOver } from "../../../components/Pop-Over";
// import { NofiticationIcon } from "../../assets/icons";
// import { FriendRequest } from "../../../components/Search/FriendRequest";

// export const Header = () => {
//   const db = getFirestore();
//   const [isOpen, setIsOpen] = useState(false);
//   const [totalRequest, setTotalRequest] = useState([]);
//   const [active, setActive] = useState(false);
//   const navigate = useNavigate();
//   const userData = JSON.parse(sessionStorage.getItem("userData"));
//   const activeUser = sessionStorage.getItem("activeUserName");
//   const handleLogout = () => {
//     sessionStorage?.removeItem("userData");
//     navigate("/sign-in");
//     const docRef = doc(db, "users", userData.uid);
//     const loginStatus = {
//       setLogin: false,
//     };
//     updateDoc(docRef, loginStatus)
//       .then((res) => {
//         console.log("status updated");
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       doc(db, "users", userData.uid),
//       (snapshot) => {
//         const newData = snapshot.data();
//         setTotalRequest(
//           newData?.friendsList?.filter(
//             (data) =>
//               data?.requestStatus === false &&
//               data.requestSenderId !== userData?.uid
//           )
//         );
//       }
//     );

//     return () => unsubscribe();
//   }, [db, userData.uid]);

//   return (
//     <nav className="bg-[#EAF4FC] shadow-md fixed w-full z-50 py-4 px-6  flex justify-between items-center">
//       <Link to="/" className="flex items-center">
//         <Logo />
//         <h1 className="text-[#424242] text-xl mx-4 font-bold">LetsTalk</h1>
//       </Link>
//       <div className="flex relative items-center gap-5">
//         {window?.location?.pathname === "/" ? (
//           <div
//             className={`${
//               active ? "block absolute top-14 w-auto" : "hidden"
//             } md:block`}
//           >
//             <DropdownSearchMenu />
//           </div>
//         ) : null}

//         {window?.location?.pathname === "/" ? (
//           <div onClick={() => setActive(!active)} className="block md:hidden">
//             <SearchIcon />
//           </div>
//         ) : null}
//         {window?.location?.pathname === "/" ? (
//           <div
//             className="cursor-pointer relative"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {totalRequest?.length >= 1 && (
//               <span className="bg-red-600 text-white rounded-full w-5 h-5 -right-2 -top-2 text-xs absolute grid place-items-center">
//                 {totalRequest?.length}
//               </span>
//             )}
//             <NofiticationIcon />
//           </div>
//         ) : null}
//         <button
//           onClick={handleLogout}
//           className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
//         >
//           Logout
//         </button>
//       </div>
//       <PopOver isOpen={isOpen} setIsOpen={setIsOpen}>
//         <FriendRequest id={userData?.uid} />
//       </PopOver>
//     </nav>
//   );
// };

import React, { useEffect, useState } from "react";
import { AddFriend, ChatIcon, Logo, Logout } from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { doc, getFirestore, onSnapshot, updateDoc } from "@firebase/firestore";
import DropdownSearchMenu from "../../../components/Search";
import { PopOver } from "../../../components/Pop-Over";
import { NofiticationIcon } from "../../assets/icons";
import { FriendRequest } from "../../../components/Search/FriendRequest";
import { AppContext } from "../../../store";

export const Header = () => {
  const db = getFirestore();
  const { toggle } = AppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [reqOpen, setReqOpen] = useState(false);
  const [totalRequest, setTotalRequest] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const handleLogout = () => {
    sessionStorage?.removeItem("userData");
    navigate("/sign-in");
    const docRef = doc(db, "users", userData.uid);
    const loginStatus = {
      setLogin: false,
    };
    updateDoc(docRef, loginStatus)
      .then((res) => {
        console.log("status updated");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", userData.uid),
      (snapshot) => {
        const newData = snapshot.data();
        setTotalRequest(
          newData?.friendsList?.filter(
            (data) =>
              data?.requestStatus === false &&
              data.requestSenderId !== userData?.uid
          )
        );
      }
    );

    return () => unsubscribe();
  }, [db, userData.uid]);

  return (
    <nav
      className={`bg-[#fff] border-r-[1px] border-[#e6e6e6]   ${
        toggle
          ? "translate-x-[0%] absolute z-[99999] w-[50%] transition-all"
          : "-translate-x-[110%] absolute  z-[999999] transition-all"
      }  md:translate-x-[0%] md:relative  w-[10%] lg:w-[5%] h-screen  py-4 px-6`}
    >
      <ul className="flex flex-col gap-7 justify-center items-center text-center">
        <li className="py-4 px-1 cursor-pointer ">
          <Link to="/" className="h-20 mb-6 ">
            <Logo />
          </Link>
        </li>
        <li
          className={`my-1 mx-1 ${
            toggle ? "px-5 py-4" : "p-0"
          } rounded-lg text-blue-500 cursor-pointer bg-gray-200 `}
        >
          <ChatIcon />
        </li>
        <li className="my-1  py-2 mx-1 cursor-pointer">
          <div onClick={() => setIsOpen(!isOpen)}>
            <AddFriend />
          </div>
        </li>
        <li className="my-1 relative mx-1 cursor-pointer text-black">
          <div onClick={() => setReqOpen(!reqOpen)}>
            {totalRequest?.length >= 1 && (
              <span className="bg-red-600 text-white rounded-full w-5 h-5 -right-2 -top-2 text-xs absolute grid place-items-center">
                {totalRequest?.length}
              </span>
            )}
            <NofiticationIcon />
          </div>
        </li>
      </ul>
      <div
        onClick={handleLogout}
        style={{ transform: "translate(-50%,-50%)" }}
        className="absolute bottom-5 left-[50%] text-xl text-red-600 cursor-pointer"
      >
        <Logout />
      </div>
      <PopOver isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownSearchMenu />
      </PopOver>
      <PopOver isOpen={reqOpen} setIsOpen={setReqOpen}>
        <FriendRequest id={userData?.uid} />
      </PopOver>
    </nav>
  );
};
