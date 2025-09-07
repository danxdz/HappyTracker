const { Server } = require('socket.io')
const http = require('http')

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Store active rooms and users
const rooms = new Map()
const users = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join a room
  socket.on('join-room', (roomId, userData) => {
    socket.join(roomId)
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        users: new Set(),
        drawings: [],
        likes: 0,
        comments: []
      })
    }
    
    const room = rooms.get(roomId)
    room.users.add(socket.id)
    users.set(socket.id, { ...userData, roomId })
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      username: userData.username,
      timestamp: Date.now()
    })
    
    // Send current room state to new user
    socket.emit('room-state', {
      users: Array.from(room.users).map(id => users.get(id)),
      drawings: room.drawings,
      likes: room.likes,
      comments: room.comments
    })
    
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  // Handle drawing data
  socket.on('drawing-data', (data) => {
    const user = users.get(socket.id)
    if (!user) return
    
    const room = rooms.get(user.roomId)
    if (!room) return
    
    // Add to room's drawing history
    room.drawings.push({
      ...data,
      userId: socket.id,
      timestamp: Date.now()
    })
    
    // Broadcast to all users in the room
    socket.to(user.roomId).emit('drawing-update', {
      ...data,
      userId: socket.id,
      timestamp: Date.now()
    })
  })

  // Handle likes
  socket.on('like-drawing', () => {
    const user = users.get(socket.id)
    if (!user) return
    
    const room = rooms.get(user.roomId)
    if (!room) return
    
    room.likes++
    
    // Broadcast like to all users
    io.to(user.roomId).emit('drawing-liked', {
      userId: socket.id,
      likes: room.likes,
      timestamp: Date.now()
    })
  })

  // Handle comments
  socket.on('add-comment', (comment) => {
    const user = users.get(socket.id)
    if (!user) return
    
    const room = rooms.get(user.roomId)
    if (!room) return
    
    const newComment = {
      id: Date.now(),
      userId: socket.id,
      username: user.username,
      text: comment,
      timestamp: Date.now()
    }
    
    room.comments.push(newComment)
    
    // Broadcast comment to all users
    io.to(user.roomId).emit('comment-added', newComment)
  })

  // Handle reactions
  socket.on('send-reaction', (reaction) => {
    const user = users.get(socket.id)
    if (!user) return
    
    // Broadcast reaction to all users in room
    socket.to(user.roomId).emit('reaction-received', {
      userId: socket.id,
      username: user.username,
      reaction,
      timestamp: Date.now()
    })
  })

  // Handle user typing
  socket.on('typing', (isTyping) => {
    const user = users.get(socket.id)
    if (!user) return
    
    socket.to(user.roomId).emit('user-typing', {
      userId: socket.id,
      username: user.username,
      isTyping
    })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id)
    if (user) {
      const room = rooms.get(user.roomId)
      if (room) {
        room.users.delete(socket.id)
        
        // Notify others in the room
        socket.to(user.roomId).emit('user-left', {
          userId: socket.id,
          username: user.username,
          timestamp: Date.now()
        })
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          rooms.delete(user.roomId)
        }
      }
      
      users.delete(socket.id)
    }
    
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`DrawTogether WebSocket server running on port ${PORT}`)
})