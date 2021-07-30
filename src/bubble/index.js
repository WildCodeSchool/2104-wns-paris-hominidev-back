/* const {ApolloServer} = require('apollo-server-express');
const app = new ApolloServer();
const cors = require('cors');
const PORT = 5050;

app.use(cors);
app.use(apollo.json());

const bubbles = () => {

  console.log('coucou')
  
  const server = require('http').createServer(app);
  const options = { cors: true, origin: ['*.*'] };
  
  const io = require('socket.io')(server, options);
  
  app.get('/', (req, res) => {
    res.send({projet: 'PygmaLink'}).status(200)
  });
  
  server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
  });
  
  io.on('connection', (socket) => {
    console.log(socket.id)
  
    socket.on('join-room', (data) => {
      socket.join(data);
      console.log('User joined room "+ data');
    })
  
    socket.on('Sent message', (data) => {
      console.log(data);
      socket.to(data.room).emit('Received message', data.content);
    })
  
    socket.on('Disconnect', () => {
      console.log('user disconnected')
    })
  })
}

export default bubbles; */