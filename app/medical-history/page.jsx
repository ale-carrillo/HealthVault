'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Pagination, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import PatientCard from '../components/patient-card';

export default function MedicalDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [error, setError] = useState(false);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const paginatedData = medicalHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    if (id) {
      fetchPatientData(id);
    }
  }, [id]);

  const fetchPatientData = async (patientId) => {
    try {
      const patientResponse = await axios.get(`http://127.0.0.1:5000/api/v1/patient/${patientId}`);
      setPatient(patientResponse.data);

      try {
        const historyResponse = await axios.get(`http://127.0.0.1:5000/api/v1/medicalappointments/${patientId}`);
        setMedicalHistory(historyResponse.data);
        setError(false); 
      } catch (historyError) {
        if (historyError.response?.status === 404) {
          setMedicalHistory([]); 
          setError(false); 
        } else {
          console.error("Error fetching medical history:", historyError);
          setError(true); 
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError(true);
    }
  };

  if (!patient) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Loading patient data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          An error occurred while fetching data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        color="primary"
        onClick={() => router.push('/patient')}
        sx={{ mb: 3 }}
      >
        Back to Patients
      </Button>

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
                  <Typography variant="h4">{patient.bloodPressure} mmHg</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: (() => {
                        const [systolic, diastolic] = patient.bloodPressure.split('/').map(Number);
                        if (systolic < 90 || diastolic < 60) return 'blue';
                        if (systolic <= 120 && diastolic <= 80) return 'green';
                        return 'red';
                      })(),
                    }}
                  >
                    {(() => {
                      const [systolic, diastolic] = patient.bloodPressure.split('/').map(Number);
                      if (systolic < 90 || diastolic < 60) return 'Low';
                      if (systolic <= 120 && diastolic <= 80) return 'Normal';
                      return 'High';
                    })()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Medical Appointments */}
            {medicalHistory.length > 0 ? (
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
                        {entry.reason}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {entry.datetime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Doctor: {entry.doctor_name}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
                  <Pagination
                    count={Math.ceil(medicalHistory.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </Grid>
            ) : (
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{ textAlign: 'center', mt: 7, width: '100%' }}
              >
                There are no medical appointments yet.
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 4 }}>
            <PatientCard patient={patient} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
