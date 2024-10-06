import React from "react";
import "./WebApp.css";
import SpotifyGetUserData from "../components/SpotifyGetUserData";
import { useEffect } from "react";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize"
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

console.log(REDIRECT_URI);
console.log(CLIENT_ID);

const SCOPES = ["user-top-read"];
const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
        //console.log(currentValue);
        const [key, value] = currentValue.split("=");
        accumulater[key] = value;
        return accumulater;
    }, {});

    return paramsSplitUp;
};

function WebApp() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    useEffect(() => {
        if(window.location.hash) {
            const {
                access_token, 
                expires_in, 
                token_type, 
            } = getReturnedParamsFromSpotifyAuth(window.location.hash);
            //console.log({access_token});

            localStorage.clear();
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("tokenType", token_type);
            localStorage.setItem("expiresIn", expires_in);

            setIsLoggedIn(true);

        }
    }, [])
    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=token&show_dialog=true`;
        
    }
    return (
        <div className="container">
            <div className="logo">
                <img src="/logo.png" alt="Roastify Logo" />
                <h1 className="fade-in">Welcome to Roastify</h1>
            </div>
            <button className="login-button fade-in" onClick={handleLogin} disabled={isLoggedIn}>
                {isLoggedIn ? "You've Logged In" : "Login To Spotify"}
            </button>
            <br/>
            {isLoggedIn && <SpotifyGetUserData />}
        </div>
    );
};

export default WebApp;