// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const payrollRoutes = require('./routes/payroll');
const noticeRoutes = require('./routes/notice');
const holidayRoutes = require('./routes/holiday');
// const chatRoutes = require('./routes/chat');
// const { Server } = require('socket.io');
// const Chat = require('./models/Chat');
require('./utils/cron');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/holidays', holidayRoutes);
// app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('HRMS Backend Running');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io setup
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join', (userId) => {
//     socket.join(userId);
//   });

//   socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
//     try {
//       const chatMessage = await Chat.create({
//         senderId,
//         receiverId,
//         message,
//       });
//       const populatedMessage = await Chat.findById(chatMessage._id)
//         .populate('senderId', 'name email')
//         .populate('receiverId', 'name email');
//       io.to(senderId).to(receiverId).emit('message', populatedMessage);
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });