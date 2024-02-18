import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import PulseLoader from "react-spinners/PulseLoader";
function Signin() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfiremedPassword, setShowConfiremedPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmite = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.error("you have missed the field");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("password doesnot match");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      pic,
    };

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await axios.post("/api/user", newUser, config);
      toast.success("Sign-in successful");

      if (response) {
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setLoading(false);
        setName("");
        setEmail("");
        setConfirmPassword("");
        setPassword("");
        setPic("");
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast.error("please uploade a pic");
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatswiftly");
      data.append("cloud_name", "ahishree");
      axios
        .post("https://api.cloudinary.com/v1_1/ahishree/image/upload", data)
        .then((response) => {
          setPic(response.data.url.toString());
          setLoading(false);
          toast.success("Image uploaded successfully!");

          const fileInput = document.getElementById("fileInput");
          if (fileInput) {
            fileInput.value = "";
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast.error("error while uploading the image");
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col py-10 ">
      <label className=" text-xl py-3">User Name</label>
      <input
        className="p-3 rounded-lg bg-black text-green-600 font-bold"
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label className=" text-xl py-3">Email</label>
      <input
        className="p-3 rounded-lg bg-black text-green-600 font-bold"
        type="email"
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className=" text-xl py-3">Password</label>
      <div className="flex flex-row">
        <input
          className="p-3 rounded-lg bg-black text-green-600 font-bold pr-10"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="bg-black text-white px-5 rounded-lg ml-1"
          onClick={() => setShowPassword((show) => !show)}
        >
          {showPassword ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
        </button>
      </div>
      <label className=" text-xl py-3">Confirm Password</label>
      <div className=" flex flex-row">
        <input
          className="p-3 rounded-lg bg-black text-green-600 font-bold pr-10"
          type={showConfiremedPassword ? "text" : "password"}
          placeholder="Confirm Your Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="bg-black text-white px-5 rounded-lg ml-1"
          onClick={() => setShowConfiremedPassword((show) => !show)}
        >
          {showConfiremedPassword ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
        </button>
      </div>
      <label className=" text-xl py-3">Upload Picture</label>
      <input
        type="file"
        accept="image/"
        className="p-3 rounded-lg bg-black text-green-600 font-bold"
        placeholder="Upload Picture"
        onChange={(e) => postDetails(e.target.files[0])}
        required
      />
      <div className="flex justify-center">
        <button
          className=" text-green-600 font-bold rounded-xl  bg-black mt-10 py-2 px-20 "
          onClick={handleSubmite}
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
            "Sign In"
          )}
        </button>
      </div>
    </form>
  );
}

export default Signin;
