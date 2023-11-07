import React, { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { Results } from "../component/Results";
import CircularProgress from "@mui/material/CircularProgress";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const GameWiki = (props) => {
  const { store, actions } = useContext(Context);
  const history = useHistory();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [wikiGameOptions, setWikiGameOptions] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };
  const [isLoading, setIsLoading] = useState(true);

  const getWikiGamesData = (searchTerm) => {
    let slug = searchTerm.split(" ").join("-").toLowerCase();
    fetch(
      `https://api.rawg.io/api/games?key=0929bf6edddc4ca0b6b87155780d1977&search=${slug}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log("search term: " + slug + ", results: ", myJson.results);
        const wikiResults = myJson.results.map((game) => {
          return {
            id: game.id,
            name: game.name,
            image: game.background_image,
            rating: game.rating,
            released: game.released,
            platforms: game.platforms.length,
          };
        });
        setWikiGameOptions(wikiResults);
        setIsLoading(false);
      });
    setSearchTerm("");
  };

  useEffect(() => {
    async function fetchData() {
      actions.getProfiles();
    }
    fetchData();
    getWikiGamesData("");
  }, []);

  return (
    <div>
      <div className="game-wiki">
        <div className="titulo-principal">
          <h1>Game Wiki</h1>
        </div>
        <div className="overlay" id="banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="titulo-overlay text-center p-3">
                <h5>Look up for your favorite games' information!</h5>
              </div>
            </div>
          </div>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              getWikiGamesData(searchTerm);
            }}
          >
            <ThemeProvider theme={darkTheme}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mt={4} // Add margin-top
              >
                <Box maxWidth="60%" width="100%">
                  <TextField
                    label="Search..."
                    variant="outlined"
                    size="medium"
                    fullWidth
                    value={searchTerm}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            size="medium"
                          >
                            Search
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        getWikiGamesData(searchTerm);
                        setIsLoading(true);
                      }
                    }}
                  />
                </Box>
              </Box>
              {isLoading ? (
                <div className="loading-container">
                  <ThemeProvider theme={darkTheme}>
                    <CircularProgress size={80} />
                  </ThemeProvider>
                </div>
              ) : wikiGameOptions.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                  }}
                  className="m-5"
                >
                  <Alert variant="filled" severity="info">
                    Sorry! No results found...
                  </Alert>
                </div>
              ) : (
                <Results wikiGameOptions={wikiGameOptions} />
              )}
            </ThemeProvider>
          </form>
        </div>
        {localStorage.getItem("token") == undefined && (
          <Redirect to={"/log-in"}></Redirect>
        )}
      </div>
    </div>
  );
};
