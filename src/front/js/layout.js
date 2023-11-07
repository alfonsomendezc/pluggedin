import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home/home";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Register } from "./pages/register";
import { GameDetails } from "./pages/gameDetails";
import { GameWiki } from "./pages/gameWiki";
import { LogIn } from "./pages/login";
import { FindGamers } from "./pages/findGamers";
import { Profile } from "./pages/profile";
import { OneProfile } from "./pages/oneProfile";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/find-gamers">
              <FindGamers />
            </Route>
            <Route exact path="/user-details/:id">
              <OneProfile />
            </Route>
            <Route exact path="/log-in">
              <LogIn />
            </Route>
            <Route exact path="/your-profile">
              <Profile />
            </Route>
            <Route exact path="/wiki">
              <GameWiki />
            </Route>
            <Route exact path="/wiki/:id">
              <GameDetails />
            </Route>
            <Route>
              <h1 className="text-light">Not found!</h1>
            </Route>
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
