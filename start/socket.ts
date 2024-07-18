import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import env from '#start/env'

class SocketService {
  io: Server

  constructor() {
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: env.get('FRONTEND_URL') || env.get('MOBILE_URL'), // TODO ADD CLIENT PROD URL
        methods: ['GET', 'POST'],
      },
    })

    // Set up an event listener for 'send_message' events on the socket
    this.io.on('connection', (socket) => {
      console.log('Backend: A new connection', socket.id)

      socket.on('send_message', (data) => {
        const message = {
          messageId: data.messageId,
          content: data.content,
          conversationId: data.conversationId,
          sender: data.sender,
          sendAt: new Date(),
        }

        this.io.emit('new_message', message)
      })

      socket.on('disconnect', () => {
        console.log('Backend: Socket disconnected', socket.id)
      })
    })
  }
}

const socketService = new SocketService()
export default socketService
