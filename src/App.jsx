//::================================>>Core library<<================================::
import { useContext, useEffect } from "react";
//::================================================================================::

//::================================>>Third party<<=================================::
import { BrowserRouter as Router } from "react-router-dom";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import AdminRoute from "./routes/AdminRoute";
import UserRole from "./utils/help/UserRole";
import AuthRoute from "./routes/AuthRoute";
import "./App.scss";
//::================================================================================::

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  //::==>> get currect role in localstorage
  const role = localStorage.getItem("role");

  //::==>> start adding dark-mode class
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);
  //::==>> end adding dark-mode class

  //::==>> start render route
  const renderRoutes = () => {
    //::==>> render page route by role
    if (role === UserRole.admin) return <AdminRoute />;
    else return <AuthRoute />;
  };
  //::==>> end render route

  return (
    <>
      <Router>
        {/*==========>> start render route <<==========*/}
        {renderRoutes()}
        {/*==========>> end render route <<==========*/}

        {/*==========>> start switch theme <<==========*/}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
        {/*==========>> end switch theme <<==========*/}
      </Router>
    </>
  );
}

export default App;
