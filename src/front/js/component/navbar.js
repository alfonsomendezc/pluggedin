import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import Logo from "../../img/Logo.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const history = useHistory();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  const isAuthenticated = () => {
    // Get the JWT token from localStorage or wherever you store it.
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
  
    // Check if the token exists and is not expired
    if (token) {
      // Decode the token to get the expiration timestamp
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
  
      // Check if the token has not expired (current time is before the expiration time)
      return Date.now() < expirationTime;
    }

  const tokenExpired = () => {
      // Get the JWT token from localStorage or wherever you store it.
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    
      // Check if the token exists
      if (token) {
        // Decode the token to get the expiration timestamp
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    
        // Check if the token has expired (current time is after the expiration time)
        return Date.now() >= expirationTime;
      }
    
      // Token doesn't exist, so technically it has expired
      return true;
    };
    
  
    // Token doesn't exist or has expired
    return false;
  };
  

  useEffect(() => {
    showButton();
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/">
            <img src={Logo} alt="Plugged-In" className="navbar-logo" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {!isAuthenticated() || tokenExpired() ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/log-in"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Log In
                  </Link>
                </li>
              </>
            ) : (
              <>
                {" "}
                <li className="nav-item">
                  <Link
                    to="/find-gamers"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Find Gamers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/wiki"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Game Wiki
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/your-profile"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Your Profile
                  </Link>
                </li>
                <li className="nav-item-signout">
                  <Link to="/" className="nav-links">
                    <div
                      onClick={(e) => {
                        actions.logOutUser();
                        history.push("/log-in");
                      }}
                    >
                      Sign Out
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};
