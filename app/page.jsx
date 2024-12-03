"use client"; // Indicates that this component is a client component (for frameworks like Next.js)
import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Use the correct Grid import
import OrderForm from "./OrderForm"; // Import components
import Alerts from "../components/alerts"; // Import the Alerts component
import axios from "axios";
import { ORDERS_API } from '../constants/orders/constants'; // Import the API constant

export default function App() {
  const [orders, setOrders] = useState([]); // State to manage the list of orders
  const [openDialog, setOpenDialog] = useState(false); // State to manage the visibility of the dialog
  const [currentOrderId, setCurrentOrderId] = useState(null); // State for the ID of the current order
  const [alert, setAlert] = useState({ severity: "success", message: "" }); // State for alert messages
  const [openAlert, setOpenAlert] = useState(false); // State for alert visibility

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(ORDERS_API);
      setOrders(response.data);
      console.log("Orders fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setAlert({ severity: "error", message: "Failed to load orders" });
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle the saving of an order (create/update)
  const handleSaveOrder = async (order) => {
    let response;
  
    if (currentOrderId) {
      // Update existing order
      try {
        response = await axios.put(`${ORDERS_API}/${currentOrderId}`, order);
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o._id === response.data._id ? response.data : o))
        );
        setAlert({ severity: "success", message: "Order updated successfully!" });
      } catch (error) {
        console.error("Error updating order:", error);
        if (error.response?.status === 400) {
          setAlert({ severity: "error", message: "Invalid information provided for update." });
        } else {
          setAlert({ severity: "error", message: "Failed to update order. Server error." });
        }
      }
    } else {
      // Create new order
      try {
        response = await axios.post(ORDERS_API, order);
        setOrders((prevOrders) => [...prevOrders, response.data]);
        setAlert({ severity: "success", message: "Order created successfully!" });
      } catch (error) {
        console.error("Error creating order:", error);
        if (error.response?.status === 400) {
          setAlert({ severity: "error", message: "Invalid information provided for creation." });
        } else {
          setAlert({ severity: "error", message: "Failed to create order. Server error." });
        }
      }
    }
  
    setOpenAlert(true);
    setOpenDialog(false); // Ensure the dialog is closed
  };
  
  // Function to handle the deletion of an order
  const handleDeleteOrder = async (id) => {
    try {
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      setAlert({ severity: "success", message: "Order deleted successfully!" });
    } catch (error) {
      console.error("Error deleting order:", error);
      setAlert({ severity: "error", message: "Failed to delete order" });
    }
    setOpenAlert(true); // Ensure alert visibility on error
  };

  // Function to handle the editing of an order
  const handleEditOrder = (id) => {
    setCurrentOrderId(id);
    setOpenDialog(true);
  };

  return (
    <Container sx={{ minHeight: "500px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Orders
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenDialog(true);
              setCurrentOrderId(null); // Ensure no ID for new order
            }}
          >
            Create New Order
          </Button>
        </Grid>
      </Grid>

      {/* Dialog for creating or editing an order */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentOrderId ? "Edit Order" : "New Order"}
        </DialogTitle>
        <DialogContent>
          <OrderForm
            
            onAddOrder={handleSaveOrder}
            order={currentOrderId ? orders.find((o) => o._id === currentOrderId) : null}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display orders in a responsive grid */}
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid key={order._id} xs={12} sm={6} md={4}>
            <Paper style={{ padding: "16px", margin: "8px 0" }}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Order #{order._id}
              </Typography>
              <Typography>Name: {order.name}</Typography>
              <Typography>Table: {order.table}</Typography>
              <Typography style={{ fontWeight: "bold" }}>Dishes:</Typography>
              {order.dishes.map((dish, idx) => (
                <Typography key={idx}>
                  {dish.name} - Quantity: {dish.quantity}
                </Typography>
              ))}
              <Grid container spacing={1} style={{ marginTop: "8px" }}>
                <Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    Done
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditOrder(order._id)}
                  >
                    Edit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Alerts for actions */}
      <Alerts open={openAlert} setOpen={setOpenAlert} alert={alert} setAlert={setAlert} />
    </Container>
  );
}