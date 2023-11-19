/* 
Group Members: Jason Bell (2203345)
               Travaughn Oldacre (2209355)
               Giovaunni Sewell (2207365)
               Anthony Allen Jr. (2210148)
               Kay-Ann Green (2110490)

Title: Math Game (CIT2011 GROUP PROJECT)
Date: November 18, 2023 
*/


// .........................................................
// Task 1: calculate Age
const dob = document.getElementById("dob");
const age = document.getElementById("age");

dob.addEventListener("input", function () {
  const dobValue = new Date(dob.value);
  const today = new Date();
  const ageValue = today.getFullYear() - dobValue.getFullYear();
  age.value = ageValue + " Years old";
});

let totalQuestions = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;


// Global storage entity
let PlayerRegistrationData = JSON.parse(localStorage.getItem('PlayerRegistrationData')) || [];

// Current player and question details
let currentPlayerIndex = null;
let currentQuestion = {};

document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for form submission
    document.getElementById('registrationForm').addEventListener('submit', Register);
    // Initially disable the 'Check Answer' and 'End Game' buttons
    document.getElementById('checkAnswerBtn').disabled = true;
    document.getElementById('endBtn').disabled = true;
});


// Function to handle player registration
function Register() {
    // Retrieve player information from form fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isValidEmail = emailPattern.test(email);

    let correct_answers = 0;
    let incorrect_answers = 0;
    let total_questions = 0;

    if(firstName.length >= 3 && lastName.length >= 3 && isValidEmail){
         // Create a player object with the provided data and an empty gameData array
         const player = {
            firstName,
            lastName,
            dob,
            age,
            gender,
            email,
            correct_answers,
            incorrect_answers,
            total_questions,
            date: new Date(),
        };

        // Get individual date components
        player.month = player.date.getMonth() + 1;
        player.day = player.date.getDate();
        player.year = player.date.getFullYear();

        disableForm(true);

        // Enable the 'Start Game' button to allow the player to begin playing
        document.getElementById('startBtn').disabled = false;

        // Add new player to the global storage and save to localStorage
        PlayerRegistrationData.push(player);
        console.log(player);
        currentPlayerIndex = PlayerRegistrationData.length - 1;
        localStorage.setItem('PlayerRegistrationData', JSON.stringify(PlayerRegistrationData));

        alert('Registration successful! Click Start to play game');
        document.getElementById('registrationForm').reset(); 
    }
}
// .........................................................
// Function to validate if the calculated age is within the acceptable range
function validateAge(age) {
    return age >= 8 && age <= 12;
}
// .........................................................
// Function to enable or disable the registration form fields
function disableForm(disabled) {
    document.getElementById('registrationForm').querySelectorAll('.form-control').forEach(element => {
        element.disabled = disabled;
    });
    document.getElementById('registerBtn').disabled = disabled;
}
// .........................................................
//task 4
// Function to start the game by generating a new multiplication question
function PlayGame() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    currentQuestion = { num1, num2, operation: '*', answer: num1 * num2 };
    
    const equation = `${num1} x ${num2} = ?`;
    document.getElementById('playArea').textContent = equation;

    document.getElementById('checkAnswerBtn').disabled = false;
    document.getElementById('endBtn').disabled = false;
    console.log(totalQuestions + "total before");

    totalQuestions++;
    console.log(totalQuestions + "total after");
}
// .........................................................
//task 6
// Function to check the player's answer against the correct answer
function CheckAnswer() {
  
    // Check if there's a current game in progress
    if (currentPlayerIndex === null || !currentQuestion) {
      outputMessages('No active game found. Please start a new game.');
      alert('No active game found. Please start a new game.');
      return;
    }
  
    // Attempt to retrieve the player's answer from the input field
    const playerResponseElement = document.getElementById('playerAns');
    if (!playerResponseElement) {
      outputMessages("Answer input field not found.");
      alert('Answer input field not found.');
      return;
    }
  
    // Trim whitespace and check if the response is empty
    const playerResponse = playerResponseElement.value.trim();
    if (playerResponse === '') {
      outputMessages("Please enter an answer before submitting.");
      alert('Please enter an answer before submitting.');
      return;
    }
  
    // Convert the response to an integer and validate it's a number
    const playerAns = parseInt(playerResponse, 10);
    if (isNaN(playerAns)) {
      outputMessages("Please enter a valid number as the answer.");
      alert('Please enter a valid number as the answer.');
      return;
    }
  
    // Determine if the player's answer matches the correct answer
    const isCorrect = playerAns === currentQuestion.answer;
  
    // Update the player's answers directly in the player object
    const currentPlayer = PlayerRegistrationData[currentPlayerIndex];
    if (isCorrect) {
        currentPlayer.correct_answers++;
        console.log("currentplayer.correct_answer = " + currentPlayer.correct_answers + "\n");
    } else {
        currentPlayer.incorrect_answers++;
        console.log("currentplayer.incorrect_answer = " + currentPlayer.incorrect_answers + "\n");
    }
    currentPlayer.total_questions++;
    console.log("currentplayer.total_questions = " + currentPlayer.total_questions + "\n");

    // Update the player data in localStorage with the new answers
    localStorage.setItem('PlayerRegistrationData', JSON.stringify(PlayerRegistrationData));
    // Clear the answer input field after processing
    playerResponseElement.value = '';
  
      
    // Provide feedback to the player based on whether their answer was correct
    if (isCorrect) {
        // Increment the number of correct or incorrect answers and the total number of questions
        PlayerRegistrationData[currentPlayerIndex].correct_answers++;
        outputMessages("Correct answer! Great job!");
        alert('Correct answer! Great job!');
    } else {
      PlayerRegistrationData[currentPlayerIndex].incorrect_answers++;
        outputMessages(`Incorrect answer. The correct answer was ${currentQuestion.answer}.`);
        alert(`Incorrect answer. The correct answer was ${currentQuestion.answer}.`);
    } PlayerRegistrationData[currentPlayerIndex].total_questions++;
      


    // Retrieve existing data from local storage
    const existingData = JSON.parse(localStorage.getItem("PlayerRegistrationData")) || [];

    // Get last object from existing data array
    const lastRecord = existingData[existingData.length - 1];


    // Store the updated data back in local storage
    localStorage.setItem("PlayerRegistrationData", JSON.stringify(existingData));
    
    PlayGame();
    // console.log(stats);
    // Task 14 
    showCharts();
 
  }
  
// .........................................................
// Show messages
function outputMessages(message) {
    const messageOutput = document.getElementById("messageOutput");
    messageOutput.textContent = message;
  }
// .........................................................
function showAllPlayers() {
  const showAllPlayersTextarea = document.getElementById("showallplayers");
  const playerData = JSON.parse(localStorage.getItem("PlayerRegistrationData")) || [];

  let allPlayersInfo = '';

  playerData.forEach((player, index) => {
      const playerInfo = `
Player ${index + 1}:
Name: ${player.firstName} ${player.lastName}
Number of Questions: ${player.total_questions}
Correct Answers: ${player.correct_answers}
Incorrect Answers: ${player.incorrect_answers}
Percentage: ${((player.correct_answers / player.total_questions) * 100).toFixed(2)}%
Date: ${player.month}/${player.day}/${player.year}

          --------------------------------------------
      `;

      allPlayersInfo += playerInfo;
  });

  showAllPlayersTextarea.value = allPlayersInfo;

  console.log("All Players Information:");
  console.log(allPlayersInfo);
}


function findPercentageScore() {
  const showPercentageArea = document.getElementById("showPercentageArea");
  const playerData = JSON.parse(localStorage.getItem("PlayerRegistrationData"));
  const player = playerData?.[playerData.length - 1] ?? {};

  player.percentage = ((player.correct_answers / player.total_questions) * 100).toFixed(2);
  const date = new Date();
    player.date = date;
    player.month = date.getMonth() + 1;
    player.day = date.getDate();
    player.year = date.getFullYear();

  const stats =`
    Name: ${player.firstName} ${player.lastName}
    Number of Questions: ${player.total_questions}
    Correct Answers: ${player.correct_answers}
    Incorrect Answers: ${player.incorrect_answers}
    Percentage: ${player.percentage}%
    Date: ${player.month}/${player.day}/${player.year}`;

  const setStats = () => showPercentageArea.innerHTML = stats;
  setStats();

  console.log(stats); // Log the entire player object
  showAllPlayers();
  updateProgressBars();
}
  
// Task 15
function updateProgressBars() {
  const playerData = JSON.parse(localStorage.getItem("PlayerRegistrationData"));

  if (playerData) {
      const totalPlayers = playerData.length;

      // Update gender progress bars
      const maleCount = playerData.filter((record) => record.gender === "male").length;
      const femaleCount = playerData.filter((record) => record.gender === "female").length;
      const malePercentage = (maleCount / totalPlayers) * 100;
      const femalePercentage = (femaleCount / totalPlayers) * 100;

      document.getElementById("maleProgressBar").style.width = `${malePercentage}%`;
      document.getElementById("maleLabel").innerText = `${malePercentage.toFixed(1)}%`;

      document.getElementById("femaleProgressBar").style.width = `${femalePercentage}%`;
      document.getElementById("femaleLabel").innerText = `${femalePercentage.toFixed(1)}%`;

      // Update score progress bars
      const scoreRanges = [0, 0, 0, 0, 0, 0, 0];
      playerData.forEach((record) => {
          const percentage = (record.correct_answers / record.total_questions) * 100;

          if (percentage < 50) scoreRanges[0]++;
          else if (percentage >= 50 && percentage < 60) scoreRanges[1]++;
          else if (percentage >= 60 && percentage < 70) scoreRanges[2]++;
          else if (percentage >= 70 && percentage < 80) scoreRanges[3]++;
          else if (percentage >= 80 && percentage < 90) scoreRanges[4]++;
          else if (percentage >= 90 && percentage < 100) scoreRanges[5]++;
          else if (percentage === 100) scoreRanges[6]++;
      });

      const scoreRangeLabels = ["0-49%", "50-59%", "60-69%", "70-79%", "80-89%", "90-99%", "100%"];

      for (let i = 0; i < scoreRanges.length; i++) {
          const scorePercentage = (scoreRanges[i] / totalPlayers) * 100;
          document.getElementById(`scoreRange${i}`).style.width = `${scorePercentage}%`;
          document.getElementById(`scoreLabel${i}`).innerText = `${scorePercentage.toFixed(1)}%`;
      }
  }
}


// Call the function to update progress bars when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//   updateProgressBars();
// });


// Call the updateProgressBars function every 5 seconds after the page loads
window.addEventListener("load", function () {
  updateProgressBars();
  setInterval(updateProgressBars, 5000);
});

// .........................................................
// Function to end the current game
function EndGame() {
    disableForm(false);
    document.getElementById('startBtn').disabled = true;
    document.getElementById('checkAnswerBtn').disabled = true;
    document.getElementById('endBtn').disabled = true;
    currentPlayerIndex = null;
    alert('Game has ended. You can register a new player now.');
}


