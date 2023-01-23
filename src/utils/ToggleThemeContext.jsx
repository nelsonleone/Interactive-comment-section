import { useContext , useState} from "react";
import React from "react";

const ThemeContext = React.createContext()

function ToggleThemeProvider(props){
   const [theme,setTheme] = useState("light-theme")

   function toggleTheme(){
      setTheme(prevTheme => {
         return prevTheme === "light-theme" ? "dark-theme" : "light-theme"
      })
   }

   return(
      <ThemeContext.Provider value={{theme,toggleTheme}}>
         {props.children}
      </ThemeContext.Provider>
   )
}

export {ToggleThemeProvider , ThemeContext }