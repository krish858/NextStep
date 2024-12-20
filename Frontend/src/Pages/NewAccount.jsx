/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useContext } from "react";
import { DarkModeContext } from "../Contexts/DarkModeContext";
// import { UserContext } from "../Contexts/UserContext";
import { Input } from "@nextui-org/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Divider } from "@nextui-org/divider";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const NewAccount = () => {
  const [name, setName] = useState("");
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginbtnState, setLoginbtnState] = useState(1);
  const serverUrl = "http://localhost:3000";

  //   const dmc = useContext(DarkModeContext);
  //   var isDarkMode = dmc.DarkMode;
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // -1 will navigate to the previous page in the history stack
  };

  const gotoLoginPage = () => {
    navigate("/login");
  };

  //   const userContext = useContext(UserContext);

  async function handleSignup() {
    toast.dismiss();
    setLoginbtnState(0);

    const res = await axios.post(`${serverUrl}/api/v1/auth/signup`, {
      name: name,
      email: email,
      password: password,
    });
    setLoginbtnState(1);
    const data = await res.data;
    if (data.msg == "Invalid Inputs") {
      toast.error("invalid inputs");
    }
    if (data.msg == "user already exists") {
      if (data.msg == "user already exists") toast.error("user already exists");
    }
    if (data.msg == "user created") {
      toast.success("user created");
      localStorage.setItem("token", data.jwt);
      navigate("/onboarding");
    }
    if (data.msg == "error") {
      toast.error("some error occured");
      console.log(data.error);
    }
  }

  return (
    <div className="main flex items-center justify-center w-full h-full flex-col">
      <div className="top_nav flex items-center justify-center w-full  h-[64px] z-10 fixed top-0">
        <div className="left h-full  flex items-center justify-center">
          <Button
            isIconOnly
            color="primary"
            variant="light"
            aria-label="Take a photo"
            className="flex items-center justify-center fixed z-10 top-3 left-3"
            onClick={handleGoBack}
          >
            <IoIosArrowBack size={25} />
          </Button>
        </div>
        <div className="right h-full w-[100%] flex items-center justify-center font-bold text-lg">
          NextStep
        </div>
      </div>

      <div className="form_container flex items-center justify-center flex-col gap-2 max-w-[400px] w-[80%] h-full">
        <h1 className="text-2xl font-bold p-5">Create New Account</h1>
        <Input
          className="w-full"
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          className="w-full"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          color="primary"
          className="w-full p-6"
          onClick={handleSignup}
          isDisabled={loginbtnState ? false : true}
          // isDisabled
        >
          Signup
        </Button>

        <Divider className="my-4" />

        <Button
          color="primary"
          variant="flat"
          className="w-full p-6"
          onClick={gotoLoginPage}
        >
          Already have an account? Login
        </Button>
      </div>
    </div>
  );
};

export default NewAccount;
