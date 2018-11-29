var questionObject;
var question;
var correctAnswer;
var answers;
var timerID;
var timeLeft;
var questionsAnswered = 0;
var questionsCorrect = 0;
var questionsWrong = 0;

$(document).ready(function () {

    getQuestion();

});



function startQuestion() {

    $("#start-jumbotron").hide();
    $("#questionResult").hide();

    question = questionObject.question;

    correctAnswer = questionObject.correct_answer;

    answers = questionObject.incorrect_answers;
    answers = deleteUndefined(answers);
    answers.push(correctAnswer);
    //this function chooses a random way to sort the questions from one of Array.sort()'s different methods
    answers.sort(function() { return 0.5 - Math.random() });

    setQuestionFromData();
}

function restartGame () {

    $("#endGame").hide();
    $("#correctlyAnswered").hide();
    $("#incorrectlyAnswered").hide();
    $("#playAgain").hide();
    
    questionsAnswered = 0;
    questionsCorrect = 0;
    questionsWrong = 0;
    startQuestion();
}

function setQuestionFromData() {

    if(questionsAnswered === 10)
    {
        clearInterval(timerID);
        gameFinished();
    }
    else
    {
        getQuestion();
        questionsAnswered++;

        $("#questionsLeft").html(questionsAnswered + "/10");
    
        $("#question").html(question);
    
        $("#radio1Label").html(answers[0]);
        $("#radio2Label").html(answers[1]);
        $("#radio3Label").html(answers[2]);
        $("#radio4Label").html(answers[3]);
    
        timeLeft = 10000;
        timerID = setInterval(decreaseTimer , 1);
    
        $("#questionForm").show();
    }

}

function getQuestion() {

    $.get( "https://opentdb.com/api.php?amount=1&type=multiple", function(response) {
       questionObject = response.results[0];
    });

}

function deleteUndefined(array) {
    for(x = 0; x < array.lenght; x++)
    {
        if(array[x] === undefined)
        {
            array.splice(x, 1);
        }
    }
    return array;
}

function decreaseTimer () {

    var milliseconds = [];

    if(timeLeft === 0)
    {
        $("#time").html("0");
        ranOutOfTime();
    }

    timeLeft--;

    if(timeLeft > 1000)
    {
        var splitTime = timeLeft.toString().split('');

        milliseconds[0] = splitTime.pop();
        milliseconds.push(splitTime.pop());
        milliseconds.push(splitTime.pop());

        milliseconds.reverse();
        milliseconds = milliseconds.join('');

        splitTime = splitTime.join('');

        $("#time").html(splitTime + "." + milliseconds);
    }
    else
    {
        $("#time").html(timeLeft);
    }

}

function ranOutOfTime() {
    clearInterval(timerID);

    questionsWrong++;

    $("#questionForm").hide();

    $("#questionResult").html("Time's up! The correct answer was:<br>" + correctAnswer);
    $("#questionResult").show();
    
    waitForNext();
}

function waitForNext() {
    setTimeout(startQuestion, 3500);
}

function checkAnswer () {

    for(x = 1; x < answers.length + 1; x++) {

        var currentRadio = ("#radio" + x.toString());

        if($(currentRadio).is(":checked"))
        {
            $(currentRadio).prop('checked', false); 

            if(answers[x - 1] === correctAnswer) {
                answerCorrect();
                break;
            }
            else {
                answerWrong();
                break;
            }
        }
    }
}

function answerCorrect () {

    clearInterval(timerID);
    $("#questionForm").hide();

    questionsCorrect++;

    $("#questionResult").html("You got the question correct!");
    $("#questionResult").show();

    if(questionsAnswered === 10) {
        clearInterval(timerID);
        setTimeout(gameFinished, 3500);
    }
    else {
        setTimeout(startQuestion, 3500);
    }

}

function answerWrong () {

    clearInterval(timerID);
    $("#questionForm").hide();

    questionsWrong++;

    $("#questionResult").html("That's wrong! The correct answer is:<br>" + correctAnswer);
    $("#questionResult").show();

    if(questionsAnswered === 10) {
        clearInterval(timerID);
        setTimeout(gameFinished, 3500);
    }
    else {
        setTimeout(startQuestion, 3500);
    }

}

function gameFinished() {

    //so that it's ready incase they play again
    getQuestion();

    $("#questionResult").hide();

    $("#correctlyAnswered").html("Questions answered correctly: " + questionsCorrect);
    $("#incorrectlyAnswered").html("Questions answered incorrectly: " + questionsWrong);

    $("#endGame").show();
    $("#correctlyAnswered").show();
    $("#incorrectlyAnswered").show();
    $("#playAgain").show();
}