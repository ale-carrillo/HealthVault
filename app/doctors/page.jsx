"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import DoctorProfile from "../components/doctor-profile";
import Alerts from "../components/alerts"; // Import the Alerts component

export default function DoctorsPage() {
  const [view, setView] = useState("viewDoctors"); // Toggle between views
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    license: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
    specialties: [],
    img: ""
  });
  const [alert, setAlert] = useState({ severity: "success", message: "" }); // State for alert messages
  const [openAlert, setOpenAlert] = useState(false); // State for alert visibility


  const [availableSpecialties] = useState([
    "Cardiology",
    "Dermatology",
    "Gynecology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "Oncology",
    "General Medicine",
    "Ophthalmology",
    "Psychology",
    "Urology",
    "Endocrinology",
    "Psychiatry",
    "Traumatology",
    "Rheumatology",
    "Pulmonology",
    "Gastroenterology",
  ]);

  const [specialtyForm, setSpecialtyForm] = useState({
    specialty: "",
    consultation_fee: "",
    services: [""],
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8001/api/v1/doctors");
        setDoctors(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch doctors if the view is "viewDoctors"
    if (view === "viewDoctors") {
      fetchDoctors();
    }
  }, [view]); // Refetch doctors whenever the "view" changes

  const handleViewChange = (event, newView) => {
    if (newView) {
      setView(newView);
    }
  };

  
  const handleNewDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleSpecialtyChange = (e) => {
    const { value } = e.target;
    setSpecialtyForm((prevForm) => ({
      ...prevForm,
      specialty: value,
    }));
  };

  const handleConsultationFeeChange = (e) => {
    const { value } = e.target;
    setSpecialtyForm((prevForm) => ({
      ...prevForm,
      consultation_fee: value,
    }));
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...specialtyForm.services];
    updatedServices[index] = value;
    setSpecialtyForm((prevForm) => ({
      ...prevForm,
      services: updatedServices,
    }));
  };

  const addServiceField = () => {
    setSpecialtyForm({
      ...specialtyForm,
      services: [...specialtyForm.services, ""],
    });
  };

  const addSpecialty = () => {
    if (
      specialtyForm.specialty &&
      specialtyForm.consultation_fee &&
      specialtyForm.services.every((service) => service.trim())
    ) {
      setNewDoctor((prevDoctor) => ({
        ...prevDoctor,
        specialties: [
          ...prevDoctor.specialties,
          {
            specialty: specialtyForm.specialty,
            consultation_fee: parseFloat(specialtyForm.consultation_fee),
            services: specialtyForm.services.filter((service) => service.trim()),
          },
        ],
      }));

      setSpecialtyForm({
        specialty: "",
        consultation_fee: "",
        services: [""],
      });
    } else {
      setAlert({ severity: "error", message: "Please fill out all fields correctly for the specialty." });
      setOpenAlert(true);  

    }
  };

  const handleRegisterDoctor = async () => {
    if (!newDoctor.name || !newDoctor.license || !newDoctor.phone_number || !newDoctor.email) {
      setAlert({ severity: "error", message: "All fields are required." });
      setOpenAlert(true); 
      return;
    }

    if (newDoctor.specialties.length === 0) {
      setAlert({ severity: "error", message: "At least one specialty is required" });
      setOpenAlert(true); 
      return;
    }

    const doctorPayload = {
      ...newDoctor,
      specialties: newDoctor.specialties.map((spec) => ({
        ...spec,
        consultation_fee: parseFloat(spec.consultation_fee),
      })),
    };

    try {
      const response = await axios.post("http://localhost:8001/api/v1/doctors", doctorPayload);
      console.log("Doctor registered:", response.data);
      setNewDoctor({
        name: "",
        license: "",
        phone_number: "",
        email: "",
        date_of_birth: "",
        specialties: [],
        img: "",
      });
      setAlert({ severity: "success", message: "Doctor successfully registered!" });
      setOpenAlert(true); 
    } catch (error) {
      console.error("Error registering doctor:", error);
      //alert(error.response ? error.response.data : "Failed to register the doctor.");
      setAlert({ severity: "error", message: "Failed to register the doctor" });
      setOpenAlert(true); 
    }
  };

  



  const handleDeleteDoctor = async (doctorId) => {
    try {
      const response = await axios.delete(`http://localhost:8001/api/v1/doctors/${doctorId}`);
      
      if (response.status === 200) {
        // Actualizamos la lista de doctores después de la eliminación
        const fetchDoctors = async () => {
          try {
            const response = await axios.get("http://localhost:8001/api/v1/doctors");
            setDoctors(response.data);
          } catch (err) {
            setError(err.response ? err.response.data.error : err.message);
          }
        };
  
        fetchDoctors();
  
        // Configuramos y mostramos la alerta de éxito
        setAlert({ severity: "success", message: "Doctor deleted successfully!" });
        setOpenAlert(true);  // Mostrar la alerta
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
  
      // Configuramos y mostramos la alerta de error
      setAlert({ severity: "error", message: "Failed to delete doctor" });
      setOpenAlert(true);  // Mostrar la alerta
    }
  };
  




const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64.startsWith("data:image/") && base64.length > 0) {
        setNewDoctor({
          ...newDoctor,
          img: base64, // Guardamos la imagen en formato Base64 en el estado
        });
      } else {
        setAlert({
          message: "Invalid image format. Please upload a valid image.",
          severity: "error",
        });
        setOpenAlert(true);
      }
    };
    reader.readAsDataURL(file); // Convertir el archivo a Base64
  }
};

  



  
  

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <ToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={handleViewChange}
        >
          <ToggleButton value="viewDoctors">View Doctors</ToggleButton>
          <ToggleButton value="registerDoctor">Register Doctor</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === "viewDoctors" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Doctors List
          </Typography>
          {doctors.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
              No doctors available.
            </Typography>
          ) : (
            doctors.map((doctor) => <DoctorProfile key={doctor._id} doctor={doctor} onDeleteDoctor={handleDeleteDoctor}/>)
          )}
        </Box>
      )}

      {view === "registerDoctor" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Register Doctor
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newDoctor.name}
                onChange={handleNewDoctorChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="License"
                name="license"
                value={newDoctor.license}
                onChange={handleNewDoctorChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone_number"
                value={newDoctor.phone_number}
                onChange={handleNewDoctorChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={newDoctor.email}
                onChange={handleNewDoctorChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newDoctor.date_of_birth}
                onChange={handleNewDoctorChange}
              />
            </Grid>
           

            <Grid item xs={12}>
              <Select fullWidth value={specialtyForm.specialty} onChange={handleSpecialtyChange}>
                <MenuItem value="">Select a Specialty</MenuItem>
                {availableSpecialties.map((spec, index) => (
                  <MenuItem key={index} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Consultation Fee"
                name="consultation_fee"
                type="number"
                value={specialtyForm.consultation_fee}
                onChange={handleConsultationFeeChange}
              />
            </Grid>
            

            {specialtyForm.services.map((service, index) => (
              <Grid key={index} item xs={12}>
                <TextField
                  fullWidth
                  label={`Service ${index + 1}`}
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                />
              </Grid>
              
            ))}
      
            <Grid item xs={12}>
              <Button fullWidth onClick={addServiceField}>
                Add Another Service
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth onClick={addSpecialty}>
                Add Specialty
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Added Specialties:</Typography>
            <List>
              {newDoctor.specialties.map((specialty, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={`${specialty.specialty} - $${specialty.consultation_fee}`}
                      secondary={`Services: ${specialty.services.join(", ")}`}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Box>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" color="primary" onClick={handleRegisterDoctor}>
              Register Doctor
            </Button>
          </Box>
        </Box>
      )}
      <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} setAlert={setAlert} />
    </Box>
  );
}
