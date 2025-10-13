import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { levelAPI, progressAPI } from '../services/api';
import stringSimilarity from 'string-similarity';

export default function QuizPage() {
  const { levelNumber } = useParams();
  const navigate = useNavigate();

  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [levelNumber]);

  const fetchQuestions = async () => {
    try {
      const response = await levelAPI.getLevelQuestions(levelNumber);
      setLevel(response.data.level);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Text-to-Speech: Speak question
  const speakQuestion = useCallback(() => {
    if (!currentQuestion) return;

    const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQuestion && !answered) {
      speakQuestion();
    }
  }, [currentQuestion, answered, speakQuestion]);

  // Speech-to-Text: Listen to user's answer
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setFeedback('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setRecognizedText('');
      setFeedback('Listening... Speak now! 🎤');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      processVoiceAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setFeedback('Could not recognize speech. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Process voice answer with fuzzy matching
  const processVoiceAnswer = async (transcript) => {
    if (!currentQuestion) return;

    setFeedback(`You said: "${transcript}"`);

    // Fuzzy match against options
    const similarities = currentQuestion.options.map((option) =>
      stringSimilarity.compareTwoStrings(transcript.toLowerCase(), option.toLowerCase())
    );

    const maxSimilarity = Math.max(...similarities);
    const matchedIndex = similarities.indexOf(maxSimilarity);

    if (maxSimilarity >= 0.7) {
      const matchedOption = currentQuestion.options[matchedIndex];
      setSelectedOption(matchedOption);
      await checkAnswer(matchedOption);
    } else {
      setFeedback('Could not match your answer. Please try again or click an option.');
      handleIncorrectAnswer();
    }
  };

  // Check answer against backend
  const checkAnswer = async (option) => {
    try {
      const response = await levelAPI.checkAnswer({
        questionId: currentQuestion._id,
        selectedOption: option,
      });

      const { correct, correctAnswer: correct_answer } = response.data;
      setCorrectAnswer(correct_answer);
      setAnswered(true);

      if (correct) {
        setFeedback('✅ Correct! Well done!');
        setScore(score + 1);
      } else {
        setFeedback(`❌ Incorrect. The correct answer is: ${correct_answer}`);
        handleIncorrectAnswer();
      }
    } catch (err) {
      console.error('Error checking answer:', err);
      setFeedback('Error checking answer. Please try again.');
    }
  };

  const handleIncorrectAnswer = () => {
    const newIncorrectCount = incorrectAttempts + 1;
    setIncorrectAttempts(newIncorrectCount);

    if (newIncorrectCount >= 3) {
      setTimeout(() => {
        endQuiz(true); // Failed
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedOption('');
      setCorrectAnswer('');
      setFeedback('');
      setRecognizedText('');
    } else {
      endQuiz(false); // Completed successfully
    }
  };

  const endQuiz = async (failed) => {
    if (failed) {
      alert(`You made 3 mistakes. Quiz failed. Score: 0%`);
      navigate('/levels');
      return;
    }

    // Calculate final score percentage
    const finalScore = Math.round((score / questions.length) * 100);

    try {
      await progressAPI.completeLevel({
        levelNumber: Number(levelNumber),
        score: finalScore,
      });

      alert(`Quiz completed! Your score: ${finalScore}%`);
      navigate('/levels');
    } catch (err) {
      console.error('Error saving progress:', err);
      alert('Quiz completed but could not save progress.');
      navigate('/levels');
    }
  };

  const getOptionStyle = (option) => {
    if (!answered) {
      return {
        background: selectedOption === option ? '#e0e7ff' : 'white',
        border: selectedOption === option ? '2px solid #667eea' : '2px solid #e5e7eb',
      };
    }

    if (option === correctAnswer) {
      return {
        background: '#d1fae5',
        border: '2px solid #10b981',
        color: '#065f46',
      };
    }

    if (selectedOption === option && option !== correctAnswer) {
      return {
        background: '#fee2e2',
        border: '2px solid #ef4444',
        color: '#991b1b',
      };
    }

    return {
      background: '#f9fafb',
      border: '2px solid #e5e7eb',
      color: '#6b7280',
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', fontSize: '18px' }}>Loading quiz...</p>
      </div>
    );
  }

  if (!level || questions.length === 0) {
    return (
      <div className="loading-container">
        <p style={{ fontSize: '18px' }}>No questions available for this level.</p>
        <button onClick={() => navigate('/levels')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Levels
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
              {level.title}
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
            }}>
              Mistakes: {incorrectAttempts}/3
            </div>
            <button onClick={() => navigate('/levels')} className="btn btn-secondary">
              Exit
            </button>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="card" style={{ padding: '40px' }}>
          {/* Level Image */}
          <div style={{
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}>
            <img
              src={level.imageUrl}
              alt={level.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Question Image */}
          <div style={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}>
            <img
              src={currentQuestion.imageUrl}
              alt="Question"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Question Text */}
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            {currentQuestion.questionText}
          </h3>

          {/* Replay Button */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              onClick={speakQuestion}
              className="btn btn-secondary"
              disabled={answered}
            >
              🔊 Replay Question
            </button>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !answered && checkAnswer(option)}
                disabled={answered}
                style={{
                  ...getOptionStyle(option),
                  padding: '20px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: answered ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>

          {/* Voice Input Button */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              onClick={startListening}
              disabled={answered || isListening}
              className="btn btn-primary btn-large"
              style={{
                fontSize: '20px',
                padding: '20px 40px',
              }}
            >
              {isListening ? '🎙️ Listening...' : '🎙️ Speak Your Answer'}
            </button>
          </div>

          {/* Feedback Area */}
          {feedback && (
            <div style={{
              padding: '20px',
              background: answered
                ? selectedOption === correctAnswer
                  ? '#d1fae5'
                  : '#fee2e2'
                : '#dbeafe',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: answered
                  ? selectedOption === correctAnswer
                    ? '#065f46'
                    : '#991b1b'
                  : '#1e40af',
              }}>
                {feedback}
              </p>
              {recognizedText && (
                <p style={{ fontSize: '14px', marginTop: '8px', color: '#6b7280' }}>
                  Recognized: "{recognizedText}"
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleNextQuestion}
                className="btn btn-success btn-large"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Quiz ✓'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}