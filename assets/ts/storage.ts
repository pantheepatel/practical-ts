// import { main } from "./event";
// type themeClassType = "theme_light" | "theme_dark";

// export function changeTheme():void {
//     let themeClass: themeClassType;
//     if (main?.classList.contains("theme_light")) {
//         main.classList.replace("theme_light", "theme_dark"); // dark mode
//         themeClass = "theme_dark";
//     } else {
//         main?.classList.replace("theme_dark", "theme_light"); // light mode
//         themeClass = "theme_light";
//     }

//     try {
//         sessionStorage.setItem('theme', themeClass);
//     } catch (err) {
//         console.error(`error in storing theme: ${err}`)
//     }
// }