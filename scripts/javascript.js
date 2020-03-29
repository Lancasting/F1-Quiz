var penalty = 5;
var score = 0;
var questionNumber = 0;
let highScoreList = [];
var timerInterval;
var displayInterval;
var displayTime = 1;
var totalTimeLeft = 0;
var listEl = document.getElementById("information");
var timerEl = document.getElementById("timer");
var displayEl = document.getElementById("display");
var responseEl = document.getElementById("response");
var scoreBoardEl = document.getElementById("scoreBoard");

var question1 = {
    q: "How many championships does Lewis Hamilton have?",
    a: "6",
    options: ["4", "5", "7"]
};
var question2 = {
    q: "How many championships does Sebastian Vettel have?",
    a: "4",
    options: ["2", "3", "5",]
};
var question3 = {
    q: "How many championships does Fernando Alonso have?",
    a: "2",
    options: ["3","4","5"]
};
var questionList = [question1, question2, question3];

init();

function init() {
    displayEl.textContent = "Welcome to the Formula 1 quiz!"
    questionNumber = 0;
    totalTimeLeft = 20;
    score = 0;
    highScoreList = JSON.parse(localStorage.getItem("scorelist"));
    if (highScoreList === null) {
        highScoreList = [];
    }
    if (listEl.innerHTML === "") {
        startButton();
        timerEl.textContent = totalTimeLeft;
    }
    clearInterval(timerInterval);
    clearInterval(displayTime);
}

function populateQuiz() {
    listEl.innerHTML = "";

    if (questionNumber < questionList.length) {
        loadOptions();
    }
    else {
        loadResults();
        clearInterval(timerInterval);
    }
}
function loadOptions() {
    buildquiz();
    var randomNumber = Math.floor(Math.random() * 4);
    var optionNumber = 0;
    displayEl.textContent = questionList[questionNumber].q;
    for (var i = 0; i < 4; i++) {
        var newButton = document.createElement("button", "btn btn-primary");
        if (i === randomNumber) {
            newButton.textContent = questionList[questionNumber].a;
        }
        else {
            newButton.textContent = questionList[questionNumber].options[optionNumber];
            optionNumber++;
        }
        listEl.appendChild(newButton);
        newButton.style.marginTop = "10px";
    }


}

function buildquiz() {
    timerInterval = setInterval(function () {
        totalTimeLeft--;
        timerEl.textContent = totalTimeLeft;
        if (totalTimeLeft <= 0) {
            clearInterval(timerInterval);
            questionNumber = questionList.length;
            populateQuiz();
        }
    }, 1000)
}

function storeScoreBoard() {
    var name = document.getElementById("userName").value;
    var highScores = {
        quizTaker: name,
        quizScore: score
    };

    highScoreList.push(highScores);
    localStorage.setItem("scorelist", JSON.stringify(highScoreList));
}

function clearScore() {
    localStorage.clear();
    highScoreList = [];
}

function checkAnswer(event) {
    if (event.target.textContent === questionList[questionNumber].a) {
        startAnswerResponse("It's Lights Out!!");
        score++;
        questionNumber++;
    }
    else {
        startAnswerResponse("And he's into the wall!");
        let timeAfterPen = totalTimeLeft - penalty;
        score--;
        if (timeAfterPen <= 0) {
            totalTimeLeft = 1;
        }
        else {
            totalTimeLeft -= penalty;
        }
    }
}

function startAnswerResponse(showThis) {
    clearInterval(timerInterval);
    displayTime = 2;
    responseEl.textContent = showThis;
    if (showThis === "And he's into the wall!") {
        responseEl.setAttribute("style", "color: red");
    }
    else {
        responseEl.setAttribute("style", "color: green")
    }
    displayInterval = setInterval(function () {
        displayTime--;
        if (displayTime <= 0) {
            clearInterval(displayInterval);
            responseEl.innerHTML = "";
            responseEl.style.borderTop = "";
        }
    }, 1000);
}

var newDiv = document.createElement("li");
newDiv.setAttribute("class", "row");
listEl.appendChild(newDiv);

function startButton() {
    var newButton = document.createElement("button");
    newButton.style.backgroundColor = "green";
    newButton.textContent = "Start";
    listEl.appendChild(newButton);
}
function loadResults() {
    displayEl.textContent = "Your score is: " + score;
    timerEl.textContent = totalTimeLeft;

    var newDiv = document.createElement("li");
    newDiv.setAttribute("class", "row");
    listEl.appendChild(newDiv);

    var promptText = document.createElement("h3");
    promptText.setAttribute("class", "col-sm-3");
    promptText.textContent = "Enter your name:";
    newDiv.appendChild(promptText);

    var scoreName = document.createElement("input");
    scoreName.type = "text";
    scoreName.setAttribute("id", "userName");
    scoreName.setAttribute("class", "col-sm-4");
    newDiv.appendChild(scoreName);

    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit"
    submitButton.style.backgroundColor = "green";
    submitButton.setAttribute("class", "col-sm-3");
    newDiv.appendChild(submitButton);

    clearInterval(timerInterval);
}

function compare(firstNum, secondNum) {
    const quizScoreOne = firstNum.quizScore;
    const quizScoreTwo = secondNum.quizScore;
    var comparison = 0;
    if (quizScoreOne < quizScoreTwo)
        comparison = 1;
    else if (quizScoreOne > quizScoreTwo)
        comparison = -1;
    return comparison;
}

function loadScoreBoard() {
    listEl.innerHTML = "";
    responseEl.innerHTML = "";
    displayEl.textContent = "Scoreboard"
    highScoreList = highScoreList.sort(compare);
    clearInterval(displayInterval);
    for (var i = 0; i < highScoreList.length; i++) {
        var scoreHolder = document.createElement("li");
        listEl.appendChild(scoreHolder);
        var userName = document.createElement("h4");
        userName.textContent = highScoreList[i].quizTaker + " - ";
        scoreHolder.appendChild(userName);
        var userScore = document.createElement("h4");
        userScore.textContent = highScoreList[i].quizScore;
        scoreHolder.appendChild(userScore);
    }
    var newDiv = document.createElement("li");
    newDiv.setAttribute("class", "row");
    listEl.appendChild(newDiv);
    var clearButton = document.createElement("button")
    clearButton.textContent = "clear";
    newDiv.appendChild(clearButton);
    var returnButton = document.createElement("button");
    returnButton.textContent = "Return";
    newDiv.appendChild(returnButton);

}

scoreBoardEl.addEventListener("click", loadScoreBoard);

listEl.addEventListener("click", function (event) {
    if (event.target.matches("button")) {
        switch (event.target.textContent) {
            case "Start":
                populateQuiz();
                break;
            case "Submit":
                if (document.getElementById("userName").value === null || document.getElementById("userName").value === "") //fix this
                {
                    console.log("userI");
                    alert("This needs to be a valid entry.")
                    break;
                }
                else {
                    storeScoreBoard();
                    loadScoreBoard();
                }
                break;
            case "clear":
                clearScore();
                loadScoreBoard();
                break;
            case "Return":
                listEl.innerHTML = "";
                init();
                break;
            default:
                checkAnswer(event);
                populateQuiz();
        }
    }
});