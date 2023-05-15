import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CoursePage() {
  const router = useRouter();
  const { title } = router.query;
  const [course, setCourse] = useState(null);
  

  useEffect(() => {
    if (title) {
      fetchCourse();
    }
  }, [title]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${encodeURIComponent(title)}`);
      const courseData = res.data;
      normalizeCourseData(courseData); // Normalize the course data
      setCourse(courseData);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const normalizeCourseData = (courseData) => {
    // Normalize the course data to handle the case where answer is a string instead of an array
    courseData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (typeof question.answer === 'string') {
          question.answer = [question.answer];
        }
      });
    });
  };

  const handleAnswerChange = (sectionIndex, questionIndex, answerIndex) => {
    const updatedCourse = { ...course };
    updatedCourse.sections[sectionIndex].questions[questionIndex].userAnswer = answerIndex;
    setCourse(updatedCourse);
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/courses/submit-answer`, course); // Update the URL to match your endpoint
      // Handle success or redirect
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Handle error state or display an error message
    }
  };
  

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      {course.sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h2>{section.title}</h2>
          {section.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <p>{question.question}</p>
              <ul>
                {question.possibleAnswers.map((answer, answerIndex) => (
                  <li key={answerIndex}>
                    <label>
                      <input
                        type="checkbox"
                        checked={question.userAnswer === answerIndex}
                        onChange={() => handleAnswerChange(sectionIndex, questionIndex, answerIndex)}
                      />
                      {answer}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={handleSubmit}>
        Submit Answers
      </button>
    </div>
  );
}
