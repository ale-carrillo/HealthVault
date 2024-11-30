'use client';
import React, { useState } from "react";
import {
    Box,
    Container,
    IconButton,
    Paper,
    Avatar,
    Typography,
    Button,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Flag from "react-world-flags";
import Alerts from "../components/alerts";
import PatientDialog from "../components/patient-dialog";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useRouter } from "next/navigation";
import ConfirmDialog from "../components/confirmation-dialog";

export default function PatientTable() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [openAlert, setOpenAlert] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [action, setAction] = useState("");
    const router = useRouter();


    const [patient, setPatient] = useState({
        avatar: "",
        name: "",
        lastName: "",
        weight: "",
        height: "",
        heartrate: "",
        bloodPressure: "",
        sugarBlood: "",
        birthDate: "",
        phone: "",
        email: "",
        bloodType: "",
        allergies: "",
        gender: "",
        familyHistory: "",
        medicalHistory: "",
        emergencyContact: "",
        emergencyPhone: "",
        socialSecurity: "",
    });


    const [rows, setRows] = useState([
        {
            _id: 1,
            avatar: "https://i.pravatar.cc/150?img=1",
            name: "Juan",
            lastName: "Pérez",
            weight: 78,
            height: 1.75,
            heartrate: 90,
            bloodPressure: 120,
            sugarBlood: 80,
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
        },
        {
            _id: 2,
            avatar: "https://i.pravatar.cc/150?img=2",
            name: "María",
            lastName: "López",
            weight: 78,
            height: 1.75,
            heartrate: 90,
            bloodPressure: 120,
            sugarBlood: 80,
            birthDate: "1985-10-10",
            phone: "+525551234567",
            email: "maria.lopez@example.com",
            bloodType: "A-",
            allergies: "Penicilina",
            gender: "Female",
            familyHistory: "Hipertensión",
            medicalHistory: "Asma",
            emergencyContact: "Carlos López",
            emergencyPhone: "+525551234567",
            socialSecurity: "0987654321",
        },
    ]);

    const [alert, setAlert] = useState({
        message: "",
        severity: "",
    });

    const getCountryCode = (phone) => {
        if (!phone) return "US"; 

        const countryMap = {
            "52": "MX", 
            "1": "US", 
            "44": "GB", 
            "33": "FR", 
            "49": "DE", 
            "34": "ES", 
        };

        for (const code in countryMap) {
            if (phone.startsWith(`+${code}`)) {
                return countryMap[code]; 
            }
        }

        return "US"; 
    };
    const columns = [
        {
            field: "avatar",
            headerName: "Avatar",
            width: 100,
            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.value} sx={{ width: 40, height: 40 }} />
            ),
        },
        { field: "name", headerName: "Name", width: 150 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        {
            field: "weight",
            headerName: "Weight (kg)",
            width: 100,
            valueFormatter: (value) => `${value} kg`, // Muestra el peso en kg
          },
          {
            field: "height",
            headerName: "Height (m)",
            width: 100,
            valueFormatter: (value) => `${value} m`, // Convierte cm a m
          },
            {
                field: "heartrate",
                headerName: "Heart Rate",
                width: 150,
                valueFormatter: (value) => `${value} bpm`,
            },
            {
                field: "bloodPressure",
                headerName: "Blood Pressure",
                width: 150,
                valueFormatter: (value) => `${value} mmHg`,
            },
            {
                field: "sugarBlood",
                headerName: "Blood Sugar",
                width: 150,
                valueFormatter: (value) => `${value} mg/dL`,
            },


        { field: "birthDate", headerName: "Birthdate", width: 150 },


        {
            field: "phone",
            headerName: "Phone",
            width: 200,
            renderCell: (params) => {
                const countryCode = getCountryCode(params.value);
                return (
                    <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
                        <Flag code={countryCode} style={{ width: 20, height: 15, marginRight: 8 }} />
                        <Typography variant="body2">{params.value}</Typography>
                    </Box>
                );
            },
        },

        { field: "email", headerName: "Email", width: 200 },
        { field: "bloodType", headerName: "Blood Type", width: 100 },
        { field: "allergies", headerName: "Allergies", width: 200 },
        { field: "gender", headerName: "Gender", width: 80 },
        { field: "familyHistory", headerName: "Family History", width: 200 },
        { field: "medicalHistory", headerName: "Medical History", width: 300 },
        { field: "emergencyContact", headerName: "Emergency Contact", width: 200 },
        {
            field: "emergencyPhone",
            headerName: "Emergency Phone",
            width: 200,
            renderCell: (params) => {
                const countryCode = getCountryCode(params.value);
                return (
                    <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
                        <Flag code={countryCode} style={{ width: 20, height: 15, marginRight: 8 }} />
                        <Typography variant="body2">{params.value}</Typography>
                    </Box>
                );
            },
        },

        { field: "socialSecurity", headerName: "Social Security", width: 150 },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" onClick={() => handlePatient({ action: "edit", patient: params.row })}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon sx={{ color: "#F44336" }} />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const handlePatient = ({ action, patient }) => {
        try {
            setAction(action);
            setOpenDialog(true);
            setPatient(action === "add" ? { ...patient, id: null } : patient);
        } catch (error) {
            setAlert({
                message: "Failed to open patient dialog",
                severity: "error",
            });
            setOpenAlert(true);
        }
    };



    const handleSave = (newPatient) => {
        try {
            if (action === "add") {
                const newId = rows.length > 0 ? Math.max(...rows.map((r) => r._id)) + 1 : 1;
                setRows((prevRows) => [...prevRows, { ...newPatient, _id: newId }]);
                setAlert({
                    message: "Patient added successfully",
                    severity: "success",
                });
            } else if (action === "edit") {
                setRows((prevRows) =>
                    prevRows.map((row) =>
                        row._id === newPatient._id
                            ? { ...newPatient }
                            : row
                    )
                );
                setAlert({
                    message: "Patient updated successfully",
                    severity: "success",
                });
            }
        } catch (error) {
            setAlert({
                message: "Failed to save patient",
                severity: "error",
            });
        }
        setOpenDialog(false);
        setOpenAlert(true);
    };

    const handleDelete = (id) => {
        try {
          setRows(rows.filter((row) => row._id !== id));
          setAlert({
            message: "Patient deleted successfully",
            severity: "success",
          });
        } catch (error) {
          setAlert({
            message: "Failed to delete patient",
            severity: "error",
          });
        } finally {
          setOpenAlert(true);
        }
      };
    
      // Función para abrir el diálogo de confirmación
      const confirmDeletion = (id) => {
        setSelectedRow(id); // Almacena el ID del elemento a eliminar
        setConfirmOpen(true); // Abre el diálogo
      };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const actions = [
        { icon: <DeleteIcon />, name: 'Delete' },
        { icon: <EditIcon />, name: 'Edit' },
        { icon: <MonitorHeartIcon />, name: 'Medical History' },

    ];

    return (
        <Container maxWidth="lg" disableGutters>
            <Typography variant="h3" textAlign="center" sx={{ mt: 1, mb: 3 }}>
                Patient Managment
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Table View" />
                <Tab label="Card View" />
            </Tabs>

            {tabIndex === 0 && (
                <Paper sx={{ padding: 2, borderRadius: 2, mt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Button startIcon={<AddIcon />} variant="contained" onClick={() => handlePatient({ action: "add" })}>
                            Add Patient
                        </Button>
                    </Box>
                    <DataGrid
                        rows={rows}
                        columns={columns.filter((col) => col.field !== "actions")}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row) => row._id}
                        checkboxSelection
                        disableMultipleRowSelection
                        selectionModel={selectedRow ? [selectedRow._id] : []} 
                        keepNonExistentRowsSelected
                        autosizeOptions={{
                            columns: ["name", "lastName", "email", "phone", "birthDate", "bloodType", "weight","height"],
                            includeOutliers: true,
                            includeHeaders: true,
                          }}
                        onRowSelectionModelChange={(ids) => {
                            console.log(ids);
                            if (ids.length > 0) {
                                const selectedId = ids[0]; 
                                const selected = rows.find((row) => row._id === selectedId);
                                setSelectedRow(selected || null); 
                            } else {
                                setSelectedRow(null);
                            }
                        }}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#333",
                                color: "#000",
                                fontWeight: "bold",
                            },
                            "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
                        }}
                    />

                    <SpeedDial
                        ariaLabel="SpeedDial openIcon example"
                        sx={{ position: 'absolute', bottom: 500, right: 185 }}
                        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                    >
                        <SpeedDialAction
                            icon={<EditIcon />}
                            tooltipTitle="Edit"
                            onClick={() => {
                                if (selectedRow) {
                                    handlePatient({ action: "edit", patient: selectedRow });
                                } else {
                                    setAlert({
                                        message: "No patient selected for editing",
                                        severity: "warning",
                                    });
                                    setOpenAlert(true);
                                }
                            }}
                        />
                        <SpeedDialAction
                            icon={<DeleteIcon />}
                            tooltipTitle="Delete"
                            onClick={() => {
                                if (selectedRow) {
                                  confirmDeletion(selectedRow._id);
                                } else {
                                  setAlert({
                                    message: "No patient selected for deletion",
                                    severity: "warning",
                                  });
                                  setOpenAlert(true);
                                }
                              }}
                        />
                        <SpeedDialAction
                            icon={<MonitorHeartIcon />}
                            tooltipTitle="Medical History"
                            onClick={() => {
                                if (selectedRow) {
                                    router.push(`/medical-history?id=${selectedRow._id}`);
                                } else {
                                    setAlert({
                                        message: "No patient selected for medical history",
                                        severity: "warning",
                                    });
                                    setOpenAlert(true);
                                }
                            }}
                        />
                    </SpeedDial>
                </Paper>

            )}

            {tabIndex === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((row) => (
                            <Card key={row._id} sx={{ width: 250, padding: 2 }}>
                                <CardContent>
                                    <Avatar src={row.avatar} sx={{ width: 50, height: 50, mb: 2 }} />
                                    <Typography variant="h6">
                                        {row.name} {row.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Email: {row.email}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Phone: {row.phone}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton color="primary" onClick={() => handlePatient({ action: "edit", patient: row })}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => confirmDeletion(row._id)}>
                                        <DeleteIcon sx={{ color: "#F44336" }} />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Button
                            variant="outlined"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Previous
                        </Button>
                        <Typography variant="body2" sx={{ mx: 2, alignSelf: "center" }}>
                            Page {currentPage} of {Math.ceil(rows.length / rowsPerPage)}
                        </Typography>
                        <Button
                            variant="outlined"
                            disabled={currentPage === Math.ceil(rows.length / rowsPerPage)}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}
            <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} />
            <PatientDialog
                open={openDialog}
                setOpen={setOpenDialog}
                action={action}
                patient={patient}
                setPatient={setPatient}
                setRows={setRows}
                rows={rows}
                setAlert={setAlert}
                setOpenAlert={setOpenAlert}
                handleSave={handleSave}
            />
            <ConfirmDialog
        open={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        onConfirm={() => {
          handleDelete(selectedRow); // Llama a handleDelete después de confirmar
          setSelectedRow(null); // Limpia el elemento seleccionado
        }}
      />

            

        </Container>
    );
}