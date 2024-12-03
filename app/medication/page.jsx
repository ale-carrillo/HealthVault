"use client";

// Imports.
import { Typography, Box, Paper, IconButton, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Image from "next/image";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationDialog from "../components/medication-dialog";
import Alerts from "../components/alerts";
import axios from "axios";
import { MEDICATIONS_API } from "../constants/medication/constants";

// Medication page.
export default function Medication() {
    // Theme.
    const theme = useTheme();
    // DataGrid columns.
    const columns = [
        // Image.
        {
            field: "image",
            headerName: "Image",
            width: 300,
            renderCell: (params) => {
                // Medication element image render.
                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                width: 250,
                                height: 250,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                borderRadius: 2,
                            }}
                        >
                            <Image
                                src={params.row.image}
                                alt={params.row.name}
                                layout="responsive"
                                width={100}
                                height={100}
                                style={{ objectFit: "fill" }}
                            />
                        </Box>
                    </Box>
                )
            },
        },
        {
            field: "name",
            headerName: "Details",
            flex: 1,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {params.row.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Unit: {params.row.unit}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Price: ${params.row.price}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Administration: {params.row.administration}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Distributor: {params.row.distributor}
                        </Typography>
                    </Box>
                );
            },
            valueGetter: (value, row) => 
                `${row.name || ""} ${row.unit || ""} ${row.price || ""} ${row.administration || ""} ${row.distributor || ""}`,
        },
        // Existence.
        {
            field: "existence",
            headerName: "Existence",
            flex: 1,
            renderCell: (params) => {
                // Existence medication element render.
                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            height: "100%",
                        }}
                    >
                        {/* Decrease existence. */}
                        <IconButton
                            disabled={disableIncreaseDecreaseExistence}
                            onClick={() => decreaseMedication(params.row._id, params.row.existence)}
                            color="primary"
                        >
                            <RemoveIcon />
                        </IconButton>
                        {/* Current existence. */}
                        <Typography>
                            {params.row.existence}
                        </Typography>
                        {/* Increase existence. */}
                        <IconButton
                            disabled={disableIncreaseDecreaseExistence}
                            onClick={() => increaseMedication(params.row._id, params.row.existence)}
                            color="primary"
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                )
            },
        },
        // Actions
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
                <Box>
                    {/* Edit. */}
                    <IconButton
                        onClick={() => handleMedication({ action: "edit", medication: params.row })}
                        color="primary"
                    >
                        <EditIcon />
                    </IconButton>
                    {/* Delete. */}
                    <IconButton
                        onClick={() => deleteMedication(params.row._id)}
                        color="secondary"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // States.
    const [action, setAction] = useState("");
    const [medication, setMedication] = useState({
        _id: null,
        name: "",
        unit: "",
        existence: "",
        price: "",
        administration: "",
        distributor: "",
        image: null
    });
    const [disableIncreaseDecreaseExistence, setDisableIncreaseDecreaseExistence] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [rows, setRows] = useState();
    const [openAlert, setOpenAlert] = useState(false);
    const [alert, setAlert] = useState({
        message: "",
        severity: "",
    });

    // When loading the page
    useEffect(() => {
        fetchMedications();
    }, []);

    // Fetching all the medications
    const fetchMedications = async () => {
        // API request
        try {
            const response = await axios.get(MEDICATIONS_API)
            setRows(response.data)
            console.log(response.data)
        }
        catch (error){
            console.warn("Error fetching medications:", error);
            setAlert({
                message: "Failed to load medications",
                severity: "error"
            });
            setOpenAlert(true);
        }
    };

    // Handle functions.

    // Decrease existence where id matches.
    const decreaseMedication = async (id, existence) => {
        if (existence == 0) {
            console.warn("Medication existence cannot be less than zero.");
            setAlert(
            {
              message: "Medication existence cannot be less than zero.",
              severity: "warning"
            });
            setOpenAlert(true);
            return;
        }
        setDisableIncreaseDecreaseExistence(true);
        // API request
        try {
            const response = await axios.put(`${MEDICATIONS_API}/existence/${id}`, {'existence': existence - 1} );
            setRows(rows.map((e) => (e._id === id ? response.data : e)));
            setAlert({
                message: "Medication decreased successfully!",
                severity: "success",
            });
            console.info("Medication decreased successfully!");
        }
        catch (error) {
            console.warn("Error decreasing medication existence:", error);
            setAlert({
              message: "Failed to decrease medication existence",
              severity: "error"
            });
        } 
        setDisableIncreaseDecreaseExistence(false);
        setOpenAlert(true);
    };

    // Increase existence where id matches.
    const increaseMedication = async (id, existence) => {
        // Increase existence.
        setDisableIncreaseDecreaseExistence(true);
        // API request
        try {
            const response = await axios.put(`${MEDICATIONS_API}/existence/${id}`, {'existence': existence + 1} );
            setRows(rows.map((e) => (e._id === id ? response.data : e))); 
            setAlert({
                message: "Medication increased successfully!",
                severity: "success",
            });
            console.info("Medication increased successfully!");
        }
        catch (error) {
            console.error("Error increasing medication existence:", error);
            setAlert({
              message: "Failed to increase medication existence",
              severity: "error"
            });
        }  
        setDisableIncreaseDecreaseExistence(false);
        setOpenAlert(true);
    };

    // Edit or add medication.
    const handleMedication = ({ action, medication }) => {
        // Update action.
        setAction(action);

        // Open dialog.
        setOpenDialog(true);

        // Select action.
        if (action == "add") {
            setMedication({
                _id: null,
                name: "",
                unit: "",
                existence: 0,
                price: 0,
                administration: "",
                distributor: "",
                image: null
            });
        } else if (action == "edit") {
            setMedication(medication);
        } else {
            console.warn("Unknown action:", action);
        }
    };

    // Delete medication where id matches.
    const deleteMedication = async (id) => {
        // Delete medication.
        // API request
        try {
            await axios.delete(`${MEDICATIONS_API}/${id}`);
            setRows(rows.filter((row) => row._id !== id));
            setAlert({
                message: "Medication deleted successfully!",
                severity: "success",
            });
            setOpenAlert(true);
            console.info("Medication deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting medication:", error);
            setAlert({
              message: "Failed to delete medication",
              severity: "error"
            });
            setOpenAlert(true);
        }
    };

    // Component.
    return (
        <Box
            sx={{ mx: "10%" }}
        >
            <Typography
                variant="h4"
                textAlign="center"
            >
                Medication
            </Typography>
            {/* Add medication button. */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    sx={{ borderRadius: 3 }}
                    onClick={() => handleMedication({ action: "add" })}
                >
                    Add Item
                </Button>
            </Box>
            <Paper
                sx={{
                    padding: 2,
                    borderRadius: 2,
                    maxWidth: "100%",
                    margin: "0 auto",
                    height: "600px",
                }}
            >
                {/* Medication table. */}
                <DataGrid
                    columns={columns}
                    rows={rows}
                    getRowId={(row) => row._id}
                    rowHeight={180}
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
            {/* Medication for creation/edition dialog. */}
            <MedicationDialog
                open={openDialog}
                setOpen={setOpenDialog}
                medication={medication}
                setMedication={setMedication}
                action={action}
                rows={rows}
                setRows={setRows}
                setAlert={setAlert}
                setOpenAlert={setOpenAlert}
            />
            {/* Alert. */}
            <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} />
        </Box>
    );
}