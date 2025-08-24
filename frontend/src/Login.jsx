import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./auth.css";
import { MyContext } from "./MyContext";

const Login = () => {
  const { setUser } = useContext(MyContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://chatgpt-se61.onrender.com/api/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message, user } = data;
      if (success) {
        handleSuccess(message);
        setUser(user);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="container">
      <span className="top-text">
        <img
          src="/blacklogo.png"
          alt="GPT logo"
          className="logo"
          style={{ marginRight: "0.5rem" }}
        ></img>
        ChatGPT
      </span>
      <div className="flex">
        <div className="form_container">
          <h2>Login Account</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
              />
            </div>
            <button type="submit">Submit</button>
            <span className="fix-color">
              Don't have an account? <Link to={"/signup"}>Sign up</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
