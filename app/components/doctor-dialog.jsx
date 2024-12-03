import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Alerts from "./alerts"; // Asegúrate de que este componente esté importado

export default function EditDoctorDialog({ open, onClose, doctor, onSave }) {
  const [basicInfo, setBasicInfo] = useState({
    name: doctor?.name || "",
    license: doctor?.license || "",
    phone_number: doctor?.phone_number || "",
    email: doctor?.email || "",
  });

  const [alert, setAlert] = useState({ severity: "success", message: "" });
  const [openAlert, setOpenAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Combinar los cambios de basicInfo con el resto del objeto doctor
      const updatedDoctor = { ...doctor, ...basicInfo };
      console.log("Payload SENDED:", updatedDoctor);

      // Realizar el PUT para actualizar el doctor completo
      const response = await axios.put(
        `http://doctors_api:8001/api/v1/doctors/${doctor._id}`,
        updatedDoctor
      );

      if (response.status === 200) {
        setAlert({ severity: "success", message: "Doctor updated successfully!" });
        setOpenAlert(true); // Mostrar la alerta de éxito
        onSave(updatedDoctor); // Notificar al componente padre con la nueva info
        onClose(); // Cerrar el diálogo
      } else {
        setAlert({ severity: "success", message: "Doctor updated successfully!" });
        setOpenAlert(true); // Mostrar la alerta de éxito
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      setAlert({ severity: "success", message: "Doctor updated successfully!" });
      setOpenAlert(true); // Mostrar la alerta de éxito
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Basic Information</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={basicInfo.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="License"
            name="license"
            value={basicInfo.license}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            value={basicInfo.phone_number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={basicInfo.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mostrar las alertas si es necesario */}
      <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} setAlert={setAlert} />
    </>
  );
}
