import React from 'react';
import { useLocation } from 'react-router-dom';
import './DisplayArtists.css'; // Import CSS file for styling
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";



const DisplayArtists = () => {
  const location = useLocation();
  const { artists = [], artistImages = [], genres = [], userProfile = {} } = location.state || {};
  const [roast, setRoast] = useState("");
  //console.log(genres);
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ]
  const handleRoastMe = async (mode = 'default') => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: safetySettings,
      });
      let prompt = `Roast me based on my music taste. BE EXTREMELY MEAN. Artists: ${artists.join(', ')}. Genres: ${genres.join(', ')}`;
      if (mode === 'genz') {
        prompt = `Using Gen-Z slang, and "brainrot language" commonly used on social media, roast based on my music taste. Artists: ${artists.join(', ')}. Genres: ${genres.join(', ')}`;
      }
      ;
      const result = await model.generateContentStream(prompt);


      setRoast('');


      const typeText = (text, delay = 5) => {
        return new Promise((resolve) => {
          let index = -1;
          const interval = setInterval(() => {
            index++;
            if (index === text.length) {
              clearInterval(interval);
              resolve();
              speakText(text);
            }
            if (text[index] && text[index] !== '*') {
              setRoast(prevRoast => prevRoast + text[index]);
            }
          }, delay);
        });
      };

      // Print text as it comes in
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        console.log(chunkText); // Debugging: Log the chunk text to see what's being received
        await typeText(chunkText); // Wait for the current chunk to finish typing before processing the next one
      }

    } catch (error) {
      console.error('Error fetching roast:', error);
      setRoast('Failed to get a roast. Please try again later.');
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Select a specific voice by name or other criteria
    const selectedVoice = voices.find(voice => voice.name === 'Google UK English Female');

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container fade-in">
      <div className="top-row fade-in">
        <div className="left-top-section fade-in">
          <ul className="bullet-points fade-in">
            <li>{genres[0]} addict</li>
            <li>{genres[1]} enjoyer</li>
            <li>{genres[2]} enthusiast</li>
          </ul>
          <div className="bottom-section fade-in">
            <div className="profile-picture-container fade-in">
              {userProfile.images && userProfile.images[0] && (
                <img src={userProfile.images[0].url} alt={userProfile.display_name} className="profile-picture fade-in" />
              )}
              <h1 className="user-name fade-in">{userProfile.display_name}</h1>
            </div>
            <div className="buttons-container fade-in">
              <button className="roast-button fade-in" onClick={() => handleRoastMe('default')}>Roast Me</button>
              <button className="roast-button fade-in" onClick={() => handleRoastMe('genz')}>Gen-Z Mode</button>
            </div>
          </div>
        </div>
        <div className="top-right-section fade-in">
          {roast && (
            <div className="roast-output fade-in">
              <p>{roast}</p>
            </div>
          )}
        </div>
      </div>
      <div className="bottom-row fade-in">
        <div className="artists fade-in">
          {artists.map((artist, index) => (
            <div key={index} className="artist fade-in">
              {artistImages[index] ? (
                <img src={artistImages[index]} alt={artist} className="artist-image fade-in" />
              ) : (
                <img src="default-image-url.jpg" alt="default" className="artist-image fade-in" />
              )}
              <p className="artist-name fade-in">{artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayArtists;