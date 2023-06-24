let selectedLessonNumber;

function setLessonNumber(lessonNumber) {
  selectedLessonNumber = lessonNumber;
  window.location.href = `/lesson${lessonNumber}`; // Redirect to the specific lesson page
}

module.exports = { setLessonNumber };
