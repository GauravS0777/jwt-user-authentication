import axios from "axios";

const getAccessToken = () => localStorage.getItem("access-token");

const setAccessToken = (token) => {
    localStorage.setItem("access-token", token);
}

const getRefreshToken = () => localStorage.getItem("refresh-token");

const setRefreshToken = (token) => {
    localStorage.setItem("refresh-token", token);
}

const fetchToken = async () => {
    try{
        console.log("Fetching new access-token.");
        const response = await axios.post(
            "http://localhost:5000/api/user/token", {},
            { headers: { "refresh-token": tokens.getRefreshToken() } }
        );
        setAccessToken(response.data["accessToken"]);
    }catch(err){
        console.log(`error: ${err.response.data.error}`);
        throw err;
    }
}

const clearTokens = () => {
    localStorage.clear();
}

const tokens = {getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, fetchToken, clearTokens}
export default tokens;
