'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Pagination } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Importando Grid2
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import PatientCard from '../components/patient-card';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const patient = {
  _id: 1,
  avatar: "https://i.pravatar.cc/150?img=1",
  name: "Juana",
  lastName: "Pérez",
  weight: 70,
  height: 1.75,
  heartrate: 90,
  bloodpresure: "120/80",
  sugarBlood: 80,
  birthDate: "1990-05-15",
  phone: "+525551234567",
  email: "juan.perez@example.com",
  bloodType: "O+",
  allergies: "None",
  gender: "Female",
  familyHistory: "Diabetes",
  medicalHistory: "Hypertenstion",
  emergencyContact: "Ana Pérez",
  emergencyPhone: "+525551234567",
  socialSecurity: "1234567890",
};

const medicalHistory = [
  { date: '2023-01-15', description: 'Consulta general', doctor: 'Dra. María López' },
  { date: '2023-02-10', description: 'Vacunación contra la gripe', doctor: 'Dr. Carlos Ramírez' },
  { date: '2023-03-05', description: 'Revisión de presión arterial', doctor: 'Dra. Ana Fernández' },
  { date: '2023-04-12', description: 'Análisis de sangre', doctor: 'Dr. Eduardo Martínez' },
  { date: '2023-05-22', description: 'Consulta dental', doctor: 'Dra. Patricia Herrera' },
  { date: '2023-06-30', description: 'Chequeo general', doctor: 'Dra. Sofía Gómez' },
  { date: '2023-07-18', description: 'Revisión de vista', doctor: 'Dra. Laura González' },
  { date: '2023-08-20', description: 'Consulta psicológica', doctor: 'Dr. Martín Pérez' },
];

export default function MedicalDashboard() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const paginatedData = medicalHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size={{ xs: 8 }}>
            <Grid container spacing={2}>
              {/* Blood Sugar */}
              <Grid size={{ xs: 4 }}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                  <WaterDropIcon sx={{ fontSize: 40, color: 'orange' }} />
                  <Typography variant="h6" sx={{ mt: 1, color: "primary.main" }}>Blood Sugar</Typography>
                  <Typography variant="h4">{patient.sugarBlood} mg/dL</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color:
                        patient.sugarBlood < 70
                          ? 'blue'
                          : patient.sugarBlood <= 140
                            ? 'green'
                            : 'red',
                    }}
                  >
                    {patient.sugarBlood < 70
                      ? 'Low'
                      : patient.sugarBlood <= 140
                        ? 'Normal'
                        : 'High'}
                  </Typography>
                </Paper>
              </Grid>

              {/* Heart Rate */}
              <Grid size={{ xs: 4 }}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                  <MonitorHeartIcon sx={{ fontSize: 40, color: 'red' }} />
                  <Typography variant="h6" sx={{ mt: 1, color: "primary.main" }}>Heart Rate</Typography>
                  <Typography variant="h4">{patient.heartrate} bpm</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color:
                        patient.heartrate < 60
                          ? 'blue'
                          : patient.heartrate <= 100
                            ? 'green'
                            : 'red',
                    }}
                  >
                    {patient.heartrate < 60
                      ? 'Low'
                      : patient.heartrate <= 100
                        ? 'Normal'
                        : 'High'}
                  </Typography>
                </Paper>
              </Grid>

              {/* Blood Pressure */}
              <Grid size={{ xs: 4 }}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                  <BloodtypeIcon sx={{ fontSize: 40, color: 'blue' }} />
                  <Typography variant="h6" sx={{ mt: 1, color: "primary.main" }}>Blood Pressure</Typography>
                  <Typography variant="h4">{patient.bloodpresure} mmHgc</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: (() => {
                        const [systolic, diastolic] = patient.bloodpresure.split('/').map(Number);
                        if (systolic < 90 || diastolic < 60) return 'blue'; // Low
                        if (systolic <= 120 && diastolic <= 80) return 'green'; // Normal
                        if (systolic > 120 || diastolic > 80) return 'red'; // High
                        return 'black'; // Default fallback
                      })(),
                      mt: 1,
                    }}
                  >
                    {(() => {
                      const [systolic, diastolic] = patient.bloodpresure.split('/').map(Number);
                      if (systolic < 90 || diastolic < 60) return 'Low';
                      if (systolic <= 120 && diastolic <= 80) return 'Normal';
                      if (systolic > 120 || diastolic > 80) return 'High';
                      return 'Unknown'; // Default fallback
                    })()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Citas Médicas */}
            <Grid container spacing={2} sx={{ mt: 7 }}>
              {paginatedData.map((entry, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)', 
                        boxShadow: 6, 
                      },
                    }}
                  >
                    <MedicalInformationIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {entry.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {entry.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Médico: {entry.doctor}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', mt: 40, ml: 50 }}>
                <Pagination
                  count={Math.ceil(medicalHistory.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </Grid>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <PatientCard patient={patient} />
          </Grid>


        </Grid>

        


      </Grid>
    </Box>
  );
}
