import { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import fondoLogin from "../../img/Fondo-Login.jpg";

import ReactTooltip from "react-tooltip";

export const LogIn = () => {
  const { store, actions } = useContext(Context);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);

  let emailrgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let passwordregex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,16}$/;

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const datosLogin = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    let data = {
      email: login.email,
      password: login.password,
    };
    if (await actions.loginUser(data)) {
      history.push("/your-profile");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      <div className="login">
        <section
          className="login-container d-flex m-
        4"
        >
          <div className="card p-4">
            <p className="registro-titulo">Log In!</p>
            <div className="card-body">
              <form className="px-md-5">
                <div className="col-lg-12 mb-4">
                  <div className="Container-Input mt-5">
                    <input
                      name="email"
                      type="text"
                      required
                      value={login.email}
                      onChange={datosLogin}
                      onBlur={(e) => {
                        if (emailrgx.test(login.email)) {
                          setErrors({ ...errors, email: false });
                        } else {
                          setErrors({ ...errors, email: true });
                        }
                      }}
                    />
                    <label>Email</label>
                    {errors.email && (
                      <span
                        data-tip
                        data-for="Tooltip1"
                        className="FloatIcon btn float"
                      >
                        <i className="fa-solid fa-delete-left"></i>
                        <ReactTooltip
                          id="Tooltip1"
                          place="top"
                          textColor="white"
                          backgroundColor="black"
                        >
                          Invalid Email Address
                        </ReactTooltip>
                      </span>
                    )}
                  </div>

                  <div className="Container-Input mt-5">
                    <div className="input-btn">
                      <input
                        name="password"
                        required
                        type={showPassword ? "text" : "password"}
                        value={login.password}
                        onChange={datosLogin}
                        onBlur={(e) => {
                          if (passwordregex.test(login.password)) {
                            setErrors({ ...errors, password: false });
                          } else {
                            setErrors({ ...errors, password: true });
                          }
                        }}
                      />
                      <button
                        className={
                          showPassword
                            ? "fa fa-eye-slash password-icon btn btn-password btn-outline-dark"
                            : "fa fa-eye password-icon btn btn-outline-dark"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      ></button>
                      <label>Password</label>
                      {errors.password && (
                        <span
                          data-tip
                          data-for="Tooltip1"
                          className="FloatIcon btn float"
                        >
                          <i className="fa-solid fa-delete-left"></i>
                          <ReactTooltip
                            id="Tooltip1"
                            place="top"
                            textColor="white"
                            backgroundColor="black"
                          >
                            Your password must have at least: 8 characters, 1
                            upper-case letter, 1 number, and 1 special
                            character.
                          </ReactTooltip>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  className="mt-3 mb-1"
                  onClick={handleSubmit}
                  disabled={
                    errors.email ||
                    errors.password ||
                    !login.email.length > 0 ||
                    !login.password.length > 0
                  }
                  variant="contained"
                  size="large"
                >
                  Log In
                </Button>
                <div>
                  <Link to="/register">
                    <div className="redirect-link">
                      You don't have an account yet? Register here!
                    </div>
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="register-photo">
            <img src={fondoLogin} alt="Sample photo" className="img-fluid" />
          </div>
          {localStorage.getItem("token") != undefined && (
            <Redirect to="/find-gamers"></Redirect>
          )}
        </section>
      </div>
    </>
  );
};
