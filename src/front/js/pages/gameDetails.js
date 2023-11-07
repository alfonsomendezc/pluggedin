import React, { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { styled } from "@mui/material/styles";
import "../../styles/gameDetails.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Chip from "@mui/material/Chip";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { Results } from "../component/Results";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import FadeIn from "react-fade-in";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const GameDetails = (props) => {
  const { store, actions } = useContext(Context);
  const history = useHistory();
  const { id } = useParams();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [gameDetails, setGameDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getWikiGamesData = () => {
    fetch(
      `https://api.rawg.io/api/games/${id}?key=0929bf6edddc4ca0b6b87155780d1977`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log("game id: " + id + ", results: ", myJson);
        setGameDetails(myJson);
        setIsLoading(false);
      });
  };

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    margin: "1",
    padding: theme.spacing(2),
    textAlign: "center",
    flexGrow: 1,
  }));

  useEffect(() => {
    async function fetchData() {
      actions.getProfiles();
    }
    fetchData();
    getWikiGamesData();
  }, [id]);

  return (
    <div className="game-details-page">
      {isLoading ? (
        <div className="loading-container">
          <ThemeProvider theme={darkTheme}>
            <CircularProgress size={80} />
          </ThemeProvider>
        </div>
      ) : (
        <div>
            <div className="titulo-principal">
              <h1>{gameDetails ? gameDetails.name : "Game"} Wiki</h1>
            </div>
            <div className="overlay" id="banner">
              {gameDetails && (
                <div>
                  <ThemeProvider theme={darkTheme}>
                    <Grid container spacing={1} className="game-details-page">
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography gutterBottom variant="h3" component="div">
                          <div className="metacritic m-2 p-3">
                            {gameDetails
                              ? (gameDetails.metacritic || "N/A") + "/100"
                              : "N/A"}
                          </div>
                        </Typography>
                        <img
                          className="game-image"
                          src={gameDetails.background_image}
                          style={{
                            maxWidth: "80%",
                            height: "auto",
                            justifyContent: "center",
                          }}
                        ></img>
                        <div className="m-2" container spacing={1}>
                          {gameDetails.platforms.map((platform, index) => (
                            <Chip
                              className="m-1 ms-2"
                              color="primary"
                              variant="elevated"
                              label={platform.platform.name}
                              key={index}
                            />
                          ))}
                        </div>
                      </Grid>
                      <Grid item xs={11.5} sm={6}>
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            sm={5.4}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Item className="mt-1" style={{ width: "80%" }}>
                              Release Date: {gameDetails.released}
                            </Item>
                          </Grid>
                          <Grid
                            item
                            xs={11}
                            sm={6.45}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Item className="mt-1" style={{ width: "90%" }}>
                              Website:{" "}
                              {gameDetails && gameDetails.website ? (
                                <a href={gameDetails.website}>
                                  {gameDetails.website}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </Item>
                          </Grid>
                        </Grid>
                        <Typography
                          gutterBottom
                          variant="body1"
                          component="div"
                        >
                          <div
                            className="game-description m-2 p-3"
                            dangerouslySetInnerHTML={{
                              __html: gameDetails.description,
                            }}
                          />
                        </Typography>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={{ xs: 1, sm: 2, md: 3 }}
                          divider={<Divider orientation="vertical" flexItem />}
                          flexWrap="wrap"
                          className="m-1"
                        >
                          <Item className="m-1">
                            Reddit:{" "}
                            {gameDetails && gameDetails.reddit_url ? (
                              <a href={gameDetails.reddit_url}>
                                {gameDetails.reddit_url}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </Item>
                          <Item className="m-1">
                            Twitch Count:{" "}
                            {gameDetails
                              ? gameDetails.twitch_count || "N/A"
                              : "N/A"}
                          </Item>
                          <Item className="m-1">
                            Youtube Count:{" "}
                            {gameDetails
                              ? gameDetails.youtube_count || "N/A"
                              : "N/A"}
                          </Item>
                        </Stack>
                      </Grid>
                      <Grid className="m-2" container spacing={1}>
                        <div className="custom-divider"></div>
                        <Divider component="div" textAlign="center">
                          <Chip
                            className="m-1 ms-2"
                            color="primary"
                            label="Tags"
                          />
                        </Divider>

                        {gameDetails.tags &&
                          gameDetails.tags.map((tag, index) => (
                            <Chip
                              className="m-1 ms-2"
                              color="primary"
                              variant="outlined"
                              label={tag.name}
                              key={index}
                            />
                          ))}
                      </Grid>
                    </Grid>
                  </ThemeProvider>
                </div>
              )}
            </div>
        </div>
      )}
      {localStorage.getItem("token") == undefined && (
        <Redirect to={"/log-in"}></Redirect>
      )}
    </div>
  );
};
