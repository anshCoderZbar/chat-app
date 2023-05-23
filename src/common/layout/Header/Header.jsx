import React, { useEffect, useState } from "react";
import { Logo, SearchIcon } from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { doc, getFirestore, onSnapshot, updateDoc } from "@firebase/firestore";
import DropdownSearchMenu from "../../../components/Search";
import { PopOver } from "../../../components/Pop-Over";
import { NofiticationIcon } from "../../assets/icons";
import { FriendRequest } from "../../../components/Search/FriendRequest";

export const Header = () => {
  const db = getFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [totalRequest, setTotalRequest] = useState([]);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const activeUser = sessionStorage.getItem("activeUserName");
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
    <nav className="bg-gray-800 fixed w-full z-50 py-4 px-6  flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <Logo />
        <h1 className="text-white text-xl font-bold">LetsTalk</h1>
      </Link>
      <div className="flex relative items-center gap-5">
        <div
          className={`${
            active ? "block absolute top-14 w-auto" : "hidden"
          } md:block`}
        >
          <DropdownSearchMenu />
        </div>
        <div onClick={() => setActive(!active)} className="block md:hidden">
          <SearchIcon />
        </div>
        <div
          className="cursor-pointer relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {totalRequest?.length >= 1 && (
            <span className="bg-red-600 text-white rounded-full w-5 h-5 -right-2 -top-2 text-xs absolute grid place-items-center">
              {totalRequest?.length}
            </span>
          )}
          <NofiticationIcon />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <PopOver isOpen={isOpen} setIsOpen={setIsOpen}>
        <FriendRequest id={userData?.uid} />
      </PopOver>
    </nav>
  );
};
