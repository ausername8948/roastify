import React from "react";
import "./WebApp.css";
import SpotifyGetUserData from "../components/SpotifyGetUserData";
import { useEffect } from "react";

const CLIENT_ID = "e6963b533e3146e999e4aa5f2e5e96b5"
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize"
//const CLIENT_SECRET = "582143334cfb4c10809c1f9db38915cf"
const REDIRECT_URI = "http://localhost:3000/webapp"

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

        }
    }, [])
    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=token&show_dialog=true`;
    }
    return (
        <div className="container">
            <div className="logo">
                <h1 className="fade-in">Welcome to Roastify</h1>
            </div>
            <button className="login-button fade-in" onClick={handleLogin}>Login To Spotify</button>
            <br/>
            <SpotifyGetUserData />
        </div>
    );
};

export default WebApp;