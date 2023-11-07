import React, { useContext, useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/perfil.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import placeholder from "../../img/placeholder.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { PostsProfile } from "../component/postsProfile";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const [canEdit, setCanEdit] = useState(false);
  const editar = () => {
    setCanEdit((canEdit) => !canEdit);
  };

  // Subir imagenes
  const [uploadImages, setUploadImages] = useState("");

  async function uploadFile() {
    const cloud_name = "plugged-in";
    const preset = "mth9qklz";

    const formData = new FormData();
    formData.append("file", uploadImages);
    formData.append("upload_preset", `${preset}`);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        actions.putImage(data.secure_url);
      }
    } catch (error) {
      console.log("message", error);
    }
  }

  const datosPerfil = (e) => {
    actions.handleUserProfile(e.target.name, e.target.value);
  };

  if (typeof window !== "undefined") {
    injectStyle();
  }

  const CustomAlertsUser = () => {
    toast.dark("Information successfully updated! 😄");
  };

  const handleUpdate = async () => {
    let data = {
      about_me: store.user.about_me,
      favorite_games: store.user.favorite_games,
      region: store.user.region,
      platform: store.user.platform,
      contact: store.user.contact,
      image: store.user.image,
    };
    if (actions.updateUserProfile(data)) {
      CustomAlertsUser();
    } else {
      alert("Something went wrong... Try again");
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  //search videojuegos API
  const [searchTerm, setSearchTerm] = useState("");
  const [gameResults, setGameResults] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
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
          ? alert("Videogame not found, try again")
          : setGameResults(results);
      });
    setSearchTerm("");
  };

  const [favGameOptions, setFavGameOptions] = useState([]);

  const getFavGamesData = (searchTerm) => {
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
        setFavGameOptions(updatedOptions);
      });
  };

  const onInputChange = (event, value) => {
    if (value) {
      getFavGamesData(value);
    } else {
      setFavGameOptions([]);
    }
  };

  const gameRegions = [
    {
      name: "United States - East",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/US_map-East_Coast.svg/959px-US_map-East_Coast.svg.png",
    },
    {
      name: "United States - West",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/West_Coast_of_the_United_States_map.svg/1200px-West_Coast_of_the_United_States_map.svg.png",
    },
    {
      name: "South America - Colombia",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/South_America-en.svg/400px-South_America-en.svg.png",
    },
    {
      name: "South America - Argentina",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/South_America-en.svg/400px-South_America-en.svg.png",
    },
    {
      name: "Europe",
      image: "https://assets.stickpng.com/images/585ab4b34f6ae202fedf292e.png",
    },
    {
      name: "Middle East",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/1/17/Middle_East_map_PNG.png",
    },
    { name: "Asia - East", image: "https://pixy.org/download/1390867/" },
    {
      name: "Oceania",
      image:
        "https://cdn.pixabay.com/photo/2013/07/12/17/00/continent-151644_960_720.png",
    },
    {
      name: "South Africa",
      image:
        "https://images.squarespace-cdn.com/content/v1/5a67f4b70abd04fa6db8e5cd/1534167117883-103CPDSID3KJRBBZB1OD/SouthAfrica.png",
    },
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      actions.getUserDetails();
      actions.getPosts();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filterByRecentDate = (posts) => {
    return posts
      .slice()
      .sort((a, b) => new Date(b.posted) - new Date(a.posted));
  };

  const filteredPosts = filterByRecentDate(store.posts);

  return (
    <>
      <div>
        <div className="perfil-body h-100">
          <div className="titulo-principal z-depth-1">Your Profile!</div>
          <div className="perfil row shadow-lg">
            <div className="img-username col-md-6 col-12">
              <div className="image">
                {!canEdit ? (
                  <>
                    {" "}
                    <img
                      src={
                        store.user.image === ""
                          ? placeholder
                          : store.user.image
                      }
                    />
                  </>
                ) : (
                  <div style={{display:"block"}}>
                    <img
                      src={
                        store.user.image === ""
                          ? placeholder
                          : store.user.image
                      } style={{display:'flex',margin:"auto"}}
                    />
                    <div className="btn-foto d-flex mb-3">
                      <input
                        className="form-control input-foto bg-primary text-white"
                        type="file"
                        id="formFile"
                        onChange={(e) => setUploadImages(e.target.files[0])}
                      ></input>
                      <Button variant="contained" onClick={uploadFile}>
                        Upload
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="username">{store.user.username}</div>
              <div className="info-extra">{store.user.email}</div>
              <div className="info-extra">Birthdate: </div>
              <div className="info-extra2">{store.user.birthdate}</div>
            </div>
            <div className="descripcion-usuario col-md-6 col-12 text-center">
              <div className="titulo-descripcion-username p-2">
                {store.user.username}
              </div>
              <div className="titulo-descripcion">Description</div>

              <div className="text-field">
                <ThemeProvider theme={darkTheme}>
                  {!canEdit ? (
                    <TextField
                      disabled
                      name="about_me"
                      id="outlined-basic-disabled"
                      label="Add a short description about yourself!"
                      value={store.user.about_me}
                      onChange={datosPerfil}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      className="TextField"
                      multiline
                    />
                  ) : (
                    <TextField
                      name="about_me"
                      id="outlined-basic"
                      label="Add a short description about yourself!"
                      value={store.user.about_me}
                      onChange={datosPerfil}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      className="TextField"
                      multiline
                    />
                  )}
                </ThemeProvider>
              </div>
              <div className="titulo-descripcion">Favorite Videogame</div>
              <div className="text-field">
                {!canEdit ? (
                  <>
                    <ThemeProvider theme={darkTheme}>
                      <TextField
                        disabled
                        name="favorite_games"
                        id="outlined-basic"
                        label="Your favorite videogame..."
                        value={store.user.favorite_games}
                        InputLabelProps={{ shrink: true }}
                        onChange={datosPerfil}
                        variant="outlined"
                        className="TextField"
                        multiline
                      />
                    </ThemeProvider>
                  </>
                ) : (
                  <>
                    <ThemeProvider theme={darkTheme}>
                      <Autocomplete
                        name="favorite_game"
                        id="combo-box-demo"
                        options={favGameOptions}
                        onInputChange={onInputChange}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            actions.handleUserProfile(
                              "favorite_games",
                              newValue.name
                            );
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
                            label="Search for our Favorite Game..."
                            variant="outlined"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password",
                            }}
                          />
                        )}
                      />
                    </ThemeProvider>
                  </>
                )}
              </div>
              <div className="titulo-descripcion">Region</div>
              <div className="text-field">
                <ThemeProvider theme={darkTheme}>
                  {!canEdit ? (
                    <>
                      <TextField
                        disabled
                        name="region"
                        id="outlined-basic"
                        label="Choose your region..."
                        value={store.user.region}
                        InputLabelProps={{ shrink: true }}
                        onChange={datosPerfil}
                        variant="outlined"
                        className="TextField"
                        multiline
                      />
                    </>
                  ) : (
                    <div>
                      <Autocomplete
                        name="favorite_game"
                        id="combo-box-demo"
                        options={gameRegions}
                        onInputChange={onInputChange}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            actions.handleUserProfile("region", newValue.name);
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
                            label="Select your Region..."
                            variant="outlined"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password",
                            }}
                          />
                        )}
                      />
                    </div>
                  )}
                </ThemeProvider>
              </div>
              <div className="titulo-descripcion">
                Contact Information and Platform
              </div>
              <div className="text-field">
                <ThemeProvider theme={darkTheme}>
                  {!canEdit ? (
                    <div>
                      <Grid container>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            sx={{ minWidth: 200 }}
                            className="m-2"
                            disabled
                          >
                            <InputLabel id="demo-simple-select-autowidth-label">
                              Platform
                            </InputLabel>
                            <Select
                              name="platform"
                              labelId="demo-simple-select-autowidth-label"
                              id="demo-simple-select-autowidth"
                              value={store.user.platform || ""}
                              onChange={datosPerfil}
                              autoWidth
                              label="Age"
                            >
                              <MenuItem value="PC">
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                                <Box
                                  sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                >
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            disabled
                            name="contact"
                            id="outlined-basic"
                            label="Add your contact information (eg. Discord, Xbox Live, PSN, Instagram)"
                            InputLabelProps={{ shrink: true }}
                            value={store.user.contact}
                            onChange={datosPerfil}
                            variant="outlined"
                            className="m-2"
                            multiline
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <Grid container>
                          <Grid item xs={12} sm={6}>
                            <FormControl sx={{ minWidth: 200 }}>
                              <InputLabel id="demo-simple-select-autowidth-label">
                                Platform
                              </InputLabel>
                              <Select
                                name="platform"
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={store.user.platform || ""}
                                onChange={datosPerfil}
                                autoWidth
                                label="Age"
                              >
                                <MenuItem value="PC">
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                                  <Box
                                    sx={{ "& > img": { mr: 3, flexShrink: 0 } }}
                                  >
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
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="contact"
                              id="outlined-basic"
                              label="Add your contact information (eg. Discord, Xbox Live, PSN, Instagram)"
                              InputLabelProps={{ shrink: true }}
                              value={store.user.contact}
                              onChange={datosPerfil}
                              variant="outlined"
                              multiline
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  )}
                </ThemeProvider>
              </div>
              {!canEdit ? (
                <Button
                  type="button"
                  className="btn btn-primary m-3"
                  variant="contained"
                  size="large"
                  onClick={editar}
                >
                  Edit Information
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn btn-primary m-3"
                  variant="contained"
                  size="large"
                  onClick={() => {
                    handleUpdate();
                    editar();
                  }}
                >
                  Save Information
                </Button>
              )}
            </div>
            <div className="tus-posts row overX anuncios-publicados">
              <label htmlFor="" className="your-posts mb-3">
                Your Posts
              </label>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {filteredPosts.length === 0 ||
                  !store.user ||
                  !store.user.post_id ||
                  store.user.post_id.length === 0 ? (
                    <Alert variant="filled" severity="info">
                      Sorry! No posts found...
                    </Alert>
                  ) : (
                    filteredPosts.map((post, index) => (
                      <div
                        className="col-10 col-md-8 col-lg-4 mt-3"
                        key={index}
                      >
                        <PostsProfile
                          image={post.image}
                          username={post.username}
                          posted={post.posted}
                          post_title={post.post_title}
                          post_game={post.post_game}
                          post_description={post.post_description}
                          region={post.region}
                          contact={post.contact}
                          platform={post.platform}
                          id={post.id}
                          comments={post.comments}
                        />
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            {localStorage.getItem("token") == undefined &&  (
              <Redirect to={"/log-in"}></Redirect>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};
