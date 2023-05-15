import { useState } from 'react';
import axios from 'axios';

export default function CreateCourse() {
  const [courseTitle, setCourseTitle] = useState('');
  const [sections, setSections] = useState([{ title: '', questions: [{ question: '', possibleAnswers: [''], correctAnswerIndex: null, userAnswer: '' }] }]);

  const handleSectionTitleChange = (index, event) => {
    const updatedSections = [...sections];
    updatedSections[index].title = event.target.value;
    setSections(updatedSections);
  };

  const handleQuestionChange = (sectionIndex, questionIndex, event) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].question = event.target.value;
    setSections(updatedSections);
  };

  const handleAnswerChange = (sectionIndex, questionIndex, answerIndex, event) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].possibleAnswers[answerIndex] = event.target.value;
    setSections(updatedSections);
  };

  const handleCorrectAnswerChange = (sectionIndex, questionIndex, answerIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].correctAnswerIndex = answerIndex;
    setSections(updatedSections);
  };

  const handleUserAnswerChange = (sectionIndex, questionIndex, event) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].userAnswer = event.target.value;
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: '', questions: [{ question: '', possibleAnswers: [''], correctAnswerIndex: null, userAnswer: '' }] }]);
  };

  const handleAddQuestion = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push({ question: '', possibleAnswers: [''], correctAnswerIndex: null, userAnswer: '' });
    setSections(updatedSections);
  };

  const handleAddAnswer = (sectionIndex, questionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].possibleAnswers.push('');
    setSections(updatedSections);
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the course data to the server
      const response = await axios.post('/api/courses/create-course', {
        title: courseTitle,
        sections,
      });

      const { id } = response.data;

      // Redirect to the newly created course page
      window.location.href = `/courses/${id}`;
    } catch (error) {
      console.error('Error creating course:', error);
      // Handle error state or display an error message
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Course</h1>
      <form onSubmit={handleCourseSubmit}>
        <div className="mb-4">
          <label htmlFor="courseTitle" className="block mb-2 font-bold">
            Course Title:
          </label>
          <input
            type="text"
            id="courseTitle"
            value={courseTitle}
            onChange={(event) => setCourseTitle(event.target.value)}
            className="w-full p-2 border rounded text-black"
          />
        </div>
  
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            <div className="mb-2">
              <label htmlFor={`sectionTitle${sectionIndex}`} className="block mb-1 font-bold">
                Section Title:
              </label>
              <input
                type="text"
                id={`sectionTitle${sectionIndex}`}
                value={section.title}
                onChange={(event) => handleSectionTitleChange(sectionIndex, event)}
                className="w-full p-2 border rounded text-black"
              />
            </div>
  
            <h3 className="text-lg font-bold mb-2">Questions:</h3>
            {section.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-2">
                <label htmlFor={`question${sectionIndex}${questionIndex}`} className="block mb-1 font-bold">
                  Question:
                </label>
                <input
                  type="text"
                  id={`question${sectionIndex}${questionIndex}`}
                  value={question.question}
                  onChange={(event) => handleQuestionChange(sectionIndex, questionIndex, event)}
                  className="w-full p-2 border rounded text-black"
                />
  
                <label htmlFor={`answers${sectionIndex}${questionIndex}`} className="block mb-1 font-bold">
                  Possible Answers:
                </label>
                {question.possibleAnswers.map((answer, answerIndex) => (
                  <div key={answerIndex}>
                    <input
                      type="text"
                      id={`answer${sectionIndex}${questionIndex}${answerIndex}`}
                      value={answer.text}
                      onChange={(event) => handleAnswerChange(sectionIndex, questionIndex, answerIndex, event)}
                      className="w-full p-2 border rounded text-black"
                    />
                    <input
                      type="checkbox"
                      id={`correctAnswer${sectionIndex}${questionIndex}${answerIndex}`}
                      checked={answer.isCorrect}
                      onChange={(event) => handleCorrectAnswerChange(sectionIndex, questionIndex, answerIndex, event)}
                      className="ml-2"
                    />
                    <label htmlFor={`correctAnswer${sectionIndex}${questionIndex}${answerIndex}`} className="ml-1">
                      Correct Answer
                    </label>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddAnswer(sectionIndex, questionIndex)}>
                  Add Answer
                </button>
              </div>
            ))}
  
            <button type="button" onClick={() => handleAddQuestion(sectionIndex)} className="mb-2">
              Add Question
            </button>
          </div>
        ))}
  
        <button type="button" onClick={handleAddSection} className="mb-2">
          Add Section
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Create Course
        </button>
      </form>
    </div>
  );
}  