import React from "react";
import ReactDom from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

// components
import App from "./components/app";
import Register from "./components/register";
import Login from "./components/login"

// css
import "./index.css";

const root = document.getElementById("root");
ReactDom.render(
    <Router>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
    </Switch>
    </Router>, root
);
