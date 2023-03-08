import { useState , useEffect, useContext} from "react";
import HeaderSection from "./components/Header";
import Comments from "./components/Comments";
import UserInput from "./components/UserInput";
import { ThemeContext } from "./utils/ToggleThemeContext";
import config from 'react-reveal/globals';
import Fade from 'react-reveal/Fade'; 
config({ ssrFadeout: true });


function App() {
  const {theme} = useContext(ThemeContext)
  const [now,setNow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setNow(true)
    }, 200);
  })

  return (
    <main className={theme}>
      <Fade when={now}>
        <HeaderSection />
      </Fade>
        <div className="content-container">
           <Comments />
          <UserInput />
        </div>
    </main>
  )
}

export default App
