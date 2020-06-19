// <!--Michael Rokitko 334060893-->
// <!--Yevgeny Alterman 317747814-->
// <!--Edan Azran 309743201-->



import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {
    createMuiTheme,
    makeStyles,
    ThemeProvider
} from "@material-ui/core/styles";
import MyApp from './MyApp'


const plantyColor = "#6f9e04";


const theme = createMuiTheme({
    // status: {
    //   danger: orange[500]
    // },
    palette: {
        primary: { 500: plantyColor },
        secondary: {
            light: "#ffee58",
            main: "#ffeb3b"
                // dark: will be calculated from palette.secondary.main,
                // contrastText: "#ffcc00"
        }
    }
});

ReactDOM.render( <
    React.StrictMode >
    <
    ThemeProvider theme = { theme } > { /*<CookiesProvider>*/ } { /*<App />*/ } <
    MyApp / > { /*</CookiesProvider>*/ } <
    /ThemeProvider> <
    /React.StrictMode>,
    document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();