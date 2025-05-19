import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WordPuzzle, TriviaQuestion } from '@/types';

// Word puzzles
const wordPuzzles: WordPuzzle[] = [
  { scrambled: 'VIPOTCYUTDRI', answer: 'PRODUCTIVITY', hint: 'Getting things done efficiently' },
  { scrambled: 'IVTRCETYAI', answer: 'CREATIVITY', hint: 'Thinking outside the box' },
  { scrambled: 'OMINTITAVO', answer: 'MOTIVATION', hint: 'The reason for doing something' },
  { scrambled: 'CCSSUSE', answer: 'SUCCESS', hint: 'Achievement of a goal' },
  { scrambled: 'HBITSA', answer: 'HABITS', hint: 'Regular practices' }
];

// Trivia questions
const triviaQuestions: TriviaQuestion[] = [
  { 
    question: 'Which vitamin is also known as ascorbic acid?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 2
  },
  { 
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    correctAnswer: 1
  },
  { 
    question: 'What is the capital of Japan?',
    options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
    correctAnswer: 2
  },
  { 
    question: 'Which element has the chemical symbol "O"?',
    options: ['Gold', 'Oxygen', 'Iron', 'Osmium'],
    correctAnswer: 1
  },
  { 
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 2
  }
];

type GameType = 'word' | 'trivia';

export const MiniGame: React.FC = () => {
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [gameType, setGameType] = useState<GameType>('word');
  const [currentWordPuzzle, setCurrentWordPuzzle] = useState<WordPuzzle | null>(null);
  const [currentTriviaQuestion, setCurrentTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Get a random word puzzle or trivia question
  const getRandomWordPuzzle = (): WordPuzzle => {
    const randomIndex = Math.floor(Math.random() * wordPuzzles.length);
    return wordPuzzles[randomIndex];
  };
  
  const getRandomTriviaQuestion = (): TriviaQuestion => {
    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    return triviaQuestions[randomIndex];
  };
  
  // Reset the game state
  const resetGame = (type: GameType) => {
    setGameType(type);
    setAnswer('');
    setSelectedAnswer(null);
    setShowResult(false);
    
    if (type === 'word') {
      setCurrentWordPuzzle(getRandomWordPuzzle());
      setCurrentTriviaQuestion(null);
    } else {
      setCurrentTriviaQuestion(getRandomTriviaQuestion());
      setCurrentWordPuzzle(null);
    }
  };
  
  // Start a game
  const startGame = (type: GameType) => {
    resetGame(type);
    setShowGameDialog(true);
  };
  
  // Check the answer
  const checkAnswer = () => {
    if (gameType === 'word' && currentWordPuzzle) {
      const isCorrect = answer.toLowerCase() === currentWordPuzzle.answer.toLowerCase();
      setIsCorrect(isCorrect);
      setShowResult(true);
    } else if (gameType === 'trivia' && currentTriviaQuestion && selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentTriviaQuestion.correctAnswer;
      setIsCorrect(isCorrect);
      setShowResult(true);
    }
  };
  
  // Try another puzzle/question
  const tryAnother = () => {
    resetGame(gameType);
  };

  return (
    <>
      <Card className="widget-card">
        <CardHeader className="widget-card-header">
          <CardTitle className="text-lg font-semibold">Mini Games</CardTitle>
        </CardHeader>
        
        <CardContent className="widget-card-body">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <h3 className="font-medium mb-2">Word Puzzles</h3>
              <p className="text-sm text-gray-500 mb-3">Unscramble the letters to find the word</p>
              <Button 
                className="w-full bg-primary text-white"
                onClick={() => startGame('word')}
              >
                Play Now
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <h3 className="font-medium mb-2">Trivia Quiz</h3>
              <p className="text-sm text-gray-500 mb-3">Test your knowledge with fun questions</p>
              <Button 
                className="w-full bg-primary text-white"
                onClick={() => startGame('trivia')}
              >
                Play Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Dialog */}
      <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {gameType === 'word' ? 'Word Puzzle' : 'Trivia Quiz'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            {/* Word Puzzle Game */}
            {gameType === 'word' && currentWordPuzzle && (
              <>
                <h4 className="text-xl font-bold mb-4">Unscramble the word:</h4>
                <p className="text-2xl font-mono tracking-widest mb-6">
                  {currentWordPuzzle.scrambled.split('').join(' ')}
                </p>
                
                {showResult ? (
                  <div className="mb-6">
                    {isCorrect ? (
                      <div className="p-3 bg-green-100 text-green-800 rounded-md">
                        <p className="font-medium">Correct! 🎉</p>
                        <p className="text-sm mt-1">The answer is {currentWordPuzzle.answer}</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-100 text-red-800 rounded-md">
                        <p className="font-medium">Not quite!</p>
                        <p className="text-sm mt-1">The correct answer is {currentWordPuzzle.answer}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full px-4 py-2 text-center"
                        placeholder="Type your answer..."
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm text-gray-500"
                        onClick={() => alert(currentWordPuzzle.hint)}
                      >
                        Need a hint?
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
            
            {/* Trivia Quiz Game */}
            {gameType === 'trivia' && currentTriviaQuestion && (
              <>
                <h4 className="text-xl font-bold mb-4">Question:</h4>
                <p className="text-lg mb-6">{currentTriviaQuestion.question}</p>
                
                {showResult ? (
                  <div className="mb-6">
                    {isCorrect ? (
                      <div className="p-3 bg-green-100 text-green-800 rounded-md">
                        <p className="font-medium">Correct! 🎉</p>
                        <p className="text-sm mt-1">
                          The answer is {currentTriviaQuestion.options[currentTriviaQuestion.correctAnswer]}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-100 text-red-800 rounded-md">
                        <p className="font-medium">Not quite!</p>
                        <p className="text-sm mt-1">
                          The correct answer is {currentTriviaQuestion.options[currentTriviaQuestion.correctAnswer]}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 mb-6">
                    {currentTriviaQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        className={`w-full p-3 rounded-md border ${
                          selectedAnswer === index
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            
            <div>
              {showResult ? (
                <Button
                  className="w-full inline-flex justify-center px-4 py-2 bg-primary text-white"
                  onClick={tryAnother}
                >
                  Try Another
                </Button>
              ) : (
                <Button
                  className="w-full inline-flex justify-center px-4 py-2 bg-primary text-white"
                  onClick={checkAnswer}
                  disabled={(gameType === 'word' && !answer) || (gameType === 'trivia' && selectedAnswer === null)}
                >
                  Check Answer
                </Button>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGameDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MiniGame;
