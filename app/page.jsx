"use client";

// Imports.
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InventoryIcon from '@mui/icons-material/Inventory';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import {
  Box,
  Container,
  Paper,
  Typography,
  Link,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";

// Home page.
export default function Home() {
  // Theme.
  const theme = useTheme();

  // Options.
  const options = [
    {
      icon: AccountCircleIcon,
      label: "Patients",
      href: "/patients"
    },
    {
      icon: BookIcon,
      label: "Medical Appointments",
      href: "/medial-appointments"
    },
    {
      icon: VaccinesIcon,
      label: "Medicines",
      href: "/medicines"
    },
    {
      icon: LocalHospitalIcon,
      label: "Doctors",
      href: "/doctors"
    },
    {
      icon: HistoryEduIcon,
      label: "Recipes",
      href: "/Recipes"
    },
    {
      icon: ReceiptIcon,
      label: "Billing",
      href: "/billing"
    },
  ];

  // Component.
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} display="flex" justifyContent="center" alignItems="center">
        {/* Left Buttons (3) */}
        <Grid item xs={12} md={3} container direction="column" spacing={2} justifyContent="center">
          {options.slice(0, 3).map((item) => (
            <Grid item xs={12} key={item.label}>
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <Paper
                  elevation={4}
                  sx={{
                    mx: "auto",
                    p: 4,
                    height: "200px",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: 15,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      transform: "scale(1.05)",
                      transition: "transform 0.4s ease-in-out",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                    },
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <item.icon sx={{ fontSize: 55 }} />
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: theme.palette.primary.main,
                      fontSize: "1.6rem",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Image in the center */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <Box
            sx={{
              borderRadius: 50,
              overflow: "hidden",
              width: 380,
              height: 380
            }}
          >
            <Image
              src="/HealthValue.jpg"
              alt="logo"
              width={380}
              height={380}
            />
          </Box>
        </Grid>

        {/* Right Buttons (3) */}
        <Grid item xs={12} md={3} container direction="column" spacing={2} justifyContent="center">
          {options.slice(3).map((item) => (
            <Grid item xs={12} key={item.label}>
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <Paper
                  elevation={4}
                  sx={{
                    mx: "auto",
                    p: 4,
                    height: "200px",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: 15,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      transform: "scale(1.05)",
                      transition: "transform 0.4s ease-in-out",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                    },
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <item.icon sx={{ fontSize: 55 }} />
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: theme.palette.primary.main,
                      fontSize: "1.6rem",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
