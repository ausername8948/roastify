import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './SpotifyGetUserData.css'; // Import CSS file for styling

const SpotifyGetUserData = () => {
    const [token, setToken] = useState("");
    const [data, setData] = useState({});
    const [artists, setArtists] = useState([]);
    const [genre, setGenre] = useState([]);
    const [countMap, setCountMap] = useState([]);
    const [artistImages, setArtistImages] = useState([]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    //https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
    }, []);

    

    const handleGetUserData = () => {
        setLoading(true);
        axios.get("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50&offset=0", {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => {
                setData(response.data);
                console.log(response.data);

                const artistNames = response.data.items.slice(0, 5).map(item => item.name);
                const artistImages = response.data.items.slice(0, 5).map(item => item.images[0].url);
                setArtists(artistNames);
                setArtistImages(artistImages);


                const genre = response.data.items.flatMap(item => item.genres);
                const countMap = {};
                genre.forEach((item) => {
                    if (countMap[item]) {
                        countMap[item] += 1;
                    } else {
                        countMap[item] = 1;
                    }
                });

                const sortedArray = Object.entries(countMap).sort(([, a], [, b]) => b - a);
                const array = sortedArray.slice(0, 5).map(item => item[0]);
                setCountMap(array);
                //console.log(array);

    
                    axios.get("https://api.spotify.com/v1/me", {
                      headers: {
                        Authorization: "Bearer " + token,
                      },
                    })
                    .then((profileResponse) => {    
                      const userProfile = profileResponse.data;
                      navigate('/DisplayArtists', { state: { artists: artistNames, artistImages: artistImages, genres: array, userProfile } });
                    })
                    .catch((error) => {
                      console.log("Error fetching user profile:", error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });


            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div>
            <button className="login-button fade-in" onClick={handleGetUserData}>Get Roasted</button>
            
            {loading && <p>Loading...</p>}

        </div>


    );
}


export default SpotifyGetUserData;