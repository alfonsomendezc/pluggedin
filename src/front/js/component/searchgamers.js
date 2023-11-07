import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import { Boxuser } from "../component//boxuser";

export const Searchgamers = () => {
  const { store, actions } = useContext(Context);
  const history = useHistory();
  const [Searchthis, setSearchthis] = useState("");

  useEffect(() => {
    actions.getProfiles();
  }, []);

  return (
    <div>
      <form action="#">
        <div className="form-group d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Ingresa usuario"
            onChange={(e) => setSearchthis(e.target.value)}
          />
        </div>
      </form>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4 text-center">
          {store.profiles
            .filter((search) => {
              if (Searchthis == "") {
                return search;
              } else if (
                search.username.toLowerCase().includes(Searchthis.toLowerCase())
              ) {
                return search;
              }
            })
            .map((search, index) => {
              return (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <Boxuser
                    image={search.image}
                    username={search.username}
                    region={search.region}
                    profile_user_id={search.user_id}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
