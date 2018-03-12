

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyClgK3oplQighu63BSPTBvBQjWIt0PK_Q8",
    authDomain: "train-scheduler-fa4e9.firebaseapp.com",
    databaseURL: "https://train-scheduler-fa4e9.firebaseio.com",
    projectId: "train-scheduler-fa4e9",
    storageBucket: "",
    messagingSenderId: "112128974533"
  };
  firebase.initializeApp(config);


  var database = firebase.database();

  // 2. Button for adding a train
$("#submitBtn").on("click", function(event){
    event.preventDefault();

     // Grabs user input
  var trainName = $("#trainName").val().trim();
  var trainDestination = $("#destination").val().trim();
 
  var timeholder = $("#trainStart").val().trim();
 
  var trainStart = moment(timeholder,"HH:mm");
  console.log("Hour: " + trainStart.hour());
console.log("Minute: " + trainStart.minute());

  var trainfrequency = $("#frequency").val().trim();
  var trainNextArival = 0;
  var trainMinAway = 0;

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name:        trainName,
    destination: trainDestination,
    start:       trainStart.valueOf(),
    frequency:   trainfrequency,   
    arival:      trainNextArival,
    min:         trainMinAway   
  };

   // Uploads employee data to the database
   database.ref().push(newTrain);

   // Logs everything to console
   console.log(newTrain.name);
   console.log(newTrain.destination);
   console.log(newTrain.start);
   console.log(newTrain.frequency);
   console.log(newTrain.arival);
   console.log(newTrain.min);
 
   // Alert
   alert("Train successfully added");
 
   // Clears all of the text-boxes
   $("#trainName").val("");
   $("#destination").val("");
   $("#trainStart").val("");
   $("#frequency").val("");
   $("#arival").val("");
   $("#minAway").val("");

 });

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainfrequency = childSnapshot.val().frequency;
    var trainNextArival = childSnapshot.val().arival;
    var trainMinAway = childSnapshot.val().min;
  
    // Employee Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(moment(trainStart).format("HH:mm"));
    console.log(trainfrequency);
    console.log(trainNextArival);
    console.log(trainMinAway);
  
    // Prettify the employee start
    // var empStartPretty = moment.unix(trainStart).format("MM/DD/YY");
  
    // Calculate the months worked using hardcore math
    // To calculate the months worked
    // var empMonths = moment().diff(moment.unix(trainStart, "X"), "months");
    // console.log(empMonths);
  
    // // Calculate the total billed rate
    // var empBilled = empMonths * empRate;
    // console.log(empBilled);
  
    var firstTime = moment(trainStart).format("HH:mm");

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainfrequency;
    console.log(tRemainder);

    // Minute Until Train
    var trainMinAway = trainfrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + trainMinAway);

    // Next Train
    var trainNextArival = moment().add(trainMinAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(trainNextArival).format("hh:mm"));
    // Add each train's data into the table
    $("#train-table > tbody").append(
        "<tr><td>" + trainName + 
        "</td><td>" + trainDestination + 
        "</td><td>" + moment(trainStart).format("HH:mm") + 
        "</td><td>" + trainfrequency + 
        "</td><td>" + moment(trainNextArival).format("HH:mm") + 
        "</td><td>" + trainMinAway + "</td></tr>");
  });
  



