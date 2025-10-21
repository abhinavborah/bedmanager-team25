import { io } from 'socket.io-client';
import { updateBedInList } from '../features/beds/bedsSlice';

// Socket instance (singleton pattern)
let socket = null;

/**
 * Initialize and connect to Socket.IO server
 * @param {string} token - JWT authentication token
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Socket} socket instance
 */
export const connectSocket = (token, dispatch) => {
  // If socket already exists and is connected, return it
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection with authentication
  socket = io('http://localhost:5000', {
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    
    // Handle authentication errors
    if (error.message === 'Authentication error') {
      console.error('Socket authentication failed. Token may be invalid.');
      // Optionally dispatch a logout action
      // dispatch(logout());
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    
    // Auto-reconnect is handled by socket.io unless manually disconnected
    if (reason === 'io server disconnect') {
      // Server disconnected the socket, attempt manual reconnection
      socket.connect();
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Socket reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed after maximum attempts');
  });

  // Listen for bed update events
  socket.on('bedUpdate', (updatedBed) => {
    console.log('Received bed update:', updatedBed);
    
    // Dispatch action to update Redux store
    dispatch(updateBedInList(updatedBed));
  });

  // Listen for other custom events as needed
  socket.on('error', (error) => {
    console.error('Socket error event:', error);
  });

  return socket;
};

/**
 * Disconnect from Socket.IO server
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get the current socket instance
 * @returns {Socket|null} current socket instance or null
 */
export const getSocket = () => {
  return socket;
};

/**
 * Emit a custom event to the server
 * @param {string} eventName - Name of the event
 * @param {any} data - Data to send with the event
 */
export const emitEvent = (eventName, data) => {
  if (socket?.connected) {
    socket.emit(eventName, data);
  } else {
    console.warn('Socket not connected. Cannot emit event:', eventName);
  }
};

/**
 * Listen for a custom event
 * @param {string} eventName - Name of the event to listen for
 * @param {Function} callback - Callback function to handle the event
 */
export const listenToEvent = (eventName, callback) => {
  if (socket) {
    socket.on(eventName, callback);
  } else {
    console.warn('Socket not initialized. Cannot listen to event:', eventName);
  }
};

/**
 * Remove listener for a custom event
 * @param {string} eventName - Name of the event
 * @param {Function} callback - Callback function to remove
 */
export const removeEventListener = (eventName, callback) => {
  if (socket) {
    socket.off(eventName, callback);
  }
};

const socketService = {
  connectSocket,
  disconnectSocket,
  getSocket,
  emitEvent,
  listenToEvent,
  removeEventListener,
};

export default socketService;
