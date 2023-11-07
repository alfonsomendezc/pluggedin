import React, { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/findGamers.css";
import { Posts } from "../component/posts";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Hidden from "@mui/material/Hidden";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";
import Alert from "@mui/material/Alert";
import FadeIn from "react-fade-in";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FindGamers = (props) => {
  const { store, actions } = useContext(Context);
  const history = useHistory();

  const [post, setPost] = useState({
    title: "",
    body: "",
    game: "",
  });

  const datosPost = (value, fieldName) => {
    if (fieldName === "game") {
      setPost({
        ...post,
        [fieldName]: value.name,
      });
    } else {
      setPost({
        ...post,
        [fieldName]: value.target.value,
      });
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  if (typeof window !== "undefined") {
    injectStyle();
  }

  useEffect(() => {
    actions.getPosts();
  }, []);

  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const handleSubmit = async () => {
    let data = {
      post_title: post.title,
      post_description: post.body,
      post_game: post.game,
    };
    if (await actions.publishPost(data)) {
      toast.dark("Post successfully published! 🎮🕹️😄");
      setPost({
        title: "",
        body: "",
      });
      setAutocompleteKey((prevKey) => prevKey + 1);
    } else {
      alert("Something happened... try again");
    }
  };

  //search videojuegos API

  const [PlayGameOptions, setPlayGameOptions] = useState([]);

  const getPlayGamesData = (searchTerm) => {
    let slug = searchTerm.split(" ").join("-").toLowerCase();
    fetch(
      `https://api.rawg.io/api/games?key=0929bf6edddc4ca0b6b87155780d1977&search=${slug}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log("search term: " + slug + ", results: ", myJson.results);
        const updatedOptions = myJson.results.map((game) => {
          return { name: game.name, image: game.background_image };
        });
        setPlayGameOptions(updatedOptions);
      });
  };

  const onInputChange = (event, value, reason) => {
    if (value) {
      getPlayGamesData(value);
    } else {
      setPlayGameOptions([]);
    }
  };

  //Filtering
  const [filterRegion, setFilterRegion] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");

  const filterByRecentDate = (posts) => {
    return posts
      .slice()
      .sort((a, b) => new Date(b.posted) - new Date(a.posted));
  };

  const filterByRegion = (posts) => {
    return filterRegion === ""
      ? posts // No region selected, return all posts
      : posts.filter(
          (post) => post.region.toLowerCase() === filterRegion.toLowerCase()
        );
  };

  const filterByPlatform = (posts) => {
    return filterPlatform === ""
      ? posts // No platform selected, return all posts
      : posts.filter(
          (post) => post.platform.toLowerCase() === filterPlatform.toLowerCase()
        );
  };
  const [filterGame, setFilterGame] = useState("");

  const filterByGame = (posts) => {
    return filterGame
      ? posts.filter((post) => {
          if (post.post_game && typeof post.post_game === "string") {
            return post.post_game
              .toLowerCase()
              .includes(filterGame.toLowerCase());
          }
          return false;
        })
      : posts;
  };

  // Handle region filter change
  const handleRegionChange = (event) => {
    setFilterRegion(event.target.value);
  };

  // Handle platform filter change
  const handlePlatformChange = (event) => {
    setFilterPlatform(event.target.value);
  };

  // Handle games filter change

  const filteredPosts = filterByPlatform(
    filterByRegion(filterByGame(filterByRecentDate(store.posts)))
  );

  // Check profile
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await actions.getProfiles();
        await actions.getPosts();
        await actions.getComments();

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="encontrar-gamers">
      <div>
        <div className="titulo-principal">
          <h1>Welcome to PluGGed-In!</h1>
        </div>
        <div className="overlay" id="banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="titulo-overlay text-center p-3">
                <h5>
                  The perfect platform for the ideal teammate, PluGGed-in...
                  where every game is a GG!
                </h5>
              </div>
            </div>
          </div>
        </div>

        <Grid container spacing={2}>
          <ThemeProvider theme={darkTheme}>
            <Dialog
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                sx: {
                  backgroundColor: "#0288d1",
                  color: "white",
                },
              }}
            >
              <DialogTitle id="alert-dialog-title">
                {"Complete Your Profile"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You must complete your profile before publishing a post. You
                  must include an image, general description, favorite game,
                  platform, region, and contact forms. You can do so visiting
                  this link! --
                  <Link to="/your-profile">
                    <span>Your Profile</span>
                  </Link>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsModalOpen(false)} autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </ThemeProvider>
          <Grid item xs={12} sm={4} md={3} lg={3}>
            <div className="sticky">
              <Accordion
                style={{ color: "white" }}
                sx={{ backgroundColor: "#0288d1" }}
                className="MuiAccordion-rounded"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="titulo-textarea"
                >
                  <div>Publish your post:</div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="publicar-anuncio">
                    <div className="form-group form-publicar shadow-textarea">
                      <div className="inputs-post col-lg-12">
                        <div className="info-user d-flex text-divider mt-2 mb-2">
                          <p className="post-label me-3">
                            What game do you want to play?
                          </p>
                          <ThemeProvider theme={darkTheme}>
                            <Autocomplete
                              key={autocompleteKey}
                              name="game"
                              id="combo-box-demo"
                              options={PlayGameOptions}
                              onInputChange={onInputChange}
                              getOptionLabel={(option) => option.name}
                              isOptionEqualToValue={(option, value) =>
                                option.name === value.name
                              }
                              sx={{ width: "100%" }}
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  datosPost(newValue, "game");
                                }
                              }}
                              renderOption={(props, option) => (
                                <Box
                                  component="li"
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  {...props}
                                >
                                  <img
                                    loading="lazy"
                                    width="20"
                                    src={option.image}
                                    alt=""
                                  />
                                  {option.name}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Game"
                                  variant="outlined"
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password",
                                  }}
                                />
                              )}
                            />
                          </ThemeProvider>
                        </div>
                        <div className="info-user d-flex text-divider mt-3 mb-1">
                          <p className=" me-2">Add a title to your post:</p>
                          <ThemeProvider theme={darkTheme}>
                            <TextField
                              name="title"
                              value={post.title}
                              onChange={(e) => datosPost(e, "title")}
                              id="standard-basic"
                              label="Title"
                              className="z-depth-1 mt-2 ms-4"
                              variant="filled"
                              style={{ width: "400px" }}
                            />
                          </ThemeProvider>
                        </div>
                        <div className="info-user d-flex mb-3 text-divider mt-3 mb-1">
                          <p style={{ marginTop: "10px" }}>
                            Add a short description to your post:
                          </p>
                          <ThemeProvider theme={darkTheme}>
                            <TextField
                              multiline
                              name="body"
                              value={post.body}
                              onChange={(e) => datosPost(e, "body")}
                              id="standard-basic"
                              label="Description"
                              className="z-depth-1 mt-2 ms-3"
                              variant="filled"
                              style={{ width: "400px" }}
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-publicar btn-primary btn-lg mt-3"
                        onClick={() => {
                          if (store.user.user_id === undefined) {
                            setIsModalOpen(true);
                          } else {
                            handleSubmit();
                          }
                        }}
                        disabled={
                          !post.title.length > 0 ||
                          // !post.game.length > 0 ||
                          !post.body.length > 0
                        }
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
          <Grid item xs={12} sm={8} md={9} lg={9}>
            <div style={{ overflow: "hidden", minHeight: "73vh" }}>
              <div className="row overX anuncios-publicados">
                <label
                  htmlFor="exampleFormControlTextarea6"
                  className="titulo-textarea mb-3"
                >
                  Posts
                </label>
                <div>
                  {/* Region filter */}
                  <ThemeProvider theme={darkTheme}>
                    <FormControl
                      sx={{
                        "& .MuiInputBase-root": {
                          color: "white",
                        },
                      }}
                      className="ms-3 form-filter"
                    >
                      <InputLabel id="demo-simple-select-autowidth-label">
                        Filter Region
                      </InputLabel>
                      <Select
                        value={filterRegion}
                        onChange={handleRegionChange}
                        id="demo-simple-select-autowidth"
                        autoWidth
                      >
                        <MenuItem value="">All Regions</MenuItem>
                        <MenuItem value="United States - East">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/US_map-East_Coast.svg/959px-US_map-East_Coast.svg.png"
                              alt=""
                            />
                            United States - East
                          </Box>
                        </MenuItem>
                        <MenuItem value="United States - West">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/West_Coast_of_the_United_States_map.svg/1200px-West_Coast_of_the_United_States_map.svg.png"
                              alt=""
                            />
                            United States - West
                          </Box>
                        </MenuItem>
                        <MenuItem value="South America - Colombia">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/South_America-en.svg/400px-South_America-en.svg.png"
                              alt=""
                            />
                            South America - Colombia
                          </Box>
                        </MenuItem>
                        <MenuItem value="South America - Argentina">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/South_America-en.svg/400px-South_America-en.svg.png"
                              alt=""
                            />
                            South America - Argentina
                          </Box>
                        </MenuItem>
                        <MenuItem value="Europe">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://assets.stickpng.com/images/585ab4b34f6ae202fedf292e.png"
                              alt=""
                            />
                            Europe
                          </Box>
                        </MenuItem>
                        <MenuItem value="Middle East">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://upload.wikimedia.org/wikipedia/commons/1/17/Middle_East_map_PNG.png"
                              alt=""
                            />
                            Middle East
                          </Box>
                        </MenuItem>
                        <MenuItem value="Asia - East">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://pixy.org/download/1390867/"
                              alt=""
                            />
                            Asia - East
                          </Box>
                        </MenuItem>
                        <MenuItem value="Oceania">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://pixy.org/download/1390867/"
                              alt=""
                            />
                            Oceania
                          </Box>
                        </MenuItem>
                        <MenuItem value="South Africa">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://images.squarespace-cdn.com/content/v1/5a67f4b70abd04fa6db8e5cd/1534167117883-103CPDSID3KJRBBZB1OD/SouthAfrica.png"
                              alt=""
                            />
                            South Africa
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {/* Platform filter */}
                    <FormControl
                      sx={{
                        "& .MuiInputBase-root": {
                          color: "white",
                        },
                      }}
                      className="ms-3 form-filter"
                    >
                      <InputLabel id="demo-simple-select-autowidth-label">
                        Filter Platform
                      </InputLabel>
                      <Select
                        value={filterPlatform}
                        onChange={handlePlatformChange}
                      >
                        <MenuItem value="">All Platforms</MenuItem>
                        <MenuItem value="PC">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://cdn-icons-png.flaticon.com/512/3039/3039396.png"
                              alt=""
                            />
                            PC
                          </Box>
                        </MenuItem>
                        <MenuItem value="Playstation 5">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://www.gran-turismo.com/gtsport/decal/8070469293286883864_1.png"
                              alt=""
                            />
                            Playstation 5
                          </Box>
                        </MenuItem>
                        <MenuItem value="Playstation 4">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://www.pngkit.com/png/full/6-66510_playstation-4-logo-white-png-jpg-silhouette.png"
                              alt=""
                            />
                            Playstation 4
                          </Box>
                        </MenuItem>
                        <MenuItem value="Xbox Series X/S">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://www.citypng.com/public/uploads/small/1166172754571dhqw1dsok1q4ue0mraxvuwvoliatpxzmepigtdprxbzgkiuqi1xvog5qe62vpe398idyanushkuevqeolr9poliqjyjmxzrikq.png"
                              alt=""
                            />
                            Xbox Series X/S
                          </Box>
                        </MenuItem>
                        <MenuItem value="Xbox One">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://www.citypng.com/public/uploads/small/1166172754571dhqw1dsok1q4ue0mraxvuwvoliatpxzmepigtdprxbzgkiuqi1xvog5qe62vpe398idyanushkuevqeolr9poliqjyjmxzrikq.png"
                              alt=""
                            />
                            Xbox One
                          </Box>
                        </MenuItem>
                        <MenuItem value="Mobile">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://static.vecteezy.com/system/resources/previews/010/174/970/original/mobile-image-with-white-screen-and-front-camera-mobile-design-on-a-transparent-background-free-png.png"
                              alt=""
                            />
                            Mobile
                          </Box>
                        </MenuItem>
                        <MenuItem value="Nintendo Switch">
                          <Box sx={{ "& > img": { mr: 3, flexShrink: 0 } }}>
                            <img
                              loading="lazy"
                              width="20"
                              src="https://fs-prod-cdn.nintendo-europe.com/media/images/08_content_images/systems_5/nintendo_switch_3/not_approved_1/logo.png"
                              alt=""
                            />
                            Nintendo Switch
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    {/* Game filter */}
                    <FormControl className="ms-3 form-filter-3">
                      <TextField
                        value={filterGame}
                        onChange={(event) => setFilterGame(event.target.value)}
                        label="Filter by Game"
                        variant="outlined"
                        sx={{ width: "100%" }}
                      />
                    </FormControl>
                  </ThemeProvider>
                </div>
                <div
                  className="filter-title"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div>
                    <div className="posts-columnas col-10 col-md-8 col-lg-4 mt-3" key={index}>">
                      {isLoading ? (
                        <ThemeProvider theme={darkTheme}>
                          <CircularProgress size={80} />
                        </ThemeProvider>
                      ) : (
                        <>
                          {filteredPosts.length === 0 ? (
                            <Alert variant="filled" severity="info">
                              Sorry! No posts found...
                            </Alert>
                          ) : (
                            filteredPosts.map((results, index) => {
                              return (
                                <FadeIn>
                                  <div key={results.id} className="m-3">
                                    <Posts
                                      image={results.image}
                                      username={results.username}
                                      posted={results.posted}
                                      post_title={results.post_title}
                                      post_game={results.post_game}
                                      post_description={
                                        results.post_description
                                      }
                                      region={results.region}
                                      contact={results.contact}
                                      platform={results.platform}
                                      id={results.id}
                                      profile_user_id={results.profile_user_id}
                                      comments={results.comments}
                                    />
                                  </div>
                                </FadeIn>
                              );
                            })
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        {localStorage.getItem("token") == undefined && (
          <Redirect to={"/log-in"}></Redirect>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};
