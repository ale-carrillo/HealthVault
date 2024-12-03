"use client";
import * as React from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Alerts from "../components/alerts";
import { Typography, Paper , Box, useTheme, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import RecipeDialog from '../components/recipe-dialog';
import { RECIPE_API } from "../constants/recipe/constants";
import axios from "axios";
import { useSearchParams } from 'next/navigation';

export default function Recipe(){

    const theme = useTheme();

    const columns = [
      // Name of the patient.
      { field: "doctor", headerName: "Doctor", flex: 1 },
      { field: "patient", headerName: "Patient", flex: 1 },
      // Observations made in consult
      { field: "observations", headerName: "Observations", flex: 1 },
      // Diagnostic.
      { field: "diagnostic", headerName: "Diagnostic", flex: 1 },
      {
        field: "weight",
        headerName: "Weight",
        flex: 1,
        renderCell: (params) => {
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
                    <Typography>
                        {params.row.weight} Kg
                    </Typography>
                </Box>
            )
        },
    },
    {
        field: "temperature",
        headerName: "Temperature",
        flex: 1,
        renderCell: (params) => {
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "cenrowster",
                        gap: 4,
                        height: "100%",
                    }}
                >
                    <Typography>
                        {params.row.temperature} °C
                    </Typography>
                </Box>
            )
        },
    },
    {
        field: "bloodPressure",
        headerName: "BloodPressure",
        flex: 1,
        renderCell: (params) => {
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
                    <Typography>
                        {params.row.bloodPressure} mm Hg
                    </Typography>
                </Box>
            )
        },
    },
    { field: "medication", headerName: "Medication", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
  ];
      
const [action, setAction] = useState("");
const [recipe, setRecipe] = useState({
  _id: null,
  observations: "",
  diagnostic: "",
  weight: 0,
  temperature: 0,
  bloodPressure: "",
  quantity:0
});

const [openDialog, setOpenDialog] = useState(false);
const [rows, setRows] = useState();
const [openAlert, setOpenAlert] = useState(false);
const [alert, setAlert] = useState({
    message: "",
    severity: "",
});

const search = useSearchParams()  // Access to url query
    // When loading the page get the recipes in  database
    useEffect(() => {
        fectchAppointment();
  }, []);


  const fectchAppointment = async () => {
    try {
        const id = search.get("id")
        console.log(id);
        if (id) {
            const response = await axios.get(`${RECIPE_API}/${id}`)
            setAppointment(response.data)
            console.log(response.data)
            handleRecipe({ action: "add" })
        }
    }
    catch (error){
        console.warn("Error getting appointment:", error);
        setAlert({
            message: "Failed to get appointment",
            severity: "error"
        });
        setOpenAlert(true);
    }
  }
  const [appointment, setAppointment] = useState([]);

    useEffect(() => {
        fetchRecipes();
    }, []);

  // Fetching all the meals
  const fetchRecipes = async () => {
      // API request
      try {
          const response = await axios.get(RECIPE_API)
          setRows(response.data)
          console.log(response.data)
      }
      catch (error){
          console.warn("Error fetching recipes:", error);
          setAlert({
              message: "Failed to load recipes",
              severity: "error"
          });
          setOpenAlert(true);
      }
  };



const handleRecipe = ({ action, recipe }) => {
  // Update action.
  setAction(action);

  // Open dialog.
  setOpenDialog(true);

  // Select action.
  if (action == "add") {
      setRecipe({
        _id: null,
        observations: "",
        diagnostic: "",
        weight: 0,
        temperature: 0,
        bloodPressure: "",
        quantity:0
      });
  } 
  else {
      console.warn("Unknown action:", action);
  }
};


    return(

      <Box
      maxWidth="xl"
      sx={{ mx: "10%" }}
  >

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt:8,mb:4 }}>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb:6 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
                  Recipes
                  </Typography>
              </Box>

              <Grid xs={6} sx={{ border: "solid blue 5px",display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              </Grid>

            {/*Here we have the container with the menu items, where we have divided it into columns to provide a better view.*/}
            
            <Paper
                              sx={{
                                  padding: 2,
                                  borderRadius: 2,
                                  maxWidth: "100%",
                                  margin: "0 auto",
                                  height: "600px",
                              }}
                          >
                              {/* Recipe table. */}
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
                                      backgroundColor: "#fefdff",
                                      "& .MuiDataGrid-columnHeaderTitle": {
                                          fontWeight: "bold",
                                      },
                                      "& .MuiDataGrid-columnHeaders": {
                                          borderBottom: "2px solid #1abc9c",
                                      },
                                      "& .MuiDataGrid-row:hover": {
                                          backgroundColor: "#aed6f1",
                                      },
                                      "& .MuiDataGrid-cell": {
                                          borderRight: "1px solid #DDD",
                                      },
                                      "& .MuiDataGrid-footerContainer": {
                                          backgroundColor: "#6BA3BE",
                                      },
                                  }}
                              />
                          </Paper>
        
         {/* Creation dialog. */}
         <RecipeDialog
                open={openDialog}
                setOpen={setOpenDialog}
                recipe={recipe}
                setRecipe={setRecipe}
                action={action}
                rows={rows}
                setRows={setRows}
                setAlert={setAlert}
                setOpenAlert={setOpenAlert}
                appointment={appointment}
                setAppointment={setAppointment}
            />
            {/* Alert. */}
            <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} />
    </Box>
    );
};