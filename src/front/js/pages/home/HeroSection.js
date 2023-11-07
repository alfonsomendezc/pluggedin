import React from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";

import "./home.css";

function HeroSection() {
  return (
    <div className="hero-container">
      <div>
        <h1>Get Plugged IN!</h1>
        <p>What are you waiting for?</p>
        <div className="hero-btns">
          <Link to="/log-in">
            <div style={{display:'flex', justifyContent:'center'}}>

            <Button
              className="btns"
              buttonStyle="btn--outline"
              buttonSize="btn--large"
              >
              GET STARTED!
            </Button>
            
              </div>
          </Link>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 177, left: 0, color: "lightgray", fontSize: "10px" }}>
        Image created by Pixel Jeff - <a href="https://www.behance.net/pixeljeff">Behance.net</a>
      </div>
    </div>
  );
}

export default HeroSection;
