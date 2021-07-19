import React from "react";
import {useState} from "react";
import {useHistory, Link} from "react-router-dom";
import axios from 'axios';
import tokens from "../tokenHandler";

// css
import "./login.css"

const Login = () => {
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(""); 

    const fetchTokens = async () => {
        const data = {
            username: username, 
            password: password
        }

        try{
            const response = await axios.post(
                "http://localhost:5000/api/user/login", 
                data
            );
            tokens.setAccessToken(response.data["accessToken"]);
            tokens.setRefreshToken(response.data["refreshToken"]);
            history.push("/");
        }catch(err){
            setErrorMsg(err.response.data.error);
            setPassword("");
        }
    }

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div>
            <h1>Login page</h1>
            {errorMsg !== "" && <p id="errorMsg">{errorMsg}</p>}
            <input type="text" placeholder="username..." className="loginInput" 
            value={username} onChange={usernameChanged}/>
            <input type="password" placeholder="password..." className="loginInput" 
            value={password} onChange={passwordChanged}/>
            <button onClick={fetchTokens} 
            id="loginBtn">Login</button>
            <Link to="/register" id="registerLink">Don't have an account, wanna create one.</Link>
        </div>
    )
}

export default Login;
