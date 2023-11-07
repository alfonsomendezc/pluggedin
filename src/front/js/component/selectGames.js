import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


export const SelectGames = () => {

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;


  const { store, actions } = useContext(Context);
  const history = useHistory();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });



  return (
    <>
      {store.games.results &&
      <ThemeProvider theme={darkTheme}>    
      <Autocomplete
      multiple
      id="checkboxes-games"
      options={store.games.results}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
          <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            />
          {option.name}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Juegos Favoritos" />
      )}
      />
      </ThemeProvider>
      }
    </>
  );
};
