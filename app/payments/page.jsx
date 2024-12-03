"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem, Box,
  FormControl, InputLabel, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { orders as initialOrders } from '../constants/home/orders'; // Ajusta la ruta de las órdenes
import Grid from "@mui/material/Grid2";
import Alerts from '../components/alerts'; // Importa el componente de alertas
import { PAYMENTS_API } from '../constants/payments/constants';
import axios from 'axios';


export default function TicketPage() {
  const [openDialog, setOpenDialog] = useState(false); // Estado para manejar la visibilidad del diálogo de pago
  const [openMedicamentosDialog, setOpenMedicamentosDialog] = useState(false); // Estado para manejar la visibilidad del diálogo de medicamentos
  const [selectedOrder, setSelectedOrder] = useState(null); // Estado para almacenar la orden seleccionada
  const [paymentMethod, setPaymentMethod] = useState(''); // Estado para el método de pago
  const [fiscalData, setFiscalData] = useState({ rfc: '' }); // Estado para los datos fiscales
  const [alertMessage, setAlertMessage] = useState({ severity: "success", message: "" });
  const [openAlert, setOpenAlert] = useState(false); // Estado para mostrar las alertas
  const [orders, setOrders] = useState(initialOrders); // Inicializa el estado de las órdenes con constantes
  const [medicamentosList, setMedicamentosList] = useState([]); // Estado para medicamentos del paciente
  const [availableMedicamentos, setAvailableMedicamentos] = useState([]); // Estado para medicamentos disponibles
  const [selectedId, setSelectedId] = useState(''); // Estado para el ID seleccionado
  const [fullName, setFullName] = useState(''); // Estado para el nombre completo
  const [rfc, setRfc] = useState(''); // Estado para el RFC
  const [medicamentos, setMed] = useState(''); // Estado para medicamentos
  const [payments, setPayments] = useState([]); // Initialize orders state with constants

  const [recipes, setMeicalappointments] = useState([]); // Initialize orders state with constants



  // Base de datos de medicamentos con cantidad y precio
  const medicamentosBaseDatos = [
    { nombre: "lol", id: 1, cantidad: 100, precio: 10 },
    { nombre: "lol", id: 2, cantidad: 200, precio: 20 },
    { nombre: "lol", id: 3, cantidad: 150, precio: 15 },
    { nombre: "lol", id: 4, cantidad: 50, precio: 25 },
    { nombre: "lol", id: 5, cantidad: 300, precio: 5 }
  ];

  // Datos de ejemplo de usuarios (ID, Full Name, RFC y medicamentos disponibles)
  const users = [
    { id: '1', fullName: 'John Doe', rfc: 'JDOE123456', medicamentos: 'si', medicamentosDisponibles: [{ id: 1, cantidad: 10 }, { id: 2, cantidad: 5 }] },
    { id: '2', fullName: 'Jane Smith', rfc: 'JSMI789012', medicamentos: 'no', medicamentosDisponibles: [] },
    { id: '3', fullName: 'Alice Johnson', rfc: 'AJOH345678', medicamentos: 'si', medicamentosDisponibles: [{ id: 4, cantidad: 3 }, { id: 5, cantidad: 2 }] }
  ];

  // Maneja el cambio del select para el ID
  const handleIdChange = (event) => {
    const selectedPayment = recipes.find(recipe => recipe._id === event.target.value);
    const selectedUser = users.find(user => user.id === event.target.value);
  
    // Actualiza el ID seleccionado
    setSelectedId(event.target.value);
  
    if (selectedPayment ) {
      // Actualiza datos del usuario
      setFullName(selectedUser ? selectedUser.fullName : selectedPayment?.patient || '');
      setRfc(selectedUser ? selectedUser.rfc : selectedPayment?.doctor || '');
  
      // Actualiza los medicamentos si hay datos del usuario
      if (selectedUser) {
        const medicamentosDisponibles = selectedUser.medication || [];
        const medicamentosConCantidad = medicamentosDisponibles.map(item => {
          const medicamento = medicamentosBaseDatos.find(med => med.id === item.id);
          return medicamento ? { ...medicamento, cantidad: item.cantidad } : null;
        }).filter(item => item !== null); // Elimina nulos
        
        setMed(selectedUser.medicamentos || '');
        setMedicamentosList(medicamentosConCantidad);
      } else {
        // Si no hay usuario, reinicia medicamentos
        setMed('');
        setMedicamentosList([]);
      }
  
      // Mostrar botones (ejemplo: lógica condicional para mostrar en el renderizado)
      console.log("Botones habilitados: Ver Medicinas y Generar Ticket");
    } else {
      // Si no hay datos válidos, resetea todo
      setFullName('');
      setRfc('');
      setMed('');
      setMedicamentosList([]);
      console.log("Botones deshabilitados");
    }
  };
  
  

  

  useEffect(() => {
    fetchOrders();
    fetchPayments();
    fetchMeicalappointments();
    fetchMedications();
  }, []);

  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${PAYMENTS_API}/pending`);
      setOrders(response.data)
      console.log(response.data)
    }
    catch (error){
      console.error("Error fetching ordes:", error);
      setAlert({
        message: "Failed to load orders",
        severity: "error"
      });
      setOpenAlert(true);
    }
  };
  
  const fetchMeicalappointments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/recipe");
      setMeicalappointments(response.data); // Guardar los datos en el estado
      console.log(response.data); // Imprimir los datos en consola para depuración
    } catch (error) {
      console.error("Error fetching payments:", error);
      setAlert({
        message: "Failed to load payments",
        severity: "error"
      });
      setOpenAlert(true);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/medications");
      setMeicalappointments(response.data); // Guardar los datos en el estado
      console.log(response.data); // Imprimir los datos en consola para depuración
    } catch (error) {
      console.error("Error fetching payments:", error);
      setAlert({
        message: "Failed to load payments",
        severity: "error"
      });
      setOpenAlert(true);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(PAYMENTS_API);
      setPayments(response.data);  // Asegúrate de que los pagos se guarden correctamente en el estado
      console.log(response.data);   // Esto te permitirá ver los datos de pagos que estás recuperando
    } catch (error) {
      console.error("Error fetching payments:", error);
      setAlert({
        message: "Failed to load payments",
        severity: "error"
      });
      setOpenAlert(true);
    }
  };

  const handleGenerateTicket = (order) => {
    setSelectedOrder(order); 
    console.log("Generating ticket for order:", order);
    setOpenDialog(true); 
  };

  const handlePayment = async () => {
    console.log("Procesando el pago para:", selectedOrder);
    console.log("Detalles de pago:", paymentMethod, fiscalData); 
  
    try {
      const response = await axios.post(PAYMENTS_API/add, {...selectedOrder, "_id": 0, "order_id": selectedOrder._id, "rfc": fiscalData.rfc, "payment_type": paymentMethod})
      setPayments([...payments, response.data]);
      setOrders(orders.filter((order) => order._id !== selectedOrder._id));
      setAlertMessage({
        message: "Payment added successfully!",
        severity: "success",
      });
      console.info("Payment added successfully!");
      setOpenDialog(false); 
    

      setMedicamentosList([]);
      setSelectedId('');
      setFullName('');
      setRfc('');
      setMed('');
      setPaymentMethod('');
      setFiscalData({ rfc: '' });

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder._id)
      );

      setOpenDialog(false); 
      setOpenMedicamentosDialog(false);
  
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setAlertMessage({
        severity: "error",
        message: "Error al realizar el pago. Intente nuevamente.",
      });
    } finally {
      setOpenAlert(true); 
    }
  };
  

  const handleOpenMedicamentosDialog = () => {
    setAvailableMedicamentos(medicamentosBaseDatos);
    setOpenMedicamentosDialog(true);
  };

  const handleCloseMedicamentosDialog = () => {
    setOpenMedicamentosDialog(false);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await axios.delete(`${PAYMENTS_API}/${paymentId}`);
      setPayments(payments.filter((payment) => payment._id !== paymentId));
      setAlertMessage({
        message: `Payment #${paymentId} deleted successfully!`,
        severity: "success",
      });
      console.info(`Payment #${paymentId} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting payment #${paymentId}:`, error);
  
      setAlertMessage({
        message: `Failed to delete payment #${paymentId}.`,
        severity: "error",
      });
    }
    setOpenAlert(true); 
  };
  


  


  return (
    <Container sx={{ py: 9 }}>
      <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Billing
      </Typography>
      <hr style={{ border: '2px solid #274D60', marginBottom: '30px' }} />
      <Grid container justifyContent="center" sx={{ padding: 3, marginBottom: 3 }}>
        <Grid size={8} xs={12} md={10}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }} >
            Enter prescription ID to view prescription information
            </Typography>

            <Grid container justifyContent="flex-end" sx={{ marginBottom: 3 }}>
        <FormControl fullWidth sx={{ width: '20%' }}>
          <InputLabel id="select-id" sx={{ textAlign: 'center' }}>ID recta</InputLabel>
          <Select
            labelId="select-id"
            value={selectedId}
            onChange={handleIdChange}
            label="ID recta"
            sx={{ textAlign: 'center', color: 'black' }}
          >
            {recipes.map((recipe) => (
              <MenuItem key={recipe._id} value={recipe._id} sx={{ textAlign: 'center', color: 'black' }}>
                {recipe._id}  {/* Mostrar el ID de la orden */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label={<strong>Full Name Patient</strong>}
                variant="outlined"
                value={fullName}
                sx={{ textAlign: 'center', color: 'black' }}
              />
             
            </Grid>

            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
              <TextField
                fullWidth
                label={<strong>Full Name Doctor</strong>}
                variant="outlined"
                value={rfc}
                
                sx={{ textAlign: 'center', color: 'black' }}
              />
            </Grid>

            <Grid container spacing={2}>            
                <Grid >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenMedicamentosDialog} // Ver medicamentos
                    sx={{ width: '100%', marginTop: 2  }}
                  >
                    View medications
                  </Button>
                </Grid>
              
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      
      <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Payments
      </Typography>
      <hr style={{ border: '2px solid #274D60', marginBottom: '30px' }} />
      <Grid container spacing={2} justifyContent="center">
  {payments.length > 0 ? (
    payments.map((payment) => (
      <Grid 
        key={payment._id} 
         
        xs={12} 
        sm={6} 
        md={4} 
        sx={{ display: 'flex', justifyContent: 'center' }} // Centra el contenido
      >
        <Paper 
          style={{ 
            padding: '16px', 
            margin: '8px 0', 
            width: '350px',   // Ancho fijo para el Paper (horizontal)
            height: '300px',  // Altura fija o adaptable, puedes ajustarlo
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>Payment #{payment._id}</Typography>
          <Typography variant="h6">Name: {payment.name}</Typography>
          <Typography variant="h6">RFC: {payment.rfc}</Typography>
          {payment.items.map((item, idx) => (
            <Typography variant="h6" key={idx}>
              {">"} {item.name} ({item.price}) - Quantity: {item.quantity}
            </Typography>
          ))}
          <Typography variant="h6">Total: {payment.total}</Typography>
          <Typography variant="h6">Payment method: {payment.payment_type}</Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDeletePayment(payment._id)}
            sx={{ marginTop: 'auto' }} // Coloca el botón en la parte inferior
          >
            HIDE TICKET
          </Button>
        </Paper>
      </Grid>
    ))
  ) : (
    <Typography variant="body1">No payments found</Typography>
  )}
</Grid>

        
     
      

      <Dialog
        open={openMedicamentosDialog}
        onClose={handleCloseMedicamentosDialog}
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '50%', 
            maxWidth: '1000px',
          },
        }}
      >
        
        <DialogContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 5 }}>
            Medicines
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity</TableCell> 
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>


                {medicamentosList.length > 0 ? (
                  medicamentosList.map((medication, index) => {
                    console.log('Medicamento del paciente:', medication);
                    const availableMed = availableMedicamentos.find(medDisponible => medDisponible.id === med.id);
                    console.log('Medicamento disponible:', availableMed); 
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: 'center' }}>{medication.nombre}</TableCell> 
                        <TableCell sx={{ textAlign: 'center' }}>{medication.cantidad}</TableCell> 
                        <TableCell sx={{ textAlign: 'center' }}>{availableMed ? availableMed.cantidad : 'N/A'}</TableCell> 
                        <TableCell sx={{ textAlign: 'center' }}>${medication.precio}</TableCell> 
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography>No hay medicamentos disponibles para este paciente.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              
            </Table>
            
          </TableContainer>
          {medicamentosList.length > 0 && (
            <Box display="flex" justifyContent="center" sx={{ marginTop: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleGenerateTicket(selectedOrder)} 
                sx={{ width: '40%' }}
              >
                Generate Ticket
              </Button>
            </Box>
          )}
        </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMedicamentosDialog} color="secondary">Cancel</Button>
          </DialogActions>
      </Dialog>

      <Dialog  open={openDialog} onClose={() => setOpenDialog(false)} fullWidth >
        
        <DialogContent>
          <Typography variant="h4" gutterBottom align="center">
            Order payment 
          </Typography>
          <Typography variant="body1" gutterBottom>
            Id Prescription: 
          </Typography>
          <Typography variant="body1" gutterBottom>
            Name: 
          </Typography>
          <Typography variant="body1" gutterBottom>
            RFC:
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ marginBottom: 2 }}>
          Select the payment method
          </Typography>
          



          <FormControl fullWidth>
            <InputLabel id="payment-method-label" sx={{ textAlign: 'center' }}>Payment method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment method"
            >
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
              <MenuItem value="efectivo">Efectivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayment} 
                sx={{ width: '40%' }}
              >
                Confirm payment
              </Button>
            </Box>
        <DialogActions>
        
          
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Alerts open={openAlert} setOpen={setOpenAlert} alert={alertMessage} setAlert={setAlertMessage} />
    </Container>
  );
}
