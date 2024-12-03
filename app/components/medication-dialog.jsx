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
  import Image from "next/image";
  import { useState, useEffect } from "react";
  import { MEDICATIONS_API } from "../constants/medication/constants";
  import axios from "axios";
  
  // Medication dialog.
  export default function MedicationDialog({
    open,
    setOpen,
    medication,
    setMedication,
    action,
    rows,
    setRows,
    setAlert,
    setOpenAlert,
  }) {
    // States.
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
  
    // Handle functions.
  
    //Close dialog.
    const handleCloseDialog = () => {
      setSelectedImage(null);
      setErrors({});
      setOpen(false);
    };
  
    // Validate fields.
    const validateFields = () => {
      // Build error object.
      const newErrors = {};
      if (!medication.name) newErrors.name = "Name is required.";
      if (!medication.unit) newErrors.unit = "Unit is required.";
      if (!medication.existence || medication.existence < 0) newErrors.existence = "Existence must be a non-negative number.";
      if (!medication.price || medication.price < 0) newErrors.price = "Price must be a non-negative number.";
      if (!medication.administration) newErrors.administration = "Administration is required.";
      if (!medication.distributor) newErrors.distributor = "Distributor is required.";
      if (!medication.image && !selectedImage) newErrors.image = "Image is required.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    // Save medication.
    const saveMedication = async () => {
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
  
      // Build the new object for medication.
      const updatedMedication = {
        ...medication,
        existence: +medication.existence,
        price: +medication.price,
        image: selectedImage ? selectedImage : medication.image,
      };
  
      // Select if add or edit the medication.
      if (action === "add") {
        // API request
        try {
          const response = await axios.post(MEDICATIONS_API, updatedMedication)
          setRows([...rows, response.data]);
          setAlert({
            message: "Medication added successfully!",
            severity: "success",
          });
          console.info("Medication added successfully!");
        }
        catch {
          setAlert({
            message: "Failed to add medication.",
            severity: "error",
          });
        }
        setOpenAlert(true);
      } else if (action === "edit") {
        // API request
        try {
          const response = await axios.put(`${MEDICATIONS_API}/${medication._id}`, updatedMedication)
          setRows(rows.map((e) => (e._id === updatedMedication._id ? updatedMedication : e)));
          setAlert({
            message: "Medication saved successfully!",
            severity: "success",
          });
          console.info("Medication saved successfully!");
        }
        catch (error) {
          setAlert({
            message: "Failed to update medication.",
            severity: "error",
          });
        }
        setOpenAlert(true);
      }
  
      handleCloseDialog();
    };
  
    // Handle text inputs change.
    const handleChange = (event) => {
      setMedication({
        ...medication,
        [event.target.name]: event.target.value,
      });
    };
  
    // Handle image change.
    const handleImageChange = (event) => {
      // If a image was selected.
      const file = event.target.files[0];
      if (file) {
        // Validate file type.
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
  
          reader.onloadend = () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
          };
  
          // Read the file as a data URL (Base64 string)
          reader.readAsDataURL(file);
        } else {
          setAlert({
            message: "Please upload a valid image file.",
            severity: "error",
          });
          setOpenAlert(true);
          console.warn("Please upload a valid image file.");
        }
      }
    };
  
    // Display current image always if edition is else displays nothing.
    useEffect(() => {
      if (action === "edit" && medication.image) {
        setSelectedImage(medication.image);
      } else {
        setSelectedImage("");
      }
    }, [medication, action]);
  
    // Component.
    return (
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{action === "add" ? "Add" : "Edit"} Medication</DialogTitle>
        <DialogContent>
          {/* Name field. */}
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={medication.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          {/* Unit field. */}
          <TextField
            margin="dense"
            name="unit"
            label="Unit"
            fullWidth
            value={medication.unit}
            onChange={handleChange}
            error={!!errors.unit}
            helperText={errors.unit}
          />
          {/* Existence field. */}
          <TextField
            margin="dense"
            name="existence"
            label="Existence"
            type="number"
            fullWidth
            value={medication.existence}
            onChange={handleChange}
            error={!!errors.existence}
            helperText={errors.existence}
            inputProps={{ min: 0 }}
          />
          {/* Price field. */}
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={medication.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{ min: 0 }}
          />
          {/* Administration field. */}
          <TextField
            margin="dense"
            name="administration"
            label="Administration"
            fullWidth
            value={medication.administration}
            onChange={handleChange}
            error={!!errors.administration}
            helperText={errors.administration}
          />
          {/* Distributor field. */}
          <TextField
            margin="dense"
            name="distributor"
            label="Distributor"
            fullWidth
            value={medication.distributor}
            onChange={handleChange}
            error={!!errors.distributor}
            helperText={errors.distributor}
          />
          {/* Image field. */}
          <TextField
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            error={!!errors.image}
            helperText={errors.image}
            sx={{ mb: 2 }}
          />
          {/* Image preview. */}
          {selectedImage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Image Preview:</Typography>
              <Image
                src={selectedImage}
                alt="Selected Image"
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
              />
            </Box>
          )}
        </DialogContent>
        {/* Action buttons. */}
        <DialogActions>
          <Button color="secondary" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveMedication}>
            {action === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }