"use client";

import * as React from 'react';
import dayjs from 'dayjs';
import { Chip, IconButton, Paper, Box, Container, useTheme, Typography, Button, InputBase, TextField } from '@mui/material';

import { useState, useEffect  } from "react";

import { DataGrid } from "@mui/x-data-grid";
import Alerts from "../components/alerts";
import MedicalAppointmentDialog from "../components/medical-appointments-dialog";

{/*Importing Material-UI Icons*/}
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
          label={params.value ? "Complete" : "Pending"} 
          color={params.value ? "success" : "warning"}
          sx={{ color: "#FFF", fontWeight: "bold"  }}
        />
      ),
     },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleMedicalAppointment({ action: "edit", medicalappointment: params.row })}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => deleteMedicalAppointment(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
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
    status: true,
  });

  const [openDialog, setOpenDialog] = useState(false);


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
        status: false,
      });
    } else if (action == "edit") {
      console.info("Medical Appointment details:", medicalappointment);
      console.info("Preparing to edit a new medicalappointment");
      setMedicalAppointment(medicalappointment);
    } else {
      console.warn("Unknown action:", action);
    }
  };

  {/*Function to delete a medicalappointment*/}
  const deleteMedicalAppointment = async(id) => {

    try {
      await axios.delete(`${MEDICALAPPOINTMENTS_API}/${id}`);
      setRows(rows.filter((row) => row._id !== id));
      setAlert({
          message: "Medical Appointment deleted successfully!",
          severity: "success",
      });
      setOpenAlert(true);
      console.info("Medical Appointment deleted successfully!");
    }
    catch (error) {
        console.error("Error deleting medicalappointment:", error);
        setAlert({
          message: "Failed to delete medicalappointment",
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