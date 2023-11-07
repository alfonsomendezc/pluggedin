import React from "react";
import "./home.css";
import { Button } from "./Button";
import { Link, Redirect } from "react-router-dom";
import publish from "../../../img/publish.jpeg";
import register from "../../../img/register.jpeg";
import teammate from "../../../img/teammate.jpeg";
import complete from "../../../img/complete.jpeg";
import wiki from "../../../img/wiki.jpeg";

import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <div className="cards__container">
        <h1>Features!</h1>
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              text="Find your perfect teammate!"
              label=""
              text2='We offer a social media platform full of friendly, passionate, and competitive people ready to game on!'
              path="/find-gamers"
              image={teammate}
            />

            <CardItem
              text="Look up information about your favorite games!"
              label=""
              path="/wiki"
              text2='We also offer a Wiki full of updated videogames. Look up details about the videogames you are interested on!'
              image={wiki}
            />
          </ul>
        </div>
      </div>
      <div className="cards__container">
        <h1>How to find the perfect teammate!</h1>
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              text="1. Create an account"
              text2='Type an username that defines you and complete the registry form!'
              label=""
              path="/register"
              image={register}
            />
            <CardItem
              text="2. Complete your profile"
              text2='Include general information about you! You need to fill out a general description, your favorite videogame, your region, contact information, and platform.'
              text3="* This is necessary to enjoy the website's features."
              image={complete}
              label=""
              path="/your-profile"
            />
            <CardItem
              text="3. Publish a post"
              text2='Finally, make a post! Include a title, the game you want to play, and a short description. The rest comes automatically! You can also comment on other posts. Enjoy and get Plugged In! :)'
              label=""
              image={publish}
              path="/find-gamers"
            />
          </ul>
        </div>
          <Link to="/log-in">
            <div style={{ display: "flex", justifyContent: "center" }} className="cards__wrapper mt-2">
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
  );
}

export default Cards;
