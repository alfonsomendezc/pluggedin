import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FadeIn from 'react-fade-in';

export const Results = (props) => {
  const { store, actions } = useContext(Context);

  const ratingToStars = (game) => {
    const numStars = parseInt(game.rating);

    if (isNaN(numStars) || numStars < 1) {
      return "Invalid Rating";
    }
    return "★".repeat(numStars);
  };

  return (
    <>
      <div
        className="filter-title"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="posts-columnas d-flex flex-wrap">
          {props.wikiGameOptions.map((game, index) => (
            <FadeIn>
              <div key={index} className="m-3">
                <Card
                  sx={{
                    maxWidth: "100%",
                    "@media (min-width: 960px)": {
                      minWidth: 320,
                      maxWidth: 420,
                    },
                    "@media (max-width: 600px)": {
                      minWidth: 250,
                      maxWidth: 300,
                    },
                  }}
                >
                  <CardMedia
                    sx={{ height: 210 }}
                    image={game.image}
                    title={game.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {game.name}
                    </Typography>
                    {game.rating && game.rating !== 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ display: "flex" }}
                        component={"div"}
                      >
                        Rating: {""}
                        <div style={{ color: "yellow" }}>
                          {" "}
                          {ratingToStars(game)}
                        </div>
                      </Typography>
                    ) : (
                      <>
                        <div style={{ color: "orange" }}> No Rating! :c</div>
                      </>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Platforms: {game.platforms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Released: {game.released}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to={`/wiki/${game.id}`}>
                      <Button size="medium">View Details</Button>
                    </Link>
                  </CardActions>
                </Card>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
};
