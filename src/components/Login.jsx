import React, { useContext, useState } from "react";
import { EmailIcon, EyeIcon } from "../assets/Svg";
import loginSvg from "../assets/login.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { UserContext } from "../context/userContext";

const Login = () => {
  const { url } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const submitHandler = async (e) => {
    console.log(url);
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/login`, user);
      
      if (response.data.message === "success") {
        localStorage.setItem("userEmail", response.data.result);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/chat");
      }else{
        alert("Login Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <section className="relative flex  lg:h-screen lg:items-center">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome to the Chat App!
            </h1>

            <p className="mt-4 text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero
              nulla eaque error neque ipsa culpa autem, at itaque nostrum!
            </p>
          </div>

          <form className="mx-auto mb-0 mt-8 max-w-md space-y-8">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  value={user.email}
                  onChange={handleInputChangeHandler}
                  type="email"
                  name="email"
                  className="w-full border-2  rounded-lg border-gray-400 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <EmailIcon />
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  value={user.password}
                  onChange={handleInputChangeHandler}
                  type="password"
                  name="password"
                  className="w-full  border-2 rounded-lg border-gray-400 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <EyeIcon />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                No account?
                <Link className="underline" to={"/"}>
                  Sign up
                </Link>
              </p>

              <button
                onClick={submitHandler}
                type="submit"
                className="inline-block rounded-lg bg-[#6c63ff] px-5 py-3 text-sm font-medium text-white"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>

        <div className="hidden lg:block  lg:h-1/2 lg:w-1/2">
          <img alt="login image" src={loginSvg} className="" />
        </div>
      </section>
    </div>
  );
};

export default Login;
