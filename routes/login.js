var express = require('express');
var router = express.Router();

// Store people in serveur
var players = [];

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('./login/index', { title: 'Connexion' });
});

// Connexion à partir du boutton Join
router.post('/join', function(req, res) {
  var user = req.body.user;
  console.log(req.body);
  console.log("USER : " +   user.toString());
  let player = players.find(u => u.id === user.id)
  if (player) {
      player.count++;
      res.send({
          'status': 'FAILED'
      });
  } else {
      players.push(user);
      console.log(players);
      res.send({
          'status': 'OK',
          'players': players
      });
  }
});

module.exports = router;
