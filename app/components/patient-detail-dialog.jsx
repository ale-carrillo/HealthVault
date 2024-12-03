"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Stack,
  Divider,
  
} from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function PatientDetailDialog({ open, onClose, patient }) {
  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" ,color:'primary'}}>
        Patient Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          {patient.avatar && (
            <Avatar
              src={patient.avatar}
              alt={`${patient.name} ${patient.lastName}`}
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                border: "4px solid #1976d2",
              }}
            />
          )}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" ,color:'primary'}}>
            {`${patient.name} ${patient.lastName}`}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {patient.gender}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold" ,color:'primary'}}>
            General Information
          </Typography>
          <Grid container spacing={2}>
            <Grid  xs={6}>
              <Typography variant="body2">
                <strong>Weight:</strong> {patient.weight} kg
              </Typography>
              <Typography variant="body2">
                <strong>Height:</strong> {patient.height} m
              </Typography>
              <Typography variant="body2">
                <strong>Birth Date:</strong> {patient.birthDate}
              </Typography>
            </Grid>
            <Grid  xs={6}>
              <Typography variant="body2">
                <strong>Blood Type:</strong> {patient.bloodType}
              </Typography>
              <Typography variant="body2">
                <strong>Allergies:</strong> {patient.allergies}
              </Typography>
              <Typography variant="body2">
                <strong>Gender:</strong> {patient.gender}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color:'primary'}}>
            Vital Signs
          </Typography>
          <Grid container spacing={2}>
            <Grid  xs={6}>
              <Typography variant="body2">
                <strong>Heart Rate:</strong> {patient.heartrate} bpm
              </Typography>
              <Typography variant="body2">
                <strong>Blood Pressure:</strong> {patient.bloodPressure}
              </Typography>
            </Grid>
            <Grid  size={{xs:6}}>
              <Typography variant="body2">
                <strong>Blood Sugar:</strong> {patient.sugarBlood} mg/dL
              </Typography>
            </Grid>
          </Grid>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color:'primary'}}>
            Medical History
          </Typography>
          <Typography variant="body2">
            <strong>Family History:</strong> {patient.familyHistory}
          </Typography>
          <Typography variant="body2">
            <strong>Medical History:</strong> {patient.medicalHistory}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

