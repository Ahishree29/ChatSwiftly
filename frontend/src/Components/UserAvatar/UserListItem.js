import React from "react";

function UserListItem({ handleFunction, user }) {
  return (
    <div
      onClick={handleFunction}
      className="flex flex-row  items-center justify-start bg-zinc-800 m-2 px-2 hover:bg-green-800 text-green-700 hover:text-white rounded-md"
    >
      <img src={user.pic} alt="avatar" className="h-10 rounded-full " />
      <div className=" p-2">
        <div className="text-lg">{user.name}</div>
        <div className="text-lg">{user.email}</div>
      </div>
    </div>
  );
}

export default UserListItem;
