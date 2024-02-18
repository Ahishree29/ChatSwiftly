import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email && !password) {
      toast.error("filed is missing");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        "api/user/login",
        { email, password },
        config
      );
      if (response) {
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        toast.success("login sucessfull");

        setLoading(false);
        navigate("/chats");
        setEmail("");

        setPassword("");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message || error.message);
    }
  };
  const handelGuestuser = (e) => {
    e.preventDefault();
    setEmail("guest@example.com");
    setPassword("123456");
  };
  return (
    <form className="flex flex-col py-10 ">
      <label className=" text-xl py-3">Email</label>
      <input
        className="p-3 rounded-lg bg-black text-green-600 font-bold"
        type="email"
        placeholder="Enter Your Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className=" text-xl py-3">Password</label>
      <div className="flex flex-row">
        <input
          className="p-3 rounded-lg bg-black text-green-600 font-bold pr-10"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="bg-black text-white px-5 rounded-lg ml-1"
          onClick={() => setShowPassword((show) => !show)}
        >
          {showPassword ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
        </button>
      </div>
      <div className="flex justify-center flex-col">
        <button
          className=" text-green-600 font-bold rounded-xl  bg-black mt-10 py-2 px-20"
          onClick={handleLogin}
        >
          {loading ? (
            <PulseLoader
              color={"#22b642"}
              loading={loading}
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "LogIn"
          )}
        </button>
        <button
          className=" text-white font-bold rounded-xl   mt-3 py-2 px-20 bg bg-green-400"
          onClick={handelGuestuser}
        >
          Guest User
        </button>
      </div>
    </form>
  );
}
export default Login;
