"use client"; 

import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#274D60"
    },
    secondary: {
      main: "#6BA3BE",
    },
    background: {
      default: "#fefdff",
      date: "#f1f1f1",
    },
    text: {
      primary: "#000000",
      secondary: "#AEAEAE",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: {
      fontWeight: 400,
      color: "#333333",
    },
  },
});