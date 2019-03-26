$( document ).ready(function() {
//on load hide all elements except the directions
  $("#waiting-screen").hide();
  $("#player-moves").hide()
  $("#gameOutcomeContainer ").hide()
  
  });
 //====================================================

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
var playerOneChoice = null;
var playerTwoChoice = null;
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
    waitingPlayers.splice(0);
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
    waitingPlayers.splice(0);
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
    database.ref("/choicesmade").onDisconnect().remove();
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
   
    
  
    //hide directions
    $("#directions").hide();
  //if player name exists in waiting array show waiting screen
  var playerName = $("#name_field").val().trim();
  if (waitingPlayers.indexOf(playerName)!== -1){
  $("#waiting-screen").show();
  } else
  //show hands and buttons
  $("#player-moves").show();
  $(".hand").hide();
  $(".waiting-text-1").hide();
  $(".waiting-text-2").hide();

  //Fill in Make Your Move text with player number
    $(".player-display").html(playerName);

  });   
//====================================================  


   database.ref("/players/playerOne").on("value",function(childSnapshot){
     if(childSnapshot.child("name").exists()){
       playerOneName = childSnapshot.val().name;
    console.log("Player One Name is " + playerOneName);
     }
    });

    database.ref("/players/playerTwo").on("value",function(childSnapshot){
      if(childSnapshot.child("name").exists()){
        playerTwoName = childSnapshot.val().name;
     console.log("Player two name is " + playerTwoName);
      }
     });

//onclick for button moves
  $(".move-button").on("click", function(){
    if (playerOneName === $(".player-display").html()){
    playerChoice = $(this).attr("data-action");
    database.ref("players/playerOne/choice").set(playerChoice);
  } else if (playerTwoName === $(".player-display").html()){
    playerChoice = $(this).attr("data-action");
    database.ref("players/playerTwo/choice").set(playerChoice);

    }
    //database.ref().child("/players/playerTwo").set(playerTwo);
    console.log(playerChoice)
   
    //if statement to check for both choice values

    database.ref("/players/playerOne").on("value",function(childSnapshot){
      if(childSnapshot.child("choice").val() !== ""){
        playerOneChoice = childSnapshot.val().choice;
     console.log("Player one choice is " + playerOneChoice);
      }
    })

    database.ref("/players/playerTwo").on("value",function(childSnapshot){
        if(childSnapshot.child("choice").val() !== ""){
          playerTwoChoice = childSnapshot.val().choice;
       console.log("Player two choice is " + playerTwoChoice);
        }
      })

    //show waiting text if player has not made a choice
        if (playerTwoChoice == null ){
          $(".action-text").hide()
          $(".waiting-text-2").show()
          $(".move-button").hide();
        }else if(playerOneChoice == null ){
          $(".action-text").hide()
          $(".waiting-text-1").show()
          $(".move-button").hide();
        }

   if ((playerOneChoice !== null && playerTwoChoice !== null)){
     console.log("choice before choiceset for player one: " +playerOneChoice);
     console.log("choice before choiceset for player two: " +playerTwoChoice);
    database.ref().child("/choicesmade").set(true);

   }


      
});

//==================================================== 
function gameReset() {
  database.ref().child("/choicesmade").remove();
  database.ref().child("/players/playerOne/choice").set("");
  database.ref().child("/players/playerTwo/choice").set("");
  playerOneChoice = null;
  playerTwoChoice = null;
  $("#gameOutcomeContainer").hide();
  $(".hand").hide();
  $(".move-button").show();
  $("#thumbs-up1").show();
  $("#thumbs-up2").show();
  $(".waiting-text-1").hide();
  $(".waiting-text-2").hide();
  $(".action-text").show();
  /*var playerDisplay = $("<span class='player-display'>" + playerName + "</span>")
  $(".action-text").text("Make Your Move ")
  $(".action-text").append(playerDisplay)*/
  
}

//====================================================  
database.ref("/choicesmade").on("value",function(snapshot){
  if(snapshot.val() == true){

  //if playerone choice is rock show rock image
  if (playerOneChoice == "rock"){
    $("#thumbs-up1").hide();
    $("#player1-rock").show();
  }else if(playerOneChoice == "paper"){
    $("#thumbs-up1").hide();
    $("#player1-paper").show();
  }else if(playerOneChoice == "scissors"){
    $("#thumbs-up1").hide();
    $("#player1-scissors").show();
  }




  //if playertwo choice is rock show rock image
  if (playerTwoChoice == "rock"){
    $("#thumbs-up2").hide();
    $("#player2-rock").show();
  }else if(playerTwoChoice == "paper"){
    $("#thumbs-up2").hide();
    $("#player2-paper").show();
  }else if(playerTwoChoice == "scissors"){
    $("#thumbs-up2").hide();
    $("#player2-scissors").show();
  }

  //if playerone choice = to player two tie
  if (playerOneChoice == playerTwoChoice){
    //$("#player-moves").hide()
    $(".gameOutcome").text("It's a tie!");
    $("#gameOutcomeContainer ").show();
    $(".move-button").hide();

  }
  //if player one chose rock
  if (playerOneChoice == "rock"){

  
    //if player two chose paper
    if(playerTwoChoice == "paper"){
    //  $("#player-moves").hide()
    $(".gameOutcome").text("Player Two Wins!");
    $("#gameOutcomeContainer ").show();
    $(".move-button").hide();
    }
    //if player two chose scissors
    if(playerTwoChoice == "scissors"){
    //  $("#player-moves").hide()
    $(".gameOutcome").text("Player One Wins!");
    $("#gameOutcomeContainer ").show();
    $(".move-button").hide();
    }
    }
  
    //if player one chose paper
    if (playerOneChoice == "paper"){

  
      //if player two chose rock
      if(playerTwoChoice == "rock"){
       // $("#player-moves").hide()
      $(".gameOutcome").text("Player One Wins!");
      $("#gameOutcomeContainer ").show();
      $(".move-button").hide();
      }
      //if player two chose scissors
      if(playerTwoChoice == "scissors"){
       // $("#player-moves").hide()
      $(".gameOutcome").text("Player Two Wins!");
      $("#gameOutcomeContainer ").show();
      $(".move-button").hide();
      }
      }
   

  //if player one chose scissors
  if (playerOneChoice == "scissors"){

  
    //if player two chose paper
    if(playerTwoChoice == "paper"){
     // $("#player-moves").hide()
    $(".gameOutcome").text("Player One Wins!");
    $("#gameOutcomeContainer ").show();
    $(".move-button").hide();
    }
    //if player two chose rock
    if(playerTwoChoice == "rock"){
     // $("#player-moves").hide()
    $(".gameOutcome").text("Player Two Wins!");
    $("#gameOutcomeContainer ").show();
    $(".move-button").hide();
    }
    }
  }
});

$("#game-reset").on("click",function(){
  gameReset();
})

