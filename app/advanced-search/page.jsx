'use client'
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import PatientDetailDialog from "../components/patient-detail-dialog";

export default function AdvancePatientSearch() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleResults = results.slice(startIndex, endIndex);
  const [error, setError] = useState(""); 
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [dialogOpen, setDialogOpen] = useState(false); 

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(""); 
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/patient/query",
        { query: searchText }
      );
  
      console.log("Backend response:", response.data);
  
      const resultsArray = response.data[0]?.results || [];
  
      if (resultsArray.length > 0) {
        setResults(resultsArray);
        console.log("Updated results state:", resultsArray);
      } else {
        setResults([]);
        setError("No results found."); 
      }
    } catch (error) {
      console.error("Error during search:", error);
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaperClick = (patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPatient(null);
  };
  
  

  const handleGoBack = () => {
    window.location.href = "/patients"; 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Advance Patient Search
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          GO back
        </Button>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Search Patients"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter patient name, email, or other details"
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Stack>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Search Results</Typography>
        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : results.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {visibleResults.map((result, index) => (
                <Grid key={index} xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 4,
                      textAlign: "center",
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handlePaperClick(result)} 
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      {result.name} {result.lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      Email: {result.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      Phone: {result.phone}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      Blood Type: {result.bloodType}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              >
                Previous
              </Button>
              <Typography variant="body1">Page {currentPage} of {totalPages}</Typography>
              <Button
                variant="contained"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">No results found.</Typography>
        )}
      </Box>
      <PatientDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        patient={selectedPatient}
      />
    </Box>
  );
}
