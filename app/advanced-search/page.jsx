'use client';
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid2";
import ClearIcon from "@mui/icons-material/Clear";

export default function AdvancePatientSearch() {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);

  const handleSearch = () => {
    console.log("Search text:", searchText);
    console.log("Filters:", filters);
  };

  const handleAddFilter = (filter) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  const handleRemoveFilter = (filterToRemove) => {
    setFilters(filters.filter((filter) => filter !== filterToRemove));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Advance Patient Search
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 4 }}>
        <Stack spacing={2}>
          {/* Input de Búsqueda */}
          <TextField
            label="Search Patients"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter patient name, email, or other details"
          />

          {/* Filtros */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={() => handleAddFilter("Name")}
            >
              Name
            </Button>
            <Button
              variant="contained"
              onClick={() => handleAddFilter("Email")}
            >
              Email
            </Button>
            <Button
              variant="contained"
              onClick={() => handleAddFilter("Phone")}
            >
              Phone
            </Button>
            <Button
              variant="contained"
              onClick={() => handleAddFilter("Blood Type")}
            >
              Blood Type
            </Button>
          </Stack>

          {/* Chips de Filtros Activos */}
          {filters.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1}>
                {filters.map((filter) => (
                  <Chip
                    key={filter}
                    label={filter}
                    onDelete={() => handleRemoveFilter(filter)}
                    color="primary"
                  />
                ))}
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              </Stack>
            </Box>
          )}

          {/* Botón de Búsqueda */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
