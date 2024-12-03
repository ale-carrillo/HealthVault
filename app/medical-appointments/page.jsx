"use client";

import * as React from 'react';
import dayjs from 'dayjs';
import { Chip, IconButton, Paper, Box, Container, useTheme, Typography, Button, InputBase, TextField } from '@mui/material';

import { useState, useEffect  } from "react";

import { DataGrid } from "@mui/x-data-grid";
import Alerts from "../components/alerts";
import MedicalAppointmentDialog from "../components/medical-appointments-dialog";
import Link from "next/link"

{/*Importing Material-UI Icons*/}
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';

import axios from "axios";
import { MEDICALAPPOINTMENTS_API } from "../constants/medical-appointments/constants";


export default function MedicalAppointment() {

  const [rows, setRows] = useState();

  {/*Definition of table columns*/}
  const columns = [
    { field: "date", headerName: "Date", flex: 2 },
    { field: "patient", headerName: "Patient", flex: 1 },
    { field: "doctor", headerName: "Doctor", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 2 },
    { field: "status", headerName: "Status", flex: 1,

      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Cancelled" ? "error" :
            params.value === "Pending" ? "warning" : "success"
          }

          sx={{ color: "#FFF", fontWeight: "bold"  }}
        />
      ),
     },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          {params.row.status === "Pending" && (
            <>
              <Link href={`/recipe?id=${params.row._id}`}>
                <IconButton
                  color="primary"
                >
                  <AssignmentIcon />
                </IconButton>  
              </Link>
              <IconButton
                color="primary"
                onClick={() => handleMedicalAppointment({ action: "edit", medicalappointment: params.row })}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => cancelMedicalAppointment(params.row._id, params.row)}
              >
                <CancelIcon />
              </IconButton>

            </>
          )}
          {params.row.status==="Completed" && (
            <>
              <Link href={`/payments?id=${params.row.recipe_id}`}>
                <IconButton
                  color="primary"
                >
                  <PaymentIcon />
                </IconButton>  
              </Link>
     
            </>
          )}
        </Box>
      ),
    },
  ];

  const [action, setAction] = useState("");

  {/*Status to handle medicalappointment details*/}
  const [medicalappointment, setMedicalAppointment] = useState({
    _id: null,
    date: dayjs().format("DD MMM YYYY HH:mm"),
    patient: "",
    doctor: "",
    reason: "",
    status: "",
  });

  const [openDialog, setOpenDialog] = useState(false);


  {/*For search patients*/}
  const [selectedPatient, setselectedPatient] = useState({});

  const handlePatientsChange = (event, newValue) => {
      setselectedPatient(newValue);
      if (newValue) {
        console.log('Selected patient ID:', newValue._id);
      } else {
        console.log('No patient selected');
      }
  };

  const [patientsList, setPatientsList] = useState([]);

  useEffect(() => {
    fetchPatientsList();
    fetchDoctorsList();
  }, []);

  const fetchPatientsList = async () => {
    try {
        const response = await axios.get(`${MEDICALAPPOINTMENTS_API}/patients`)
        setPatientsList(response.data)
        console.log(response.data)
    }
    catch (error){
        console.warn("Error fetching patients list:", error);
        setAlert({
            message: "Failed to load patients list",
            severity: "error"
        });
        setOpenAlert(true);
    }
  };


  {/*For search doctors*/}
  const [selectedDoctor, setselectedDoctor] = useState({});

  const handleDoctorsChange = (event, newValue) => {
      setselectedDoctor(newValue);
      if (newValue) {
        console.log('Selected doctor ID:', newValue._id);
      } else {
        console.log('No doctor selected');
      }
  };

  const [doctorsList, setDoctorsList] = useState([]);


  const fetchDoctorsList = async () => {
    try {
        const response = await axios.get(`${MEDICALAPPOINTMENTS_API}/doctors`)
        setDoctorsList(response.data)
        console.log(response.data)
    }
    catch (error){
        console.warn("Error fetching doctors list:", error);
        setAlert({
            message: "Failed to load doctors list",
            severity: "error"
        });
        setOpenAlert(true);
    }
  };

  {/*Function to handle medicalappointment actions*/}
  const handleMedicalAppointment = ({ action, medicalappointment }) => {
    console.log("Handle medicalappointment action: ", action);
    setAction(action);
    setOpenDialog(true);
    if (action == "add") {
      console.log("Preparing to add a new Medical Appointment");
      setMedicalAppointment({
        _id: null,
        date: dayjs().format("DD MMM YYYY HH:mm"),
        patient: "",
        doctor: "",
        reason: "",
        status: "Pending",
      });
      setselectedDoctor(null);
      setselectedPatient(null);
    } else if (action == "edit") {
      console.info("Medical Appointment details:", medicalappointment);
      console.info("Preparing to edit a new medicalappointment");

      const selectedDoctor = doctorsList.find(
        (doctor) => doctor._id === medicalappointment.doctor_id
      );

      const selectedPatient = patientsList.find(
        (patient) => patient._id === medicalappointment.patient_id
      );

      setselectedDoctor(selectedDoctor || null);
      setselectedPatient(selectedPatient || null);

      setMedicalAppointment(medicalappointment);

    } else {
      console.warn("Unknown action:", action);
    }
  };

  {/*Function to delete a medicalappointment*/}
  const cancelMedicalAppointment = async(_id, medicalappointment) => {
    try {
      const response = await axios.put(`${MEDICALAPPOINTMENTS_API}/${_id}`, {
        ...medicalappointment, 
        status: "Cancelled"  
      });

      setRows(rows.map((row) => 
        row._id === _id ? { ...row, status: "Cancelled" } : row
      ));
        setAlert({
            message: "Medical Appointment cancelled successfully!",
            severity: "success",
        });
        setOpenAlert(true);
        console.info("Medical Appointment cancelled successfully!");
      }
    catch (error) {
        console.error("Error cancelling medicalappointment:", error);
        setAlert({
          message: "Failed to cancel medicalappointment",
          severity: "error"
        });
        setOpenAlert(true);
    }
  };

  {/*Theme */}
  const theme = useTheme();

  const [value, setValue] = useState(0);

  const [selected, setSelected] = useState("DebitCredit");
  const handleSelection = (option) => {
    setSelected(option);
  };

const [openAlert, setOpenAlert] = useState(false);

const [alert, setAlert] = useState({
  message: "",
  severity: "",
});

useEffect(() => {
  fetchMedicalAppointment();
}, []);
const fetchMedicalAppointment = async () => {
  try {
      const response = await axios.get(MEDICALAPPOINTMENTS_API)
      setRows(response.data)
      console.log(response.data)
  }
  catch (error){
      console.warn("Error fetching medicalappointments:", error);
      setAlert({
          message: "Failed to load medicalappointments",
          severity: "error"
      });
      setOpenAlert(true);
  }
};


  return (
    <Container maxWidth="xl" disableGutters>


      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          borderBottom: "4px solid black",
          color: theme.palette.primary.main,
          p: 4,
        }}
      >
        Medical Appointments
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={() => handleMedicalAppointment({ action: "add" })}
        >
          Add Medical Appointment
        </Button>
      </Box>

      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          maxWidth: "80%",
          margin: "0 auto",
          height: "400px",
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{
            border: "1px solid #DDD",
            backgroundColor: "#F9F9F9",
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #DDD",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#F5F5F5",
            },
            "& .MuiDataGrid-cell": {
              borderRight: "1px solid #DDD",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#F1F1F1",
            },
          }}
        />
      </Paper>

      <MedicalAppointmentDialog
        open={openDialog}
        setOpen={setOpenDialog}
        medicalappointment={medicalappointment}
        setMedicalAppointment={setMedicalAppointment}
        selectedPatient={selectedPatient} 
        setselectedPatient={setselectedPatient}
        handlePatientsChange={handlePatientsChange}
        patientsList = {patientsList}
        setPatientsList={setPatientsList}
        fetchPatientsList={fetchPatientsList}
        selectedDoctor={selectedDoctor}
        setselectedDoctor={setselectedDoctor}
        handleDoctorsChange={handleDoctorsChange}
        doctorsList={doctorsList}
        setDoctorsList={setDoctorsList}
        fetchDoctorsList={fetchDoctorsList}
        action={action}
        rows={rows}
        setRows={setRows}
        setAlert={setAlert}
        setOpenAlert={setOpenAlert}
      />
      <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} />
    </Container>
  );
}