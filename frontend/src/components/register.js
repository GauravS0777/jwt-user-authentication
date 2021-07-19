import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Link} from "react-router-dom";
import axios from 'axios';

// css
import "./register.css";

function Register(){
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const usernameChanged = (event) => {
        setUsername(event.target.value);
    }

    const emailChanged = (event) => {
        setEmail(event.target.value);
    }

    const passwordChanged = (event) => {
        setPassword(event.target.value);
    }

    const register = async () => {
        const data = {
            username: username,
            email: email,
            password: password
        }

        try{
            await axios.post(
                "http://localhost:5000/api/user/register", 
                data
            );
            history.push("/login");
        }
        catch(err){
            setErrorMsg(err.response.data.error);
            setPassword("");
        }
    }

    return (
        <div>
            <h1>Signup page</h1>
            {errorMsg !== "" && <p id="errorMsg">{errorMsg}</p>}
            <input type="text" placeholder="username..." className="signupInput" 
            value={username} onChange={usernameChanged}/>
            <input type="text" placeholder="email..." className="signupInput" 
            value={email} onChange={emailChanged}/>
            <input type="password" placeholder="password..." className="signupInput" 
            value={password} onChange={passwordChanged}/>
            <button id="signupBtn" onClick={register}>Register</button>
            <br />
            <Link to="/login" id="loginLink">Already have an account.</Link>
        </div>
    )
}

export default Register;
