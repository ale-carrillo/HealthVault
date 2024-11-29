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

export default function PatientTable() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [openAlert, setOpenAlert] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [action, setAction] = useState("");

    const [patient, setPatient] = useState({
        avatar: "",
        name: "",
        lastName: "",
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
        if (!phone) return "US"; // Retorna la bandera predeterminada si no hay teléfono

        const countryMap = {
            "52": "MX", // México
            "1": "US", // Estados Unidos
            "44": "GB", // Reino Unido
            "33": "FR", // Francia
            "49": "DE", // Alemania
            "34": "ES", // España
            // Agrega más códigos de país si es necesario
        };

        // Busca el código de país más largo posible en el mapa
        for (const code in countryMap) {
            if (phone.startsWith(`+${code}`)) {
                return countryMap[code]; // Retorna el código de bandera correspondiente
            }
        }

        return "US"; // Retorna la bandera predeterminada si no coincide
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
        { field: "bloodType", headerName: "Blood Type", width: 120 },
        { field: "allergies", headerName: "Allergies", width: 200 },
        { field: "gender", headerName: "Gender", width: 100 },
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
        }
        setOpenAlert(true);
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const actions = [
        { icon: <DeleteIcon />, name: 'Delete' },
        { icon: <EditIcon />, name: 'Edit' },

    ];



    return (
        <Container maxWidth="lg" disableGutters>
            <Typography variant="h3" textAlign="center" sx={{ mt: 1, mb: 3 }}>
                Patient Managment
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Vista Tabla" />
                <Tab label="Vista Tarjetas" />
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
                        autoHeight
                        checkboxSelection
                        disableMultipleRowSelection
                        selectionModel={selectedRow ? [selectedRow._id] : []} // Vincula la selección al estado
                        keepNonExistentRowsSelected
                        onSelectionModelChange={(ids) => {
                            console.log("Selected IDs:", ids); // Depuración
                            const selectedId = ids[0]; // Selecciona el primer ID
                            const selected = rows.find((row) => row._id === selectedId);
                            console.log("Selected Row:", selected); // Depuración
                            setSelectedRow(selected || null);
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
                                    handleDelete(selectedRow._id);
                                    setSelectedRow(null); // Limpia la selección después de eliminar
                                } else {
                                    setAlert({
                                        message: "No patient selected for deletion",
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
                    {/* Tarjetas */}
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
                                    <IconButton onClick={() => handleDelete(row._id)}>
                                        <DeleteIcon sx={{ color: "#F44336" }} />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>

                    {/* Paginación */}
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

        </Container>
    );
}