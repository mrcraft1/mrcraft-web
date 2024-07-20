import { Box, Grid, Paper, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

export const BoxBackground = styled(Box)(({ theme }) => ({
  background: theme.palette.background.heading,
}));

export const BreadcrumbLink = styled(Link)(({ theme }) => ({
  color: theme.palette.color.breadcrum,
}));

export const ContactGrid = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.box,
}));
export const SectionBackground = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.box,
}));

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.provider,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  border: 0,
}));

export const TextFieldTheme = styled(TextField)(({ theme }) => ({
  background: theme.palette.background.paper,
}));

export const BoxDisplay = styled(Box)(({ theme }) => ({
  display: {
    xs: "none",
    md: "block",
  },
}));
