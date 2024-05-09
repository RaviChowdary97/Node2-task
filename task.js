const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// In-memory data store
let rooms = [];
let bookings = [];
let bookingIdCounter = 1;

// 1. Create a Room
app.post("/create-room", (req, res) => {
  const { numberOfSeats, amenities, pricePerHour } = req.body;
  const roomId = rooms.length + 1;
  rooms.push({ roomId, numberOfSeats, amenities, pricePerHour, bookings: [] });
  res.status(201).json({ message: "Room created successfully", roomId });
});

// 2. Book a Room
app.post("/book-room", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const bookingId = bookingIdCounter++;
  const booking = { bookingId, customerName, date, startTime, endTime, roomId };

  const room = rooms.find((room) => room.roomId === roomId);
  if (room) {
    room.bookings.push(booking);
    bookings.push(booking);
    res.status(201).json({ message: "Room booked successfully", bookingId });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

// 3. List all Rooms with Booked Data
app.get("/rooms", (req, res) => {
  const roomData = rooms.map((room) => ({
    roomId: room.roomId,
    numberOfSeats: room.numberOfSeats,
    amenities: room.amenities,
    pricePerHour: room.pricePerHour,
    bookings: room.bookings.map((booking) => ({
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    })),
  }));
  res.status(200).json(roomData);
});

// 4. List all Customers with Booked Data
app.get("/customers", (req, res) => {
  const customerData = bookings.map((booking) => ({
    customerName: booking.customerName,
    roomId: booking.roomId,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
  }));
  res.status(200).json(customerData);
});

// 5. List Customer Booking Statistics
app.get("/customer-stats", (req, res) => {
  const customerStats = {};

  bookings.forEach((booking) => {
    if (!customerStats[booking.customerName]) {
      customerStats[booking.customerName] = [];
    }
    customerStats[booking.customerName].push({
      roomId: booking.roomId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.bookingId,
      bookingDate: booking.date,
    });
  });

  res.status(200).json(customerStats);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
