import React, { useContext, useState } from "react";
import { EmailIcon, EyeIcon, Logo } from "../assets/Svg";
import signupsvg from "../assets/signup.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Signup = () => {
  const { url } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/signup`, user);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section className="">
        <div className=" lg:grid  lg:min-h-screen lg:grid-cols-12">
          <aside className="relative  hidden lg:block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src={signupsvg}
              className="absolute inset-0 h-full w-full  object-cover"
            />
          </aside>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <a className="block text-blue-600" href="#">
                <span className="sr-only">Home</span>
                <Logo />
              </a>
              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to Chat App
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Eligendi nam dolorum aliquam, quibusdam aperiam voluptatum.
              </p>

              <form className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-6  ">
                  <label
                    htmlFor="FirstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>

                  <input
                    value={user.name}
                    onChange={handleInputChangeHandler}
                    type="text"
                    id="FirstName"
                    name="name"
                    className="mt-1 w-full h-8  border-2 border-black focus:outline-none focus:bg-slate-200   rounded-md  bg-white text-gray-700 shadow-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <input
                      value={user.email}
                      onChange={handleInputChangeHandler}
                      type="email"
                      id="Email"
                      name="email"
                      className="mt-1 w-full h-8 border-2 border-black   focus:outline-none focus:bg-slate-200  rounded-md  bg-white  text-gray-700 shadow-sm"
                    />

                    <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                      <EmailIcon />
                    </span>
                  </div>
                </div>

                <div className="col-span-6 ">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password{" "}
                  </label>
                  <div className="relative">
                    <input
                      value={user.password}
                      onChange={handleInputChangeHandler}
                      type="password"
                      id="Password"
                      name="password"
                      className="mt-1 w-full border-2 border-black h-8 focus:outline-none focus:bg-slate-200   rounded-md  bg-white text-sm text-gray-700 shadow-sm"
                    />
                    <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                      <EyeIcon />
                    </span>
                  </div>
                </div>

                <div className="col-span-6">
                  <label htmlFor="MarketingAccept" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="MarketingAccept"
                      name="marketing_accept"
                      className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                    />

                    <span className="text-sm text-gray-700">
                      I want to receive emails about events, product updates and
                      company announcements.
                    </span>
                  </label>
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our
                    <a href="#" className="text-gray-700 underline">
                      terms and conditions
                    </a>
                    and
                    <a href="#" className="text-gray-700 underline">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    onClick={submitHandler}
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  >
                    Create an account
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <Link to={"/login"} className="text-gray-700 underline">
                      Log in
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Signup;
