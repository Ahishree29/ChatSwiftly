import React, { useEffect, useState } from "react";
import Login from "../Components/Authentication/Login";
import Signin from "../Components/Authentication/Signin";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeButton, setactiveButton] = useState("login");
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <div
      className="bg-black h-screen flex flex-col justify-center items-center overflow-scroll p-10"
      style={{
        backgroundImage: `url("./bg-black.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src="app-logo.png"
        alt="app-logo"
        className="w-80 px-10 pt-40  pb-10"
      />
      <div className=" bg-green-700 flex flex-col justify-center py-10 px-20 opacity-90 rounded-lg shadow-inner shadow-green-100 w-auto">
        <div className=" flex justify-center items-center ">
          <img
            src="unknown-person.png"
            alt="unkown"
            className="w-40 flex justify-center items-center "
          />
        </div>
        <div className="flex justify-between pt-10">
          <button
            className={` text-black font-bold rounded-3xl w-40 p-3 ${
              activeButton === "login" ? "bg-black text-green-600" : ""
            } `}
            onClick={() => setactiveButton("login")}
          >
            Login
          </button>
          <button
            className={` text-black font-bold rounded-3xl w-40${
              activeButton === "signin" ? " bg-black text-green-600" : ""
            } `}
            onClick={() => setactiveButton("signin")}
          >
            Signin
          </button>
        </div>
        <div>{activeButton === "login" ? <Login /> : <Signin />}</div>
      </div>
    </div>
  );
};

export default HomePage;
