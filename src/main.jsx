//::================================>>Core library<<================================::
//::================================================================================::

//::================================>>Third party<<=================================::
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import { store } from "./redux/store";
import App from "./App.jsx";
//::================================================================================::

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Provider store={store}>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </Provider>
  </ThemeProvider>
);
