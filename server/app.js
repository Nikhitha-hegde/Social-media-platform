const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const connectDB = require('./db/connect')
const path = require('path')
const authenticationMiddleware = require('./middleware/auth')

const LoginRouter=require("./routes/login")
const PostRouter=require("./routes/post")

const app = express()
dotenv.config()

// middleware
app.use(express.static('./public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/v1',LoginRouter)
app.use('/api/v1',PostRouter)

app.use(authenticationMiddleware)
const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error);
  }
}

start()

//netstat -ano | findstr :8000
//taskkill /PID <PID> /F