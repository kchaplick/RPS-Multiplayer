// Initialize Firebase
var config = {
    apiKey: "AIzaSyA_WUWgxDr3vAxbbscmfYgF8S6sAJEWyAA",
    authDomain: "rps-multiplayer-436a8.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-436a8.firebaseio.com",
    projectId: "rps-multiplayer-436a8",
    storageBucket: "",
    messagingSenderId: "623123308180"
  };
  firebase.initializeApp(config);

  //variable for firebase connection
  var database = firebase.database();

  //variable for connections 
  var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

//variables
var connections = 0;
var playerOne = null;
var playerTwo = null;
var playerOneName = "";
var playerTwoName = "";
var waitingPlayers = [];
var playerOneChoice = "";
var playerTwoChoice = "";
var turn = 1;

//Get the number of connected users
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {
  
    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

//====================================================
//on load hide all elements except the directions
window.load(function() {
$("#waiting-screen").hide();
$("#player-moves").hide()
});
    


//====================================================
//check if players exist
database.ref("/players/").on("value", function(snapshot) {
	// Check player 1 in the database
	if (snapshot.child("playerOne").exists()) {
    playerOne = snapshot.val().playerOne;
  }else if(waitingPlayers.length !== 0){
    playerOne = {
      name:waitingPlayers[0],
      win: 0,
      tie: 0,
      choice: ""
    }
    database.ref().child("/players/playerOne").set(playerOne);
  }else{
    playerOne = null;
  }

  // Check player 2 in the database
	if (snapshot.child("playerTwo").exists()) {
    playerTwo = snapshot.val().playerTwo;
  }else if(waitingPlayers.length !== 0){
    playerTwo = {
      name:waitingPlayers[0],
      win: 0,
      tie: 0,
      choice: ""
    }
    database.ref().child("/players/playerTwo").set(playerTwo);
  }else{
    playerTwo = null;
  }

});

//====================================================
// Submit button on-click 
$("#name-submit").on("click", function(event) {
  event.preventDefault();

   // Add to waiting player list if 2 players already exist
	if (playerOne !== null && playerTwo !== null) {
    var playerName = $("#name_field").val().trim();
    waitingPlayers.push(playerName);
    console.log("waiting player list: " + waitingPlayers);
  }
  //set player 1 attributes 
  else if (playerOne === null) {
    var playerName = $("#name_field").val().trim();
  playerOne = {
    name: playerName,
    win: 0,
    tie: 0,
    choice: ""
  }
  //add player 1 to databse
    database.ref().child("/players/playerOne").set(playerOne);

		// Set the turn player 1
    database.ref().child("/turn").set(1);
    
    //remove player id they leave
    database.ref("/players/playerOne").onDisconnect().remove();

//add player 2 two attributes
  } else if( (playerOne !== null) && (playerTwo === null) ) {
    var playerName = $("#name_field").val().trim();
    playerTwo = {
      name: playerName,
      win: 0,
      tie: 0,
      choice: ""
    }
    
    }

    // Add player 2 to the database
    database.ref().child("/players/playerTwo").set(playerTwo);

    // remove play if they leave
    database.ref("/players/playerTwo").onDisconnect().remove();
  });




//onclick to load game after button click

  //hide directions

  //show hands

  //show buttons

  //Fill in Make Your Move text with player number
 
//====================================================  

  
//onclick for button moves
  $("move-button").on("click", function(){
    playerChoice = $(this).attr("data-action");
    console.log(playerChoice)
    database.ref()
  })  





  //if statement to show if another user is playing
  //if connections = 2 return
  //else show 