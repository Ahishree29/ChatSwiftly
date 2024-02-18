import React from "react";
import { HiX } from "react-icons/hi";

function UserBadgeItem({ user, handleFunction, groupAdmin }) {
  return (
    <div className=" text-sm bg-green-900 p-1  text-black rounded-md flex flex-row  justify-center items-center my-5 mx-1 w-auto">
      <span>{user.name}</span>
      <div className="px-2" onClick={() => handleFunction(user._id)}>
        <HiX />
      </div>
      {user._id === groupAdmin && (
        <div className="bg-purple-900 rounded-md p-1 text-purple-200">
          {" "}
          admin
        </div>
      )}
    </div>
  );
}

export default UserBadgeItem;
