const axios = require('axios')
const Dev = require('../models/Dev')
const { findConnections, sendMessage } = require('../websocket')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {

  async index(req, res){
    const devs = await Dev.find()

    return res.status(200).json(devs)
  },
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body
    
    let dev = await Dev.findOne({github_username})

    if (dev)
      return res.status(401).json({"error": "Usuario ja cadastrado"})

    const response = await axios.get(`https://api.github.com/users/${github_username}`)
    const { avatar_url, name = login, bio } = response.data
    
    const techsArray = parseStringAsArray(techs)
  
    const location = { 
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  
    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    })
    
    const sendSocketMessageTo = findConnections(
      { latitude, longitude },
      techsArray
    )
    
    sendMessage(sendSocketMessageTo, 'new-dev', dev)

    return res.status(200).json(dev)
  }
}

