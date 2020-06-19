// <!--Michael Rokitko 334060893-->
// <!--Yevgeny Alterman 317747814-->
// <!--Edan Azran 309743201-->

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import MyApp from "./MyApp";

const plantyColor = "#6f9e04";

const theme = createMuiTheme({
  palette: {
    primary: { 500: plantyColor },
    secondary: {
      light: "#ffee58",
      main: "#ffeb3b",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MyApp />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
