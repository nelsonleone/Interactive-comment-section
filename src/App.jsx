import { useState , useEffect, useContext} from "react";
import HeaderSection from "./components/Header";
import Comments from "./components/Comments";
import UserInput from "./components/UserInput";
import { ThemeContext } from "./utils/ToggleThemeContext";
import config from 'react-reveal/globals';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade'; 
config({ ssrFadeout: true });


function App() {
  const {theme} = useContext(ThemeContext)


  return (
    <main className={theme}>
      <Fade>
        <HeaderSection />
      </Fade>
        <div className="content-container">
          <Zoom>
           <Comments />
          </Zoom>
          <UserInput />
        </div>
    </main>
  )
}

export default App
