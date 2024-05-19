//::================================>>Core library<<================================::
import { createContext, useState } from "react";
//::================================================================================::

//::================================>>Third party<<=================================::
import PropTypes from "prop-types";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
//::================================================================================::

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(window.localStorage.getItem("themeMode"));
  //::==>> storing in the local storage
  window.localStorage.setItem("themeMode", theme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
    );
    window.localStorage.setItem("themeMode", theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
