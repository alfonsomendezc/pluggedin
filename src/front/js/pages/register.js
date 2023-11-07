import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/register.css";
import ReactTooltip from "react-tooltip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import fondoRegistro from "../../img/Fondo-Registro.jpg";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";

export const Register = () => {
  const { actions } = useContext(Context);
  const [register, setRegister] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    birthdate: "",
  });

  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // condiciones para el submit
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    birthdate: false,
  });

  let usernamergx = /^[a-zA-Z0-9._-]{5,20}$/;
  let emailrgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let passwordregex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,16}$/;

  const datosRegistro = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const CustomAlertsUser = () => {
    toast.dark("Complete your profile to access all the features! 😄");
  };

  const handleSubmit = async () => {
    let data = {
      username: register.username,
      email: register.email,
      password: register.password,
      birthdate: register.birthdate,
    };
    if (await actions.registerUser(data)) {
      history.push("/your-profile");
      CustomAlertsUser();
    } else {
      alert("The username or email already exists, try again");
    }
  };

  return (
    <>
      <div className="register-body">
        <section className="register-container d-flex">
          <div className="card p-4">
            <p className="registro-titulo">Registration Information</p>
            <div className="card-body"></div>
            <form className="px-md-5">
              <div className="col-lg-12 mb-4 ">
                <div className="Container-Input">
                  <input
                    type="text"
                    required
                    name="username"
                    value={register.username}
                    onChange={datosRegistro}
                    onBlur={(e) => {
                      if (usernamergx.test(register.username)) {
                        setErrors({ ...errors, username: false });
                      } else {
                        setErrors({ ...errors, username: true });
                      }
                    }}
                  />
                  <label>Username</label>
                  {errors.username && (
                    <span
                      data-tip
                      data-for="Tooltip1"
                      className="FloatIcon btn"
                    >
                      <i className="fa-solid fa-delete-left"></i>
                      <ReactTooltip
                        id="Tooltip1"
                        place="top"
                        textColor="white"
                        backgroundColor="black"
                      >
                        Invalid: 5-20 characters (letters, numbers and . _ -)
                      </ReactTooltip>{" "}
                    </span>
                  )}
                </div>

                <div className="Container-Input mt-5">
                  <input
                    name="email"
                    type="text"
                    required
                    value={register.email}
                    onChange={datosRegistro}
                    onBlur={(e) => {
                      if (emailrgx.test(register.email)) {
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
                      data-for="Tooltip2"
                      className="FloatIcon btn"
                    >
                      <i className="fa-solid fa-delete-left"></i>
                      <ReactTooltip
                        id="Tooltip2"
                        place="top"
                        textColor="white"
                        backgroundColor="black"
                      >
                        Invalid email address
                      </ReactTooltip>{" "}
                    </span>
                  )}
                </div>

                <div className="Container-Input mt-5">
                  <div className="input-btn">
                    <input
                      name="password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={register.password}
                      onChange={datosRegistro}
                      onBlur={(e) => {
                        if (passwordregex.test(register.password)) {
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
                        data-for="Tooltip3"
                        className="FloatIcon btn"
                      >
                        <i className="fa-solid fa-delete-left"></i>
                        <ReactTooltip
                          id="Tooltip3"
                          place="top"
                          textColor="white"
                          backgroundColor="black"
                        >
                          Your password must have at least: 8 characters, 1
                          lower-case letter, 1 upper-case letter, 1 number and 1
                          special character.
                        </ReactTooltip>{" "}
                      </span>
                    )}
                  </div>
                </div>

                <div className="Container-Input mt-5">
                  <div className="input-btn">
                    <input
                      name="confirmPassword"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={register.confirmPassword}
                      onChange={datosRegistro}
                      onBlur={(e) => {
                        if (register.confirmPassword !== register.password) {
                          setErrors({ ...errors, confirmPassword: true });
                        } else {
                          setErrors({ ...errors, confirmPassword: false });
                        }
                      }}
                    />

                    <button
                      className={
                        showConfirmPassword
                          ? "fa fa-eye-slash password-icon btn btn-password btn-outline-dark"
                          : "fa fa-eye password-icon btn btn-outline-dark"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    ></button>
                    <label>Confirm password</label>

                    {errors.confirmPassword && (
                      <span
                        data-tip
                        data-for="Tooltip4"
                        className="FloatIcon btn"
                      >
                        <i className="fa-solid fa-delete-left"></i>
                        <ReactTooltip
                          id="Tooltip4"
                          place="top"
                          textColor="white"
                          backgroundColor="black"
                        >
                          The passwords do not match, try again
                        </ReactTooltip>{" "}
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-9 mb-2">
                  <div className="Container-Input mt-5">
                    <span>Birthdate </span>
                    <input
                      name="birthdate"
                      type="date"
                      value={register.birthdate}
                      onChange={datosRegistro}
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className="btn btn-primary btn-md mt-3 mb-1"
                onClick={handleSubmit}
                disabled={
                  errors.email ||
                  errors.password ||
                  errors.confirmPassword ||
                  !register.username.length > 0 ||
                  !register.email.length > 0 ||
                  !register.password.length > 0 ||
                  !register.confirmPassword.length > 0
                }
                variant="contained"
                size="large"
              >
                Register
              </Button>
              <Link to="/log-in">
                <div className="redirect-link">
                  You already have an account? Log in here
                </div>
              </Link>
            </form>
          </div>
          <div className="register-photo">
            <img src={fondoRegistro} alt="Sample photo" className="img-fluid" />
          </div>
          {localStorage.getItem("token") != undefined && (
            <Redirect to={"/find-gamers"}></Redirect>
          )}
        </section>
      </div>
    </>
  );
};
