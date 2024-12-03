// Imports.
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    Typography
  } from "@mui/material";
  import { useState, useEffect } from "react";

  import Autocomplete from '@mui/material/Autocomplete';
  import { RECIPE_API } from "../constants/recipe/constants.jsx";
  import axios from "axios";
  
  // Recdipe dialog.
  export default function RecipeDialog({
    open,
    setOpen,
    recipe,
    appointment,
    setAppointment,
    setRecipe,
    action,
    rows,
    setRows,
    setAlert,
    setOpenAlert,
  }) {
    // States.
    const [errors, setErrors] = useState({});
  
  
    //Close dialog.
    const handleCloseDialog = () => {
      setErrors({});
      setOpen(false);
    };
  
    // Validate fields.
    const validateFields = () => {
      // Build error object.
      const newErrors = {};
      if (!recipe.observations) newErrors.obs = "Observations for patient are required.";
      if (!recipe.diagnostic) newErrors.diag = "Diagnostic for patient is required.";
      if (!recipe.weight || recipe.weight < 0) newErrors.we = "Weight can not be a negative number or cero.";
      if (!recipe.quantity || recipe.quantity < 0) newErrors.qua = "quantity can not be a negative number or cero.";
      if (!recipe.temperature|| recipe.temperature < 0) newErrors.temp = "Temperature can not be a negative number or cero.";
      if (!recipe.bloodPressure) newErrors.press = "Pressure can not be a negative number or cero.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    // Save recipe.
    const saveRecipe = async () => {
      // Validate fields.
      if (!validateFields()) {
        setAlert({
          message: "Please fill all required fields correctly.",
          severity: "error",
        });
        setOpenAlert(true);
        console.warn("Please fill all required fields correctly.");
        return;
      }
  
      // Build the new object for the Recipe.
      const updatedRecipe = {
        ...recipe,
        doctor: appointment.doctor,
        doctor_id: appointment.doctor_id,
        patient: appointment.patient,
        patient_id:appointment.patient_id,
        medication: selectedMedication.name,
        medication_id: selectedMedication._id,
      };
  
      // Select if add the Recipe.
      if (action === "add") {
        // API request
        try {
          const response = await axios.post(RECIPE_API, updatedRecipe)
          setRows([...rows, response.data]);
          setAlert({
            message: "Recipe added successfully!",
            severity: "success",
          });
          console.info("Recipe added successfully!");
        }
        catch {
          setAlert({
            message: "Failed to add new recipe.",
            severity: "error",
          });
        }
        setOpenAlert(true);
      }
  
      handleCloseDialog();
    };
  
    // Handle text inputs change.
    const handleChange = (event) => {
      setRecipe({
        ...recipe,
        [event.target.name]: event.target.value,
      });
    };

    const [selectedMedication, setSelectedMedication] = useState(null);
    const handleMedicationsChange = (event, newValue) => {
        setSelectedMedication(newValue);
        if (newValue) {
          console.log('ID medications:', newValue);
        } else {
          console.log('NO medications selected');
        }
      };

    
    const [medications, setMedications] = useState([])


      useEffect(() => {
        fetchMedications();
      }, []);

    const fetchMedications = async () => {
      // API request
      try {
          const response = await axios.get(`${RECIPE_API}/medications`)
          setMedications(response.data)
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



    // Component.
    return (
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>New Recipe</DialogTitle>
        <DialogContent>
          <Typography
          >
            {appointment.doctor}
          </Typography>
          <Typography
          >
            {appointment.patient}
          </Typography>
          {/* observations field. */}
          <TextField
            margin="dense"
            name="observations"
            label="Observations"
            fullWidth
            value={recipe.observations}
            onChange={handleChange}
            error={!!errors.obs}
            helperText={errors.obs}
          />
          {/* Unit field. */}
          <TextField
            margin="dense"
            name="diagnostic"
            label="Diagnostic"
            fullWidth
            value={recipe.diagnostic}
            onChange={handleChange}
            error={!!errors.diag}
            helperText={errors.diag}
          />
          {/* Medications */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>

             <Autocomplete
                sx={{flex: 1}}
                options={medications}
                getOptionLabel={(option) => option.name || 'Medication'} 
                renderInput={(params) => (
                <TextField {...params} label="Selection medication" variant="outlined" />
                )}
                onChange={handleMedicationsChange} 
                value={selectedMedication} 
                isOptionEqualToValue={(option, value) => option._id === value._id} 
            />

              {/* TextField */}
              <TextField
                sx={{ flex: 1, maxWidth: 300 }}
                margin="dense"
                name="quantity"
                label="Quantity"
                fullWidth
                value={recipe.quantity}
                onChange={handleChange}
                error={!!errors.qua}
                helperText={errors.qua}
                inputProps={{ min: 1 }}
              />
            </Box>
          {/* Price field. */}
          <TextField
            margin="dense"
            placeholder="0.0 Kg"
            name="weight"
            label="Weight"
            type="number"
            fullWidth
            value={recipe.weight}
            onChange={handleChange}
            error={!!errors.we}
            helperText={errors.we}
            inputProps={{ min: 1 }}
          />
          {/* Price field. */}
          <TextField
            margin="dense"
            placeholder="0°C"
            name="temperature"
            label="Temperature"
            type="number"
            fullWidth
            value={recipe.temperature}
            onChange={handleChange}
            error={!!errors.temp}
            helperText={errors.temp}
            inputProps={{ min: 1 }}
          />
          {/* Price field. */}
          <TextField
            margin="dense"
            placeholder="0/0 mm Hg"
            name="bloodPressure"
            label="BloodPressure"
            fullWidth
            value={recipe.bloodPressure}
            onChange={handleChange}
            error={!!errors.obs}
            helperText={errors.obs}
          />
      </DialogContent>
      {/* Action buttons. */}
      <DialogActions>
        <Button color="secondary" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button color="secondary" onClick={saveRecipe}>
          {action === "add" ? "Add Recipe" : "Edit Recipe"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}