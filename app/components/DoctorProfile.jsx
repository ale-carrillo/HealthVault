import {
    Box,
    Typography,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    ToggleButton,
    ToggleButtonGroup,
  } from "@mui/material";
  import Grid from "@mui/material/Grid2";
  import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
  import PhoneIcon from "@mui/icons-material/Phone";
  import EmailIcon from "@mui/icons-material/Email";
  import { useState, useEffect } from "react";
  import EditDoctorDialog from "./DoctorDialog";
  import axios from "axios";
  
  export default function DoctorProfile({ doctor, onDeleteDoctor }) {
    const [specialty, setSpecialty] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [updatedDoctor, setUpdatedDoctor] = useState({ ...doctor });
  
    const handleDialogOpen = () => setOpenDialog(true);
    const handleDialogClose = () => setOpenDialog(false);
  
    const handleSpecialtyChange = (event, newSpecialty) => {
      if (newSpecialty) {
        setSpecialty(newSpecialty);
      }
    };
  
    const handleSaveChanges = (updatedDoctorData) => {
      setUpdatedDoctor(updatedDoctorData);
    };
  
    useEffect(() => {
      if (doctor && doctor.specialties) {
        // Set the first specialty when doctor and specialties are available
        setSpecialty(Object.keys(doctor.specialties)[0]);
      }
    }, [doctor]);
  
    return (
      <Box sx={{ p: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: "16px",
            maxWidth: 800,
            margin: "auto",
            "&:hover": {
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Grid container sx={{ p: 1 }}>
            <Grid xs={12} sm={4} sx={{ p: 2 }}>
              <Avatar
                src={doctor.img || ""}
                sx={{ width: 120, height: 120, margin: "auto" }}
              />
              <Typography
                variant="h6"
                sx={{ textAlign: "center", mt: 2, fontWeight: "bold" }}
              >
                {updatedDoctor.name}
              </Typography>
              <Grid>
                <Paper
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    padding: 1,
                    textAlign: "center",
                  }}
                  elevation={0}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "white", fontWeight: "medium" }}
                  >
                    {updatedDoctor.mainSpecialty}
                  </Typography>
                </Paper>
              </Grid>
              <Grid>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", mt: 2, fontWeight: "bold" }}
                >
                  License: {updatedDoctor.license}
                </Typography>
              </Grid>
  
              <Grid sx={{ mt: 0 }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Phone: ${updatedDoctor.phone_number || "N/A"}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Email: ${updatedDoctor.email || "N/A"}`} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
  
            <Grid item xs={12} sx={{ p: 2 }}>
              <Typography
                align="center"
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Specialties
              </Typography>
  
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <ToggleButtonGroup
                  color="primary"
                  value={specialty}
                  exclusive
                  onChange={handleSpecialtyChange}
                  aria-label="Specialty"
                  sx={{ mb: 3 }}
                >
                  {doctor.specialties && Object.keys(doctor.specialties).map((key) => (
                    <ToggleButton
                      key={key}
                      value={key}
                      sx={{ fontWeight: "bold", textTransform: "none" }}
                    >
                      {doctor.specialties[key].specialty}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
  
              <List>
                {doctor.specialties && doctor.specialties[specialty]?.services.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
  
              <Typography
                align="center"
                variant="body1"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                Consultation Fee: $
                {doctor.specialties && doctor.specialties[specialty]?.consultation_fee}
              </Typography>
            </Grid>
          </Grid>
  
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: "16px",
                px: 4,
                mr: 2,
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
              onClick={() => onDeleteDoctor(doctor._id)}
            >
              Delete Doctor
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "16px",
                px: 4,
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
              onClick={handleDialogOpen}
            >
              Update Doctor
            </Button>
          </Box>
        </Paper>
  
        {/* Dialog to edit the doctor */}
        <EditDoctorDialog
          open={openDialog}
          onClose={handleDialogClose}
          doctor={updatedDoctor}
          onSave={handleSaveChanges} // Pass the save function
        />
      </Box>
    );
  }
  