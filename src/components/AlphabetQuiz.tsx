import React, { useState, useEffect } from 'react';
import { Character, WritingSystem, getWritingSystemById, writingSystems } from '../models/alphabets';
import { speak, stopSpeaking } from '../utils/tts';

interface QuizQuestion {
  character: Character;
  options: string[];
  correctAnswer: string;
}

interface AlphabetQuizProps {
  writingSystemId?: string;
  onSystemChange?: (systemId: string) => void;
}

function AlphabetQuiz({ writingSystemId = 'katakana', onSystemChange }: AlphabetQuizProps): React.ReactElement {
  const [selectedSystem, setSelectedSystem] = useState<WritingSystem | undefined>(
    getWritingSystemById(writingSystemId)
  );
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Update selected system when prop changes
  useEffect(() => {
    const system = getWritingSystemById(writingSystemId);
    setSelectedSystem(system);
  }, [writingSystemId]);

  // Generate a random question based on the selected writing system
  const generateQuestion = () => {
    // Reset states
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowAnswer(false);
    
    if (!selectedSystem || selectedSystem.characters.length === 0) return;
    
    // Pick a random character
    const randomIndex = Math.floor(Math.random() * selectedSystem.characters.length);
    const character = selectedSystem.characters[randomIndex];
    
    // Generate 3 wrong options
    let options = [character.romaji];
    while (options.length < 4) {
      const wrongIndex = Math.floor(Math.random() * selectedSystem.characters.length);
      const wrongOption = selectedSystem.characters[wrongIndex].romaji;
      if (!options.includes(wrongOption)) {
        options.push(wrongOption);
      }
    }
    
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      character,
      options,
      correctAnswer: character.romaji
    });
  };

  // Initialize with a question when component mounts or selected system changes
  useEffect(() => {
    generateQuestion();
  }, [selectedSystem]);

  // Handle answer selection
  const handleSelectAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent changing answer once submitted
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    
    setTotalQuestions(prev => prev + 1);
    setShowAnswer(true);
    
    // After 2 seconds, move to next question
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  };

  // Function to pronounce the current character
  const pronounceCharacter = async () => {
    if (!currentQuestion || !selectedSystem) return;
    
    setIsSpeaking(true);
    try {
      // Get voice for the current language
      const voices = await window.speechSynthesis.getVoices();
      const languageVoice = voices.find(voice => voice.lang.includes(selectedSystem.language));
      
      if (languageVoice) {
        await speak(currentQuestion.character.character, languageVoice);
      } else {
        // Fallback - just say the romaji
        await speak(currentQuestion.character.romaji);
      }
    } catch (err) {
      console.error('Error pronouncing character:', err);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Calculate accuracy percentage
  const accuracy = totalQuestions > 0 
    ? Math.round((score / totalQuestions) * 100) 
    : 0;

  // Handle writing system change
  const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSystemId = e.target.value;
    const system = getWritingSystemById(newSystemId);
    setSelectedSystem(system);
    
    // Reset scores when changing systems
    setScore(0);
    setTotalQuestions(0);
    
    // Notify parent component about the change
    if (onSystemChange) {
      onSystemChange(newSystemId);
    }
  };

  if (!selectedSystem || !currentQuestion) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="writingSystem" className="block text-sm font-medium text-gray-700 mb-1">
          Select Writing System
        </label>
        <select
          id="writingSystem"
          className="select w-full mb-4"
          value={selectedSystem.id}
          onChange={handleSystemChange}
        >
          {writingSystems.map(system => (
            <option key={system.id} value={system.id}>
              {system.name} - {system.description}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <span className="font-medium">Score: {score}/{totalQuestions}</span>
          <div className="text-sm text-gray-500">Accuracy: {accuracy}%</div>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={generateQuestion}
        >
          Skip Question
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="text-8xl mb-4">{currentQuestion.character.character}</div>
        <button 
          className={`p-2 rounded-full ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          onClick={isSpeaking ? stopSpeaking : pronounceCharacter}
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Choose the correct reading:</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`p-4 text-lg font-medium text-center rounded-lg border-2 transition-colors
              ${selectedAnswer === option 
                ? (isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                : showAnswer && option === currentQuestion.correctAnswer 
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            onClick={() => handleSelectAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div className="mt-6 text-center">
          <p className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {isCorrect ? 'Correct!' : `Wrong! The correct answer is ${currentQuestion.correctAnswer}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default AlphabetQuiz;
