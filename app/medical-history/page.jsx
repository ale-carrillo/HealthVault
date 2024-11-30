'use client';

import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HealingIcon from '@mui/icons-material/Healing';
import LogoutIcon from '@mui/icons-material/Logout';
import Grid from '@mui/material/Grid2';
import { ReactSVG } from 'react-svg';

const drawerWidth = 300;

const patient = {
  _id: 1,
  avatar: "https://i.pravatar.cc/150?img=1",
  name: "Juan",
  lastName: "Pérez",
  weight: 70,
  height: 1.75,
  birthDate: "1990-05-15",
  phone: "+525551234567",
  email: "juan.perez@example.com",
  bloodType: "O+",
  allergies: "Ninguna",
  gender: "Male",
  familyHistory: "Diabetes",
  medicalHistory: "Hipertensión",
  emergencyContact: "Ana Pérez",
  emergencyPhone: "+525551234567",
  socialSecurity: "1234567890",
};

const medicalHistory = [
  { date: '2023-01-15', description: 'Consulta general', doctor: 'Dra. María López' },
  { date: '2023-02-10', description: 'Vacunación contra la gripe', doctor: 'Dr. Carlos Ramírez' },
  { date: '2023-03-05', description: 'Revisión de presión arterial', doctor: 'Dra. Ana Fernández' },
];

export default function MedicalDashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedPart, setSelectedPart] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Typography variant="h6" align="center" gutterBottom>
        Cuerpo Humano
      </Typography>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <ReactSVG
          src="/human-body.svg" // Ruta al archivo SVG
          beforeInjection={(svg) => {
            svg.classList.add('interactive-svg');
            svg.setAttribute('style', 'width: 100%; height: auto;');
          }}
          afterInjection={(error) => {
            if (error) console.error('Error al cargar SVG:', error);
          }}
          onClick={(event) => {
            const part = event.target.getAttribute('id'); // Identifica la parte del cuerpo clicada
            setSelectedPart(part || 'Desconocido');
          }}
        />
        {selectedPart && (
          <Typography sx={{ mt: 2 }}>
            Parte seleccionada: <strong>{selectedPart}</strong>
          </Typography>
        )}
      </Box>
      <List>
        <ListItem button='true'>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Perfil del Paciente" />
        </ListItem>
        <ListItem button='true'>
          <ListItemIcon>
            <MedicalServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Historial Médico" />
        </ListItem>
        <ListItem button='true'>
          <ListItemIcon>
            <VaccinesIcon />
          </ListItemIcon>
          <ListItemText primary="Vacunas" />
        </ListItem>
        <ListItem button='true'>
          <ListItemIcon>
            <HealingIcon />
          </ListItemIcon>
          <ListItemText primary="Tratamientos" />
        </ListItem>
        <ListItem button='true'>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#2196f3',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Historial Médico de {patient.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Grid container spacing={3}>
          {/* Historial Médico */}
          <Grid xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Historial Médico
            </Typography>
            <Grid container spacing={2}>
              {medicalHistory.map((entry, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="subtitle1">
                      Fecha: {entry.date}
                    </Typography>
                    <Typography>Descripción: {entry.description}</Typography>
                    <Typography>Médico: {entry.doctor}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Información del Paciente */}
          <Grid xs={12} md={4}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                alt={patient.name}
                src={patient.avatar}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  {patient.name} {patient.lastName}
                </Typography>
                <Typography align="center" sx={{ mb: 2 }}>
                  Fecha de Nacimiento: {patient.birthDate}
                </Typography>
                <Typography>Correo: {patient.email}</Typography>
                <Typography>Teléfono: {patient.phone}</Typography>
                <Typography>Tipo de Sangre: {patient.bloodType}</Typography>
                <Typography>Alergias: {patient.allergies}</Typography>
                <Typography>Contacto Emergencia: {patient.emergencyContact}</Typography>
                <Typography>Tel. Emergencia: {patient.emergencyPhone}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

