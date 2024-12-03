import React, { useState, useEffect } from "react";
import MuiPhoneNumber from "mui-phone-number";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Stepper,
    Step,
    StepLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    MenuItem,
    InputAdornment,

} from "@mui/material";
import Image from "next/image";
import axios from "axios";


export default function PatientDialog({
    open,
    setOpen,
    patient,
    setPatient,
    action,
    rows,
    setRows,
    setAlert,
    setOpenAlert,
}) {
    const [activeStep, setActiveStep] = useState(0);
    const [previewAvatar, setPreviewAvatar] = useState(patient.avatar || "");
    const [errors, setErrors] = useState({});
    useEffect(() => {
        setPreviewAvatar(patient.avatar || "");
      }, [patient, open]);

    const steps = ["Basic Info", "Contact Info", "Medical Info", "Avatar"];


    useEffect(() => {
        if (open) {
            setPreviewAvatar(patient.avatar || "");
            setPatient((prevPatient) => ({
                ...prevPatient,
                avatar: patient.avatar || "",
            }));
        }
    }, [open]);

    const handleNext = () => {
        if (!validateStep()) return;
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleCloseDialog = () => {
        setOpen(false);
        setActiveStep(0);
        setPreviewAvatar(patient.avatar || "");
        setErrors({});
    };

    const savePatient = async () => {
        if (!validateStep()) return;

        if (action === "add") {
            const response = await axios.post("http://patients_api:8004/api/v1/patient",patient)
            setRows((prevRows) => [...prevRows, response.data]);
            setAlert({ message: "Patient added successfully", severity: "success" });
        } else if (action === "edit") {
            const response = await axios.put(`http://patients_api:8004/api/v1/patient/${patient._id}`,patient)
            if (response.data === "The patient is already up-to-date") {
                setAlert({
                  message: "No changes were made, the employee is already up-to-date.",
                  severity: "info",
                });
                setOpen(false);
                setOpenAlert(true);
                return;
              }
            setRows((prevRows) =>
                prevRows.map((row) => (row._id === patient._id ? { ...patient } : row))
            );
            setAlert({ message: "Patient updated successfully", severity: "success" });
        }

        setOpenAlert(true);
        setOpen(false);
        setActiveStep(0);
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setPatient({ ...patient, [name]: value });
    };

    const validateStep = () => {
        const newErrors = {};
        if (activeStep === 0) {
            if (!patient.name) newErrors.name = "Name is required.";
            if (!patient.lastName) newErrors.lastName = "Last Name is required.";
            if (!patient.email || !/\S+@\S+\.\S+/.test(patient.email)) newErrors.email = "Enter a valid email address.";
            if (!patient.birthDate) newErrors.birthDate = "Birthdate is required.";
            if (!patient.gender) newErrors.gender = "Gender is required.";
        } else if (activeStep === 1) {
            if (!patient.phone) newErrors.phone = "Phone is required.";
            if (!patient.emergencyContact) newErrors.emergencyContact = "Emergency Contact is required.";
            if (!patient.emergencyPhone) newErrors.emergencyPhone = "Emergency Phone is required.";
        } else if (activeStep === 2) {
            if (!patient.bloodType) newErrors.bloodType = "Blood Type is required.";
            if (!patient.weight || patient.weight <= 0 || patient.weight > 300)
                newErrors.weight = "Enter a valid weight in kg (0-300).";
            if (!patient.height || patient.height <= 0 || patient.height > 2.5)
                newErrors.height = "Enter a valid height in meters (0-2.5).";
            if (!patient.heartrate || patient.heartRate <= 0 || patient.heartRate > 200)
                newErrors.heartrate = "Enter a valid heart rate in bpm (0-200).";
            if (!patient.bloodPressure || !/^\d{1,3}\/\d{1,3}$/.test(patient.bloodPressure)) {
                newErrors.bloodPressure = "Enter a valid blood pressure in the format '120/80'.";
            } else {
                const [systolic, diastolic] = patient.bloodPressure.split("/").map(Number);
                if (systolic <= 0 || systolic > 300 || diastolic <= 0 || diastolic > 200) {
                    newErrors.bloodPressure = "Systolic should be 1-300, and diastolic 1-200.";
                }
            }
            if (!patient.sugarBlood || patient.sugarBlood <= 0 || patient.sugarBlood > 200)
                newErrors.sugarBlood = "Enter a valid sugar blood in mg/dL (0-200).";

        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                if (base64.startsWith("data:image/")) {
                    setPreviewAvatar(base64);
                    setPatient({ ...patient, avatar: base64 });
                } else {
                    setAlert({
                        message: "Invalid image format. Please upload a valid image.",
                        severity: "error",
                    });
                    setOpenAlert(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <TextField
                            name="name"
                            label="Name"
                            fullWidth
                            margin="normal"
                            value={patient.name || ""}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            name="lastName"
                            label="Last Name"
                            fullWidth
                            margin="normal"
                            value={patient.lastName || ""}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={patient.email || ""}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            name="birthDate"
                            label="Birthdate"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={patient.birthDate || ""}
                            onChange={handleChange}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                        />
                        <RadioGroup
                            name="gender"
                            value={patient.gender || ""}
                            onChange={handleChange}
                            row
                        >
                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        </RadioGroup>

                    </Box>
                );
            case 1:
                return (
                    <Box>

                        <MuiPhoneNumber
                            name="phone"
                            label="Phone"
                            defaultCountry="us"
                            regions="america"
                            value={patient.phone || ""}
                            onChange={(value) => handleChange({ target: { name: "phone", value } })}
                            fullWidth
                            margin="normal"
                            error={!!errors.phone}
                            helperText={errors.phone}
                            variant="outlined"
                        />
                        <TextField
                            name="emergencyContact"
                            label="Emergency Contact"
                            fullWidth
                            margin="normal"
                            value={patient.emergencyContact || ""}
                            onChange={handleChange}
                            error={!!errors.emergencyContact}
                            helperText={errors.emergencyContact}
                        />

                        <MuiPhoneNumber
                            name="emergencyPhone"
                            label="Emergency Phone"
                            defaultCountry="us"
                            regions="america"
                            value={patient.emergencyPhone || ""}
                            onChange={(value) => handleChange({ target: { name: "emergencyPhone", value } })}
                            fullWidth
                            margin="normal"
                            error={!!errors.emergencyPhone}
                            helperText={errors.emergencyPhone}
                            variant="outlined"
                        />
                        <TextField
                            name="socialSecurity"
                            label="Social Security"
                            fullWidth
                            margin="normal"
                            value={patient.socialSecurity || ""}
                            onChange={handleChange}
                           
                        />

                    </Box>
                );

            case 2:
                return (
                    <Box>
                        {/* Blood Type */}
                        <TextField
                            select
                            name="bloodType"
                            label="Blood Type"
                            fullWidth
                            margin="normal"
                            value={patient.bloodType || ""}
                            onChange={handleChange}
                            error={!!errors.bloodType}
                            helperText={errors.bloodType}
                            variant="outlined"
                        >
                            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Weight */}
                        <TextField
                            name="weight"
                            label="Weight"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={patient.weight || ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (!isNaN(value) && value >= 0 && value <= 300) {
                                    handleChange(event);
                                }
                            }}
                            error={!!errors.weight}
                            helperText={errors.weight || "Enter a valid weight in kg (0-300)"}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                            }}
                        />

                        {/* Height */}
                        <TextField
                            name="height"
                            label="Height"
                            fullWidth
                            margin="normal"
                            type="number"
                            value={patient.height || ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (!isNaN(value) && value >= 0 && value <= 2.5) {
                                    handleChange(event);
                                }
                            }}
                            error={!!errors.height}
                            helperText={errors.height || "Enter a valid height in meters (0-2.5)"}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">m</InputAdornment>,
                            }}
                        />

                        <TextField
                            name='heartrate'
                            label='Heart Rate'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={patient.heartrate || ''}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (/^\d*$/.test(value)) { 
                                    handleChange({ target: { name: "heartrate", value } });
                                }
                            }}
                            error={!!errors.heartrate}
                            helperText={errors.heartrate || "Enter a valid heart rate in bpm (0-200)"}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">bpm</InputAdornment>,
                            }}
                        />
                        <TextField
                            name="bloodPressure"
                            label="Blood Pressure"
                            fullWidth
                            margin="normal"
                            type="text"
                            value={patient.bloodPressure || ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (/^\d*\/?\d*$/.test(value)) {
                                    handleChange(event);
                                }
                            }}
                            error={!!errors.bloodPressure}
                            helperText={errors.bloodPressure || "Enter a valid blood pressure in mmHg (0-200)"}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">mmHg</InputAdornment>,
                            }}
                        />
                        <TextField
                            name='sugarBlood'
                            label='Sugar Blood Level'
                            fullWidth
                            margin='normal'
                            type='number'
                            value={patient.sugarBlood || ''}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (!isNaN(value) && value >= 0 && value <= 200) {
                                    handleChange(event); 
                                }
                            }}
                            error={!!errors.sugarBlood}
                            helperText={errors.sugarBlood || "Enter a valid sugar blood in mg/dL (0-200)"}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">mg/dL</InputAdornment>,
                            }}
                        />


                        {/* Allergies */}
                        <TextField
                            name="allergies"
                            label="Allergies"
                            fullWidth
                            margin="normal"
                            value={patient.allergies || ""}
                            onChange={handleChange}
                            variant="outlined"
                        />

                        {/* Family History */}
                        <TextField
                            name="familyHistory"
                            label="Family History"
                            fullWidth
                            margin="normal"
                            value={patient.familyHistory || ""}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            variant="outlined"
                        />

                        {/* Medical History */}
                        <TextField
                            name="medicalHistory"
                            label="Medical History"
                            fullWidth
                            margin="normal"
                            value={patient.medicalHistory || ""}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Box>
                );


            case 3:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Button variant="outlined" component="label" sx={{ mt: 3 }}>
                            Upload Avatar
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                        {previewAvatar && (
                            <Image
                                src={previewAvatar}
                                alt="Avatar preview"
                                width={100}
                                height={100}
                                style={{ borderRadius: "8px" }}
                            />
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} fullWidth>
            <DialogTitle>{action === "add" ? "Add Patient" : "Edit Patient"}</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {renderStepContent()}
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleCloseDialog}>
                    Cancel
                </Button>
                <Button onClick={handleBack} disabled={activeStep === 0}>
                    Back
                </Button>
                {activeStep === steps.length - 1 ? (
                    <Button onClick={savePatient}>Save</Button>
                ) : (
                    <Button onClick={handleNext}>Next</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
