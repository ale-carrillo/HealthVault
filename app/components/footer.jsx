"use client";
import React from "react";
import {
  Box,
  Container,
  Link,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Facebook, Twitter, YouTube } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", p: 8, mt: 4 }}>
      <Grid container spacing={4}>
        <Grid xs={12} md={3}>
          <Typography variant="h6" component="div" gutterBottom>
            <Box
              sx={{
                borderRadius: 50,
                overflow: "hidden",
                width: 100,
                height: 100,
              }}
            >
              <Image
                src="/healthvault.png"
                alt="HealthValue Logo"
                width={100}
                height={100}
              />
            </Box>
          </Typography>
        </Grid>

        <Grid xs={6} md={2}>
          <Typography variant="subtitle1" gutterBottom>
            Our Services
          </Typography>
          <Link href="#" variant="body2" display="block" color="textSecondary">
            Medical Consultations
          </Link>
          <Link href="#" variant="body2" display="block" color="textSecondary">
            Diagnostic Imaging
          </Link>
          <Link href="#" variant="body2" display="block" color="textSecondary">
            Laboratory Tests
          </Link>
        </Grid>

        <Grid xs={6} md={2}>
          <Typography variant="subtitle1" gutterBottom>
            Resources
          </Typography>
          <Link href="#" variant="body2" display="block" color="textSecondary">
            Patient Portal
          </Link>
          <Link href="#" variant="body2" display="block" color="textSecondary">
            Insurance Information
          </Link>
          <Link href="#" variant="body2" display="block" color="textSecondary">
            Health Tips
          </Link>
        </Grid>

        <Grid xs={6} md={2}>
          <Typography variant="subtitle1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2" display="block" color="textSecondary">
            Phone: +1 (555) 123-4567
          </Typography>
          <Typography variant="body2" display="block" color="textSecondary">
            Email: info@healthvalue.com
          </Typography>
          <Typography variant="body2" display="block" color="textSecondary">
            Address: 123 Health Ave, Suite 100
          </Typography>
        </Grid>

        <Grid xs={12} ml="auto">
          <Typography variant="subtitle1" gutterBottom>
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Get the latest updates on health and wellness.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              size="small"
              sx={{ mr: 1, flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          borderTop: 1,
          borderColor: "#e0e0e0",
          mt: 4,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Select defaultValue="English" size="small" sx={{ minWidth: 100 }}>
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
        </Select>
        <Typography variant="body2" color="textSecondary">
          © 2024 HealthValue, Inc. •{" "}
          <Link href="#">Privacy</Link> • <Link href="#">Terms</Link> •{" "}
          <Link href="#">Sitemap</Link>
        </Typography>
        <Box>
          <IconButton
            href="#"
            color="inherit"
            sx={{
              "&:hover": {
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                transform: "scale(1.2)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
          >
            <Twitter />
          </IconButton>
          <IconButton
            href="#"
            color="inherit"
            sx={{
              "&:hover": {
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                transform: "scale(1.2)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            href="#"
            color="inherit"
            sx={{
              "&:hover": {
                backgroundColor: "#e3f2fd",
                color: "#FF0000",
                transform: "scale(1.2)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
          >
            <YouTube />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
