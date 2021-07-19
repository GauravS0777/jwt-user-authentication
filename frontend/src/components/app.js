import React, { useState, useEffect } from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import tokens from "../tokenHandler";

// css
import "./app.css"

const App = () => {
    const [username, setUsername] = useState("");
    const history = useHistory();

    if(tokens.getAccessToken() == null) history.push("/login")

    const fetchUsername = async () => {
        console.log("Fetching username.");
        try{
            const response = await axios.get(
                "http://localhost:5000/username", 
                { headers: { "access-token": tokens.getAccessToken() } }
            );
            setUsername(response.data["username"]);
        }catch(err){
            console.log(`error: ${err.response.data.error}`);
            try{
                await tokens.fetchToken()
                fetchUsername();
            }catch(err){
                tokens.clearTokens();
                history.push("/login");
            }
        }
    }

    useEffect(() => {
        fetchUsername();
    })

    const logout = async () => {
        try{
            await axios.delete(
                "http://localhost:5000/api/user/logout", 
                { headers: { "refresh-token": tokens.getRefreshToken() } }
            );
            tokens.clearTokens();
            history.push("/login");
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <h1>Welcome {username}!</h1>
            <button id="logoutBtn" onClick={logout}>Logout</button>  
        </div>
    );
}

export default App;
