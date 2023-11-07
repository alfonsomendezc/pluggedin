import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/perfil.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { PostsOneProfile } from "../component/postsOneProfile";

export const OneProfile = (props) => {
  const { store, actions } = useContext(Context);
  const [userProfile, setUserProfile] = useState({});
  const { id } = useParams();

  useEffect(() => {
    actions.getProfiles();
    actions.getPosts();
  }, []);

  useEffect(() => {
    let user = store.profiles.filter((profile) => profile.user_id == id);
    setUserProfile(user[0]);
  }, [store.profiles]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const filterByRecentDate = (posts) => {
    return posts
      .slice()
      .sort((a, b) => new Date(b.posted) - new Date(a.posted));
  };

  const filteredPosts = filterByRecentDate(store.posts);

  useEffect(() => {
    actions.getUserDetails();
    actions.getPosts();
  }, []);

  return (
    <>
      {userProfile && (
        <>
          <div className="perfil-body h-100">
            <div className="titulo-principal z-depth-1">
              {userProfile.username}'s Profile
            </div>
            <div className="perfil row shadow-lg">
              <div className="img-username col-md-6 col-12">
                <div className="image">
                  <img src={userProfile.image} className="responsive-image m-3" />
                </div>

                <div className="username">{userProfile.username}</div>
                <div className="info-extra">{userProfile.email}</div>
                <div className="info-extra">Birthdate: </div>
                <div className="info-extra2 pb-3">{userProfile.birthdate}</div>
              </div>
              <div className="descripcion-usuario col-md-6 col-12 text-center">
                <div className="titulo-descripcion-username p-2">
                  {userProfile.username}
                </div>
                <div className="text-secondary">
                  Joined on: {userProfile.registration_date}
                </div>
                <div className="titulo-descripcion">Description</div>

                <div className="text-field">
                  <ThemeProvider theme={darkTheme}>
                    <TextField
                      disabled
                      name="about_me"
                      id="outlined-basic-disabled"
                      label="Description"
                      value={userProfile.about_me}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      className="TextField"
                      multiline
                    />
                  </ThemeProvider>
                </div>
                <div className="titulo-descripcion">Favorite Game</div>
                <div className="text-field">
                  <ThemeProvider theme={darkTheme}>
                    <TextField
                      disabled
                      name="favorite_games"
                      id="outlined-basic"
                      label="Favorite Videogame"
                      value={userProfile.favorite_games}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      className="TextField"
                      multiline
                    />
                  </ThemeProvider>
                </div>
                <div className="titulo-descripcion">Region</div>
                <div className="text-field">
                  <ThemeProvider theme={darkTheme}>
                    <TextField
                      disabled
                      name="region"
                      id="outlined-basic"
                      label="Region"
                      value={userProfile.region}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      className="TextField"
                      multiline
                    />
                  </ThemeProvider>
                </div>
                <div className="titulo-descripcion">
                  Contact Information and Platform
                </div>
                <div className="text-field">
                  <ThemeProvider theme={darkTheme}>
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <FormControl sx={{ minWidth: 200 } } className="m-2" disabled>
                          <InputLabel id="demo-simple-select-autowidth-label">
                            Platform
                          </InputLabel>
                          <Select
                            name="platform"
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={userProfile.platform || ""}
                            autoWidth
                            label="Age"
                          >
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
                      </Grid>
                      <Grid  item xs={12} sm={6}>
                        
                        <TextField
                          disabled
                          name="contact"
                          id="outlined-basic"
                          label="Contact information (eg. Discord, Xbox Live, PSN, Instagram)"
                          InputLabelProps={{ shrink: true }}
                          value={userProfile.contact}
                          variant="outlined"
                          className="m-2"
                          multiline
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </ThemeProvider>
                </div>
              </div>
              <div className="tus-posts row overX anuncios-publicados">
                <label
                  htmlFor="exampleFormControlTextarea6"
                  className="titulo-textarea mb-3"
                >
                  Posts by {userProfile.username}
                </label>
                {filteredPosts.length === 0 || (!store.user.post_id || store.user.post_id.length === 0) ? (
                  <Alert variant="filled" severity="info">
                    Sorry! No posts found...
                  </Alert>
                ) : (
                  filteredPosts.map((post_id, index) => (
                    <div className="col-10 col-md-8 col-lg-4 mt-3" key={index}>
                      <PostsOneProfile
                        image={post_id.image}
                        username={post_id.username}
                        posted={post_id.posted}
                        post_title={post_id.post_title}
                        post_game={post_id.post_game}
                        post_description={post_id.post_description}
                        region={post_id.region}
                        contact={post_id.contact}
                        platform={post_id.platform}
                        id={post_id.id}
                        comments={post_id.comments}
                      />
                    </div>
                  ))
                )}
              </div>
              {localStorage.getItem("token") == undefined && (
                <Redirect to={"/log-in"}></Redirect>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

OneProfile.propTypes = {
  username: PropTypes.string,
};
