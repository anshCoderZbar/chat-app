import React, { useEffect, useState } from "react";
import { CloseIcon, ConfirmIcon } from "../../common/assets/icons";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";

export const FriendRequest = ({ id }) => {
  const db = getFirestore();
  const [pendingRequest, setPendingRequest] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", id), (snapshot) => {
      const newData = snapshot.data();
      setPendingRequest(newData?.friendsList);
    });

    return () => unsubscribe();
  }, [db, id]);

  const filteredResponse = pendingRequest?.filter((data) => {
    return (
      data?.requestReceiverId?.toLowerCase() === id?.toLowerCase() &&
      data?.requestStatus === false
    );
  });

  const confirmRequest = async (senderId, receiverId) => {
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);
      const newData = snapshot?.docs?.map((doc) => doc.data());

      newData.forEach(async (user) => {
        const updatedRequests = user.friendsList.map((elm) => {
          if (
            senderId.toLowerCase() === elm?.requestSenderId.toLowerCase() &&
            receiverId.toLowerCase() === elm?.requestReceiverId.toLowerCase()
          ) {
            return { ...elm, requestStatus: true };
          }
          return { ...elm };
        });

        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, { friendsList: updatedRequests });
      });

      console.log("Request confirmed successfully");
    } catch (error) {
      console.log("Error confirming request:", error);
    }
  };

  return (
    <>
      {filteredResponse?.length >= 1 ? (
        filteredResponse?.map((data) => {
          return (
            <div
              className="flex  items-center justify-between border-b-[1px] border-[#2e374c] p-7"
              key={data?.requestSenderId}
            >
              <p className="mr-2 text-white">
                <strong className="capitalize fw-normal">
                  {data?.senderName}{" "}
                </strong>
                sent a request
              </p>
              <div className="flex gap-2 cursor-pointer">
                <div
                  onClick={() =>
                    confirmRequest(
                      data?.requestSenderId,
                      data?.requestReceiverId
                    )
                  }
                >
                  <ConfirmIcon />
                </div>
                <CloseIcon />
              </div>
            </div>
          );
        })
      ) : (
        <li className="flex items-center justify-center px-3 py-2">
          <span className="text-white">No Request found</span>
        </li>
      )}
    </>
  );
};
