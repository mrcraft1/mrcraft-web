// themeTypes.ts

import { Theme as MuiTheme } from '@mui/material/styles';

export interface CustomFonts {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
}

export interface CustomIcons {
  icon: string;
}

export interface CustomColor {
  navLink: string;
  logo: string;
  catLink: string;
  secondary: string;
  phone: string;
  text: string;
  breadcrum: string;
  subCatName: string;
  textColor: string;
  danger: string;
  categories: string;
}

export interface CustomBackground {
  promoCode: string;
  box: string;
  card: string;
  addressBox: string;
  input: string;
  provider: string;
  booking: string;
  heading: string;
  categories: string;
  navLink: string;
  buttonColor: string;
}

export interface CustomPalette {
  color: CustomColor;
  background: CustomBackground;
}

export interface CustomThemeAdditions {
  fonts: CustomFonts;
  icons: CustomIcons;
  customPalette: CustomPalette;
}

export type CustomTheme = MuiTheme & CustomThemeAdditions;

export interface CustomThemeOptions extends Partial<CustomThemeAdditions> {}

declare module '@mui/material/styles' {
  interface Theme extends CustomThemeAdditions {}
  interface ThemeOptions extends CustomThemeOptions {}
}