import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";
import "../../pages/home/home.css";
import Cards from './Cards';
import HeroSection from './HeroSection';
import Footer from './Footer';

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      <div>
      <HeroSection />
      <Cards />
      <Footer />
      </div>
    </>
  );
};
