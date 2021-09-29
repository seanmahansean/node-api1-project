const express = require("express")
const User = require("./users/model")
const server = express()
server.use(express.json())


server.post("/api/users", (req, res) => {
  const user = req.body
  if(!user.name || !user.bio){
    res.status(400).json({
      message: "Please provide name and bio for the user"
    })
  }else{
    User.insert(user)
      .then(nUser => {
        res.status(201).json(nUser)
      })
      .catch(err => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
          err: err.message
        })
      })
  }
})

server.get("/api/users", (req, res) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message
      })
    })
})

server.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if(user){
        res.json(user)
      }else{
        res.status(404).json({
          message: "The user with the specified ID does not exist"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "The user information could not be retrieved",
        err: err.message
      })
    })
})

server.delete("/api/users/:id", async (req, res) => {
  const posUser = await User.findById(req.params.id)
  if(!posUser){
    res.status(404).json({
      message: "The user with the specified ID does not exist"
    })
  }else{
    const delUser = await User.remove(posUser.id)
    res.status(200).json(delUser)
  }
})


server.put("/api/users/:id", async (req, res) => {
  try{
    const posUser = await User.findById(req.params.id)
    const user = req.body;
    if(!posUser){
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    }else{
      if(!user.name || !user.bio){
        res.status(400).json({
          message: "Please provide name and bio for the user"
        })
      }else{
        const updUser = await User.update(req.params.id, req.body)
        res.json(updUser)
      }
    }
  }catch(err){
    res.status(500).json({
      message: "The user information could not be modified"
    })
  }
})

server.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found"
  })
})

module.exports = server
