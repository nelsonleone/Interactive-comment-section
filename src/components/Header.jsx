import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../utils/ToggleThemeContext";


export default function HeaderSection(){
   const {theme,toggleTheme} = useContext(ThemeContext)
   const [toggledDarkTheme,setToggledDarkTheme] = useState(false)


   const toggledStyle = {
      right: toggledDarkTheme ? "1.2em" : "",
      left:toggledDarkTheme ?  "unset" : ".8em",
      backgroundColor: toggledDarkTheme ? "hsl(211, 10%, 5%)" : "hsl(223, 19%, 93%)"
   }

   const toggledAreaStyle = {
      backgroundColor : toggledDarkTheme ? "hsl(172, 83%, 45%)" : "hsl(238, 40%, 52%)"
   }


   useEffect(() => {
      if(theme === "dark-theme"){
         setToggledDarkTheme(true)
      }else{
         setToggledDarkTheme(false)
      }
   },[theme])

   return(
      <header className="header-section">
         <h1>Interactive Comment Section</h1>
         <p id="toggle-title">Toggle Theme</p>
         <div className="toggle-area" style={toggledAreaStyle}>
            <button 
              className="toggle"
              style={toggledStyle}
              aria-labelledby="toggle-title"
              onClick={() => toggleTheme()}
            >
             ..
            </button>
         </div>
      </header>
   )
}