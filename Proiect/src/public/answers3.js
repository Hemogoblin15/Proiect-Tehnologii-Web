document
  .getElementById("quiz-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const answers = {};

    answers.question1 = document.querySelector(
      'input[name="first"]:checked'
    ).id;
    answers.question2 = document.querySelector(
      'input[name="second"]:checked'
    ).id;
    answers.question3 = document.querySelector(
      'input[name="third"]:checked'
    ).id;
    answers.question4 = document.querySelector(
      'input[name="fourth"]:checked'
    ).id;
    answers.question5 = document.querySelector(
      'input[name="fifth"]:checked'
    ).id;

    const correctAnswers = {
      question1: "2",
      question2: "2",
      question3: "3",
      question4: "2",
      question5: "2",
    };
    const result = calculateScore(answers, correctAnswers);
    displayResult(result);
  });
function calculateScore(answers, correctAnswers) {
  let score = 0;
  for (const question in answers) {
    if (answers[question] === correctAnswers[question]) {
      score++;
    }
  }

  const result = {
    score: score,
    totalQuestions: Object.keys(correctAnswers).length,
  };

  return result;
}

function displayResult(result) {
  console.log(result);
  // Display the result on the webpage or perform any other desired actions
}
