import React, { useState } from "react";
import { HiEye, HiOutlineX } from "react-icons/hi";
import { Tooltip } from "react-tooltip";

function ProfileModal({ user, children }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {children ? (
        <button
          onClick={() => setShowModal(!showModal)}
          className="active:bg-zinc-600"
        >
          {children}
        </button>
      ) : (
        <>
          <button id="view-profile" onClick={() => setShowModal(!showModal)}>
            {" "}
            <HiEye className="text-green-500 text-2xl  mr-8 " />
          </button>
          <Tooltip anchorSelect="#view-profile" className="z-50">
            <span className="  text-green-700">click to view profile</span>
          </Tooltip>
        </>
      )}

      {showModal && (
        <>
          <div
            className=" fixed bg-zinc-700 opacity-70 shadow-2xl shadow-gray-600  top-0 left-0 w-screen h-screen z-40
          "
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 p-8 rounded-md shadow-xl shadow-zinc-400 flex justify-center flex-col items-center z-50 ">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 text-green-700 text-xl font-bold p-2"
            >
              <HiOutlineX />
            </button>
            <div className="text-white p-5 text-xl fo">
              {user.name.toUpperCase()}
            </div>
            <div>
              <img
                src={user.pic}
                alt="profile pic"
                className="rounded-full h-40"
              />
            </div>
            <div className="text-white p-5 text-xl ">Email: {user.email}</div>
          </div>
        </>
      )}
    </>
  );
}

export default ProfileModal;
