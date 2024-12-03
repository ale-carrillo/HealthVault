import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import StraightenIcon from "@mui/icons-material/Straighten";
import jsPDF from "jspdf";
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from "html2canvas";

const calculateBMI = (weight, height) => {
  const bmi = (weight / (height * height)).toFixed(1);
  let category;
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Healthy";
  else category = "Overweight";
  return { value: bmi, category };
};

const PatientCard = ({ patient }) => {
  const { value: bmi, category: bmiCategory } = calculateBMI(
    patient.weight,
    patient.height
  );

  const getBMIProgress = (bmi) => {
    if (bmi < 15) return 0;
    if (bmi > 40) return 100;
    return ((bmi - 15) / (40 - 15)) * 100;
  };


  const generateStyledPDF = (patient) => {
    const doc = new jsPDF();

    const pdfContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
        <h1 style="text-align: center; color: #3f51b5;">Clinical Record</h1>
        <hr style="margin: 20px 0; border: 1px solid #3f51b5;">
        
        <h2 style="color: #3f51b5;">Patient Info</h2>
        <p><strong>Name:</strong> ${patient.name} ${patient.lastName}</p>
        <p><strong>Birthdate:</strong> ${patient.birthDate}</p>
        <p><strong>Email:</strong> ${patient.email}</p>
        <p><strong>Phone:</strong> ${patient.phone}</p>
        <p><strong>Type of Blood:</strong> ${patient.bloodType}</p>
        <p><strong>Allergies:</strong> ${patient.allergies || "Ninguna"}</p>
  
        <h2 style="color: #3f51b5;">Indicadores de Salud</h2>
        <p><strong>Height:</strong> ${(patient.height * 100).toFixed(1)} cm</p>
        <p><strong>Weight:</strong> ${patient.weight} kg</p>
        <p><strong>Body Mass Index (BMI):</strong> ${(
        patient.weight /
        (patient.height * patient.height)
      ).toFixed(1)}</p>
        <p><strong>Categoría BMI:</strong> ${patient.bmiCategory || "No calculado"
      }</p>
  
        <h2 style="color: #3f51b5;">Medical History</h2>
        <p><strong>Family History:</strong> ${patient.familyHistory || "No tiene"
      }</p>
        <p><strong>Medical History:</strong> ${patient.medicalHistory || "Ninguno"
      }</p>
        <p><strong>Emergency Contact:</strong> ${patient.emergencyContact
      }</p>
        <p><strong>Emergency Phone:</strong> ${patient.emergencyPhone
      }</p>
        <p><strong>Social Security:</strong> ${patient.socialSecurity}</p>
  
      </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = pdfContent;
    document.body.appendChild(element);

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`${patient.name}_${patient.lastName}_history.pdf`);
      document.body.removeChild(element);
    });
  };


  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 4,
        width: 400,
        mx: "auto",
        textAlign: "center",
        bgcolor: "white",
        elevation: 3,
        position: "relative",
      }}
    >
      {/* Download Button */}
      <IconButton
        color="primary"
        sx={{ position: "absolute", top: 10, right: 10 }}
        onClick={() => generateStyledPDF(patient)}
      >
        <DownloadIcon />
      </IconButton>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Avatar
          alt={patient.name}
          src={patient.avatar}
          sx={{ width: 100, height: 100 }}
        />
      </Box>
      <CardContent>

        <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
          {patient.name} {patient.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Birthdate: {patient.birthDate}
        </Typography>
        <Divider sx={{ my: 2, bgcolor: "primary.main" }} />
        <Typography variant="h5" sx={{ color: "primary.main" }}>Health Indicators</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          {/* Height and Weight */}
          <Box>
            <Box
              sx={{
                bgcolor: "primary.main",
                p: 1,
                borderRadius: 2,
                textAlign: "center",
                width: 100,
                mb: 1,
              }}
            >
              <Typography variant="body2" color="white">
                <StraightenIcon /> Height
              </Typography>
              <Typography variant="h6" color="white">
                {patient.height * 100} cm
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: "secondary.main",
                p: 1,
                borderRadius: 2,
                textAlign: "center",
                width: 100,
              }}
            >
              <Typography variant="body2" color="white">
                <MonitorWeightIcon /> Weight
              </Typography>
              <Typography variant="h6" color="white">
                {patient.weight} kg
              </Typography>
            </Box>
          </Box>

          {/* BMI Section */}
          <Box
            sx={{
              bgcolor: "grey.800",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              flexGrow: 1,
              ml: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>Body Mass Index (BMI)</Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "white" }}>
              {bmi}
            </Typography>
            <Chip
              label={bmiCategory}
              sx={{
                mt: 1,
                bgcolor:
                  bmiCategory === "Healthy"
                    ? "green"
                    : bmiCategory === "Underweight"
                      ? "blue"
                      : "red",
                color: "white",
              }}
            />
            {/* BMI Progress Bar */}
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={getBMIProgress(bmi)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  background:
                    "linear-gradient(to right, blue, green, yellow, red)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "transparent",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 0.5,
                }}
              >
                <Typography variant="caption" color="white">
                  15
                </Typography>
                <Typography variant="caption" color="white">
                  18.5
                </Typography>
                <Typography variant="caption" color="white">
                  25
                </Typography>
                <Typography variant="caption" color="white">
                  30
                </Typography>
                <Typography variant="caption" color="white">
                  40
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2, bgcolor: "primary.main" }} />
        <Typography variant="h5" sx={{ color: "primary.main" }} >Personal Info</Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {patient.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone: {patient.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type of Blood: {patient.bloodType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Alergies: {patient.allergies}
        </Typography>

      </CardContent>
    </Card>
  );
};

export default PatientCard;




