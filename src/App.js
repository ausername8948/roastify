
import './App.css';
import WebApp from "./pages/WebApp";
import DisplayArtists from './pages/DisplayArtists';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Switch, Route } from "react-router-dom";
import * as ROUTES from "./constants/routes";




const App = () => {


  return (

    <Router>

      <Routes>
        <Route path="/" element={<WebApp />} /> {/* Default Route */}
        <Route path={ROUTES.WEB_APP} element={<WebApp />} />
        <Route path={ROUTES.DISPLAY} element={<DisplayArtists />} />

      </Routes>
    </Router>
  );
}

export default App;
