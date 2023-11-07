const getState = ({ getStore, getActions, setStore }) => {
  const API_URL = process.env.BACKEND_URL;
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      games: [],
      user: [],
      profile: [],
      posts: [],
      comments: [],
      profiles: [],
      searchusername: [],
      oneProfile: [],
    },
    actions: {
      registerUser: async (data) => {
        let response = await fetch(`/api/register`, {
          method: "POST",
          // mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(response.status);
        if (response.status == 200) {
          let data = await response.json();
          localStorage.setItem("token", data.token);
          setStore({ isLoggedIn: true });
          return true;
        } else return false;
      },

      loginUser: async (data) => {
        let response = await fetch(`/api/log-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          let data = await response.json();
          localStorage.setItem("token", data.token);
          setStore({ isLoggedIn: true });
          return true;
        } else return false;
      },

      logOutUser: () => {
        localStorage.removeItem("token");
        setStore({ isLoggedIn: false });
      },

      loadGamesData: async () => {
        const url =
          "https://api.rawg.io/api/games?key=0929bf6edddc4ca0b6b87155780d1977&tags=7";
        try {
          let response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setStore({ games: data });
        } catch (error) {
          console.log(error);
        }
      },
      
      getUserDetails: async (data) => {
        let response = await fetch(`/api/user-details`, {
          method: "GET",
          // mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (response.status == 200) {
          let data = await response.json();
          setStore({ user: data.user_data });
          return true;
        } else console.log("Error", response.status);
        if (response.status === 401) {
          getActions().logOutUser();
        }
      },

      handleUserProfile: (prop, data) => {
        let store = getStore();
        let user_data = (store.user[`${prop}`] = data);
        setStore((prev) => ({
          ...prev,
          user_data,
        }));
      },

      updateUserProfile: async (data) => {
        let response = await fetch(`/api/user-details`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (response.status == 204 || response.status == 201) {
          // let data = await response.json();
          getActions().getUserDetails();
          return true;
        } else return console.log("Error", response.status);
      },

      updateFavoriteGame: async (data) => {
        let response = await fetch(
          `${API_URL}/api/user-details/favorite-games`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (response.status == 204 || response.status == 201) {
          getActions().getUserDetails();
          return true;
        } else return console.log("Error", response.status);
      },

      putImage: async (data) => {
        let response = await fetch(`/api/user-details/image`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (response.status == 204 || response.status == 201) {
          // let data = await response.json();
          console.log("Profile Picture updated");
          getActions().getUserDetails();
          return true;
        } else return console.log("Error", response.status);
      },

      publishPost: async (data) => {
        let response = await fetch(`/api/find-gamers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          getActions().getPosts();
          return true;
        } else return console.log("Error", response.status);
      },

      deletePost: async (data) => {
        let response = await fetch(`/api/find-gamers`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          getActions().getUserDetails();
          return true;
        } else return console.log("Error", response.status);
      },

      publishComment: async (data) => {
        let response = await fetch(`/api/find-gamers/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          getActions().getComments();
          getActions().getPosts();
          return true;
        } else return console.log("Error", response.status);
      },

      getPosts: async () => {
        let response = await fetch(`/api/find-gamers/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          let data = await response.json();
          setStore({ posts: data.results });
          return true;
        } else console.log("Error", response.status);
        if (response.status === 401) {
          getActions().logOutUser();
        }
        return false;
      },

      getComments: async () => {
        let response = await fetch(`/api/find-gamers/comments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          let data = await response.json();
          setStore({ comments: data.results });
          return true;
        } else console.log("Error", response.status);
        if (response.status === 401) {
          getActions().logOutUser();
        }
        return false;
      },

      getProfiles: async (data) => {
        let response = await fetch(`/api/user-profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          let data = await response.json();
          setStore({ profiles: data.results });
          return true;
        } else console.log("Error", response.status);
        if (response.status === 401) {
          getActions().logOutUser();
        }
        return false;
      },

      getMessage: () => {
        // fetching data from the backend
        fetch(process.env.BACKEND_URL + "/api/hello")
          .then((resp) => resp.json())
          .then((data) => setStore({ message: data.message }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
      },
    },
  };
};

export default getState;
