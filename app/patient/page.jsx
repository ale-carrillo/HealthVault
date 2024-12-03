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
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { useEffect } from "react";

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
        weight: 0,
        height: 0,
        heartrate: 0,
        bloodPressure: "",
        sugarBlood: 0,
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


    const [rows, setRows] = useState([]);

    const [alert, setAlert] = useState({
        message: "",
        severity: "",
    });

    useEffect(() => {
        fetchPatients();
      }, []);

      const fetchPatients = async () => {
        try {
          const response = await axios.get("http://patients_api:8004/api/v1/patient");
          const mappedRows = response.data.map((row) => ({ ...row, id: row._id })); 
          setRows(mappedRows);
        } catch (error) {
          setAlert({
            message: "Failed to fetch patients",
            severity: "error",
          });
          setOpenAlert(true);
        }
    
      };
    

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
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: "Avatar",
            width: 100,

            renderCell: (params) => (
                <Avatar alt={params.row.name} src={params.value} sx={{ width: 40, height: 40 }} />
            ),
        },
        {
            field: "name", headerName: "Name", width: 150, headerClassName: 'super-app-theme--header',
            headerAlign: 'center'
        },
        {
            field: "lastName", headerName: "Last Name", width: 150, headerClassName: 'super-app-theme--header',
            headerAlign: 'center'
        },
        {
            field: "weight",
            headerName: "Weight (kg)",
            width: 100,
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            valueFormatter: (value) => `${value} kg`, 
        },
        {
            field: "height",
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: "Height (m)",
            width: 100,
            valueFormatter: (value) => `${value} m`,
        },
        {
            field: "heartrate",
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: "Heart Rate",
            width: 150,
            valueFormatter: (value) => `${value} bpm`,
        },
        {
            field: "bloodPressure",
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: "Blood Pressure",
            width: 150,
            valueFormatter: (value) => `${value} mmHg`,
        },
        {
            field: "sugarBlood",
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: "Blood Sugar",
            width: 150,
            valueFormatter: (value) => `${value} mg/dL`,
        },


        {
            field: "birthDate", headerName: "Birthdate", width: 150, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },


        {
            field: "phone",
            headerName: "Phone",
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
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

        {
            field: "email", headerName: "Email", width: 200, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "bloodType", headerName: "Blood Type", width: 100, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "allergies", headerName: "Allergies", width: 200, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "gender", headerName: "Gender", width: 80, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "familyHistory", headerName: "Family History", width: 200, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "medicalHistory", headerName: "Medical History", width: 300, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "emergencyContact", headerName: "Emergency Contact", width: 200, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "emergencyPhone",
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
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

        {
            field: "socialSecurity", headerName: "Social Security", width: 150, headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
        },
        {
            field: "actions",
            headerClassName: 'super-app-theme--header',
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary.main" onClick={() => handlePatient({ action: "edit", patient: params.row })}>
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
            if (action === "medical") {
                router.push(`/medical-history?id=${patient._id}`);
                return;
            } else {
                setAction(action);
                setOpenDialog(true);
                setPatient(action === "add" ? { ...patient, id: null } : patient);

            }


        } catch (error) {
            setAlert({
                message: "Failed to open patient dialog",
                severity: "error",
            });
            setOpenAlert(true);
        }
    };



    const handleSave = async (newPatient) => {
        try {
            if (action === "add") {
                const response = await axios.post("http://patients_api:8004/api/v1/patient", newPatient);
                setRows((prevRows) => [...prevRows,  response.data]);
                setAlert({
                    message: "Patient added successfully",
                    severity: "success",
                });
            } else if (action === "edit") {
                const response = await axios.put(`http://patients_api:8004/api/v1/patient/${newPatient._id}`, newPatient);
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

    const handleDelete =async (id) => {
        try {
            await axios.delete(`http://patients_api:8004/api/v1/patient/${id}`);
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

    const confirmDeletion = (id) => {
        setSelectedRow(id); 
        setConfirmOpen(true);
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
                        <Button startIcon={<SearchIcon/>} variant="contained" sx={{ml:4}} onClick={()=> 
                            router.push('/advanced-search')
                        }>
                            Advanced Search
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
                            columns: ["name", "lastName", "email", "phone", "birthDate", "bloodType", "weight", "height"],
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
                                backgroundColor: "#1976d2",
                                color: "white",
                                fontWeight: "bold",
                            },
                            "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
                            '& .super-app-theme--header': {
                                backgroundColor: 'primary.main',
                            },
                        }}
                    />

                    <SpeedDial
                        ariaLabel="SpeedDial openIcon example"
                        sx={{ position: 'absolute', bottom: 400, right: 100 }}
                        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                    >
                        <SpeedDialAction
                            icon={<EditIcon sx={{ color: 'secondary.main' }} />}
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
                            icon={<DeleteIcon sx={{ color: 'secondary.main' }} />}
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
                            icon={<MonitorHeartIcon sx={{ color: 'secondary.main' }} />}
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
                            <Card


                                key={row._id} sx={{
                                    width: 250, padding: 2, borderRadius: 2,
                                    boxShadow: 3,
                                    transition: 'transform 0.2s, box-shadow 0.2s', 
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 6, 
                                    }
                                }}>
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
                                    <IconButton color="secondary" onClick={() => handlePatient({ action: "medical", patient: row })}>
                                        <MonitorHeartIcon />
                                    </IconButton>
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
                    handleDelete(selectedRow);
                    setSelectedRow(null);
                }}
            />
        </Container>
    );
}