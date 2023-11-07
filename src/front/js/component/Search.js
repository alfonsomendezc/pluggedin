import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { Results } from "./Results";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gameResults, setGameResults] = useState([]);

  const { store, actions } = useContext(Context);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let slug = searchTerm.split(" ").join("-").toLowerCase();

    setGameResults([]);
    fetch(
      `https://api.rawg.io/api/games?key=0929bf6edddc4ca0b6b87155780d1977&search=${slug}`
    )
      .then((resp) => resp.json())
      .then(({ results }) => {
        results === undefined
          ? alert("no games found")
          : setGameResults(results);
      });
    setSearchTerm("");
  };

  return (
    <></>
  );
};
