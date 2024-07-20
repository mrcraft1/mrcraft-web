// theme.ts

import { createTheme } from '@mui/material/styles';
import { CustomThemeOptions } from './typescriptTypes/themeTypes';


const lightTheme = createTheme({
  typography: {
    fontFamily: ['"Plus Jakarta Sans"'].join(","),
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0277FA",
    },
    secondary: {
      main: "#343f53",
    },
    background: {
      promoCode: "#f2f1f6",
      paper: "#f2f1f6",
      box: "#ffffff",
      card: "white",
      addressBox: "#Fdfdfd",
      input: "white",
      provider: "white",
      booking: "#f9f8f8",
      heading: "#e8e8e8f2",
      categories: "white",
      navLink: "black",
      buttonColor: "#343F53",
    },
    color: {
      navLink: "#282F39",
      logo: "white",
      catLink: "black",
      secondary: "#575757",
      phone: "#2664f7",
      text: "white",
      breadcrum: "#5d5d5d",
      subCatName: "white",
      textColor: "#282F39",
      danger: "#CF2D2D",
      categories: "black",
    },
    fonts: {
      h1: "24pt",
      h2: "20pt",
      h3: "16pt",
      h4: "12pt",
    },
    icons: {
      icon: "black",
    },
  },
  
} as CustomThemeOptions);

const darkTheme = createTheme({
  typography: {
    fontFamily: ['"Plus Jakarta Sans"'],
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#0277FA",
    },
    secondary: {
      main: "#343f53",
    },
    background: {
      promoCode: "#10273C",
      paper: "#041C32",
      box: "#041C32",
      addressBox: "#343F53",
      card: "#343f53",
      input: "#3d3f48",
      provider: "#1b3145",
      booking: "#041C32",
      heading: "#041C32",
      categories: "#11283d",
      navLink: "white",
      buttonColor: "#0277FA",
    },
    color: {
      navLink: "white",
      logo: "white",
      catLink: "white",
      secondary: "white",
      phone: "white",
      text: "black",
      breadcrum: "#5d5d5d",
      subCatName: "white",
      textColor: "white",
      danger: "#CF2D2D",
      categories: "black",
    },
    fonts: {
      h1: "24pt",
      h2: "20pt",
      h3: "16pt",
      h4: "12pt",
    },
    icons: {
      icon: "white",
    },
  },
  
} as CustomThemeOptions);

export { darkTheme, lightTheme };