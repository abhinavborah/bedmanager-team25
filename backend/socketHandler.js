// Socket.IO connection and event handler
const jwt = require('jsonwebtoken');

const initializeSocket = (io) => {
  // Track authenticated users
  const authenticatedUsers = {};

  // Middleware to verify JWT token on connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    console.log('🔍 Socket connection attempt:', {
      socketId: socket.id,
      hasAuthToken: !!socket.handshake.auth.token,
      hasAuthHeader: !!socket.handshake.headers.authorization,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    });
    
    if (!token) {
      console.log(`❌ Connection rejected: No token provided (${socket.id})`);
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.user = decoded; // Attach user data to socket
      console.log(`✅ User authenticated: ${decoded.email} (${socket.id})`);
      next();
    } catch (error) {
      console.log(`❌ Connection rejected: Invalid token (${socket.id})`, error.message);
      console.log('Token causing error:', token);
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Authenticated user connected: ${socket.user.email} (${socket.id})`);
    
    // Store authenticated user
    authenticatedUsers[socket.id] = {
      userId: socket.user.id,
      email: socket.user.email,
      role: socket.user.role,
      socketId: socket.id
    };

    // Handle user join with user ID
    socket.on('userJoin', (userId) => {
      authenticatedUsers[socket.id].customUserId = userId;
      console.log(`User ${socket.user.email} joined with custom ID: ${userId}`);
      
      // Broadcast updated user count to all authenticated users
      io.emit('userCount', Object.keys(authenticatedUsers).length);
    });

    // Handle custom messages
    socket.on('message', (data) => {
      console.log(`Message from ${socket.user.email}:`, data);
      // Broadcast message to all authenticated clients
      io.emit('newMessage', {
        userId: socket.user.id,
        email: socket.user.email,
        role: socket.user.role,
        message: data,
        timestamp: new Date()
      });
    });

    // Handle bed status updates (only authenticated users can trigger)
    socket.on('bedStatusUpdate', (bedData) => {
      console.log(`Bed status update from ${socket.user.email}:`, bedData);
      // Broadcast bed status to all authenticated clients
      io.emit('bedStatusChanged', {
        ...bedData,
        updatedBy: socket.user.email
      });
    });

    // Handle occupancy log updates (only authenticated users can trigger)
    socket.on('occupancyLogUpdate', (logData) => {
      console.log(`Occupancy log update from ${socket.user.email}:`, logData);
      // Broadcast occupancy update to all authenticated clients
      io.emit('occupancyLogChanged', {
        ...logData,
        updatedBy: socket.user.email
      });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      const user = authenticatedUsers[socket.id];
      delete authenticatedUsers[socket.id];
      console.log(`User ${user?.email} disconnected. Remaining users: ${Object.keys(authenticatedUsers).length}`);
      
      // Broadcast updated user count to remaining authenticated users
      io.emit('userCount', Object.keys(authenticatedUsers).length);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error from ${socket.id}:`, error);
    });
  });
};

module.exports = initializeSocket;
