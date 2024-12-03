import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Container,
  useTheme,
  Typography,
  IconButton,
  Autocomplete
} from "@mui/material";
import * as React from "react";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid2";

import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

{/*Importing Material-UI Icons*/}
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import { MEDICALAPPOINTMENTS_API } from "../constants/medical-appointments/constants";

export default function MedicalAppointmentDialog({
  open,
  setOpen,
  medicalappointment,
  setMedicalAppointment,
  action,
  rows,
  setRows,
  setAlert,
  setOpenAlert,       
  selectedPatient,
  setselectedPatient,
  handlePatientsChange,
  patientsList,
  setPatientsList,
  fetchPatientsList,
  selectedDoctor,
  setselectedDoctor,
  handleDoctorsChange,
  doctorsList,
  setDoctorsList,
  fetchDoctorsList
}) {

  {/*Theme*/}
  const theme = useTheme();

  {/*Function to close the dialog*/}
  const handleCloseDialog = () => {
    setReasonError(false);
    setOpen(false);
  };

  const [fieldErrors, setFieldErrors] = useState({
    patient: false,
    doctor: false,
    reason: false,
    date: false,
  });

  {/*Function to save the medicalappointment*/}
  const saveMedicalAppointment = async () => {
    
    const patientNoValid = !selectedPatient || !selectedPatient.name;
    const doctorNoValid = !selectedDoctor || !selectedDoctor.name;
    const reasonNoValid = !medicalappointment.reason || medicalappointment.reason.trim() === "";
    const dateNoValid = !medicalappointment.date || !dayjs(medicalappointment.date).isValid();
  
    setFieldErrors({
      patient: patientNoValid,
      doctor: doctorNoValid,
      reason: reasonNoValid,
      date: dateNoValid,
    });

    if (patientNoValid || doctorNoValid || reasonNoValid || dateNoValid) {
      setAlert({
        message: "Please fill all the required fields",
        severity: "warning",
      });
      setOpenAlert(true);
      return;
    }

    const combinedDateTime = dayjs(medicalappointment.date).set('hour', time.hour()).set('minute', time.minute());
    const medicalappointmentWithDateOnly = {
       ...medicalappointment,
       date: combinedDateTime.format("DD MMM YYYY HH:mm"),
       patient: selectedPatient.name,
       patient_id: selectedPatient._id,
       doctor: selectedDoctor.name,
       doctor_id: selectedDoctor._id
    };
 
    if (action === "add") {
      try{
        const response = await axios.post(MEDICALAPPOINTMENTS_API, medicalappointmentWithDateOnly)
        setRows([...rows, response.data])
        setAlert({
          message: "Reservation added successfully",
          severity: "success"
        });
      }catch(error){
        console.error("Error adding medicalappointment:", error)
        setAlert({
          message: "Failed to add medicalappointment",
          severity: "error"
        });
      }
      setOpenAlert(true);
    } else if (action === "edit") {
      try{
        console.log(`${MEDICALAPPOINTMENTS_API}/${medicalappointmentWithDateOnly._id}`);

        const response = await axios.put(`${MEDICALAPPOINTMENTS_API}/${medicalappointmentWithDateOnly._id}`, medicalappointmentWithDateOnly);
        console.log(`${MEDICALAPPOINTMENTS_API}/${medicalappointmentWithDateOnly._id}`);
        setRows(rows.map((row) => (row._id === medicalappointmentWithDateOnly._id ? response.data : row)))
        setAlert({
          message: "Reservation updated successfully",
          severity: "success"
        });
      }catch(error){
        console.error("Error updated medicalappointment:", error)
        setAlert({
          message: "Failed to update medicalappointment",
          severity: "error"
        });
      }
      setOpenAlert(true);
    }
    handleCloseDialog();
 };

 {/*Function to handle changes in text fields*/}
  const handleChange = (event) => {
    setMedicalAppointment({
      ...medicalappointment,
      [event.target.name]: event.target.value,
    });
  };

  {/*Minimum date for date picker*/}
  const minDate = dayjs();

  const [reasonError, setReasonError] = useState(false);

  const validateReason = (value) => {
    // Check if the reason is not empty and does not exceed 255 characters
    return value && value.trim() !== "" && value.length <= 255;
  };
  
  const handleBlur = (e, label) => {
    validateFields(e.target.value, label);
  };


  {/*Function to validate fields*/}
  const validateFields = (value, label) => {
    let isValid = false;
    if (label === "Reason") {
      isValid = validateReason(value);
    setReasonError(!isValid);
    if (!isValid) {
      let message = value.trim() === ""
        ? "Reason cannot be empty."
        : "Reason cannot exceed 255 characters.";
      setAlert({ message, severity: "error" });
      setOpenAlert(true);
      console.warn(message);
      }
    } 
    return !isValid;
  }

  const [time, setTime] = useState(dayjs().set("hour", 8).set("minute", 0));  

  {/*Function to be able to change the hours with a limit of 8 am to 11 pm*/}
  const changeHours = (amount) => {
    let newHour = time.hour() + amount;
  
    if (newHour < 8) {
      newHour = 23;
    } else if (newHour > 23) {
      newHour = 8;
    }
  
    setTime(time.set("hour", newHour));
  };

  {/*Function to change the minutes from 15 to 15*/}
  const changeMinutes = (amount) => {
    let newMinute = time.minute() + amount * 15;
  
    if (newMinute >= 60) {
      newMinute = 0;
      changeHours(1);  
    } else if (newMinute < 0) {
      newMinute = 45;
      changeHours(-1);  
    }

  setTime(time.set("minute", newMinute));
};

{/*Function to manage time change*/}
const handleDateChange = (newDate) => {
  if (newDate && newDate.isValid()) {
    setMedicalAppointment({ ...medicalappointment, date: newDate });
  }
};

{/*Function to not change the medicalappointment time */}
useEffect(() => {
  if (open && medicalappointment.date) {
    const dateTime = dayjs(medicalappointment.date, "DD MMM YYYY HH:mm");
    setTime(dateTime);
  }
}, [open, medicalappointment.date]);

  

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
      <DialogTitle>{action === "add" ? "Add Reservation" : "Edit Reservation"}</DialogTitle>
      
      {/*Reservation information*/}
      <DialogContent>

        {/*Choose date and time*/}
        <Container>
          <Typography variant="h4" color={theme.palette.primary.main} gutterBottom>
            Date & Time
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} mb={4}>
            Select the date and time of the medical appointment
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    minDate={minDate}
                    disableOpenPicker
                    displayStaticWrapperAs="desktop"
                    sx={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
              </Paper>
            </Grid>
            <Grid  xs={12} md={6}>
              <Paper
                  elevation={2}
                  sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  }}
              >
                  <Grid container spacing={2} alignItems="center" justifyContent="center">

                  <Grid >
                      <IconButton onClick={() => changeHours(1)}>
                      <ArrowUpwardIcon />
                      </IconButton>
                      <Typography variant="h3">{time.format("HH")}</Typography>
                      <IconButton onClick={() => changeHours(-1)}>
                      <ArrowDownwardIcon />
                      </IconButton>
                  </Grid>

                  <Grid >
                      <Typography variant="h3">:</Typography>
                  </Grid>

                  <Grid >
                      <IconButton onClick={() => changeMinutes(1)}>
                      <ArrowUpwardIcon />
                      </IconButton>
                      <Typography variant="h3">{time.format("mm")}</Typography>
                      <IconButton onClick={() => changeMinutes(-1)}>
                      <ArrowDownwardIcon />
                      </IconButton>
                  </Grid>
                  <Grid >
                      <Typography variant="h3">hrs</Typography>
                  </Grid>
                  </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/*Appointment details*/}
        <Container sx= {{mt:4}}>

        <Typography variant="h4" color={theme.palette.primary.main} gutterBottom>
          Appointment details
          </Typography>

          <Grid
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: '100%'}}
          >

        
              <Grid container
                  sx={{ width: '100%', mb: 4, alignItems: "center"}}
              >
                <Grid size={{ xs: 12, md: 1 }}>
                  <AccountCircleIcon />
                </Grid>
                <Grid size={{ xs: 12, md: 11 }}>
                  <Autocomplete
                    sx={{mt:2}}
                    options={patientsList}
                    getOptionLabel={(option) => option.name || 'Name required'}
                    renderInput={(params) => (
                    <TextField {...params}
                    label="Select a patient (required)"
                    variant="outlined"
                    error={fieldErrors.patient}
                    helperText={fieldErrors.patient ? "Patient is required" : ""}
                    
                    />
                    )}
                    onChange={ handlePatientsChange}
                    value={selectedPatient} 
                    isOptionEqualToValue={(option, value) => option.id === value.id} 
                  />
                </Grid>

              </Grid>
              <Grid container
                  sx={{ width: '100%', mb: 4, alignItems: "center"}}
              >
                <Grid size={{ xs: 12, md: 1 }}>
                  <BadgeIcon />
                </Grid>
                <Grid size={{ xs: 12, md: 11 }}>
                  <Autocomplete
                    sx={{mt:2}}
                    options={doctorsList}
                    getOptionLabel={(option) => option.name || 'Name required'}
                    renderInput={(params) => (
                    <TextField {...params} label="Select a doctor (required)" variant="outlined"
                    
                    error={fieldErrors.doctor}
                    helperText={fieldErrors.doctor ? "Doctor is required" : ""} />
                    )}
                    onChange={ handleDoctorsChange}
                    value={selectedDoctor} 
                    isOptionEqualToValue={(option, value) => option.id === value.id} 
                  />
                </Grid>
              </Grid>   
              <Grid container
                  sx={{ width: '100%', mb: 4, alignItems: "center"}}
              >
                <Grid size={{ xs: 12, md: 1 }}>
                  <EditNoteIcon />
                </Grid>
                <Grid size={{ xs: 12, md: 11 }}>
                  <TextField
                    label="Reason (required)"
                    variant="filled"
                    color="primary"
                    fullWidth
                    name="reason"
                    value={medicalappointment.reason}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur(e, 'Reason')} 
                    error={fieldErrors.reason}
                    helperText={fieldErrors.reason ? "Reason is required" : ""}
                    sx={{
                      width: '100%',
                      border: "none",
                    }}
                  />
                </Grid>
              </Grid>
             
        </Grid>



        </Container>

      </DialogContent>

      {/*Exit buttons*/}
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={saveMedicalAppointment} color="primary" variant="contained" >
          {action === "add" ? "Add" : "Edit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
