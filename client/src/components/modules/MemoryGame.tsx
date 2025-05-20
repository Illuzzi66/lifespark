import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Award, Clock3, RotateCcw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

// Card types with emojis for the memory game
interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Different difficulty levels
type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Emoji sets for the game
const emojiSets = {
  nature: ['🌲', '🌻', '🌵', '🌊', '🍄', '🦋', '🐢', '🦊', '🦁', '🐘', '🦒', '🐬'],
  food: ['🍕', '🍔', '🍦', '🍎', '🍓', '🥑', '🍇', '🍰', '🍩', '🍗', '🌮', '🥐'],
  travel: ['🚗', '✈️', '🚢', '🚂', '🏝️', '🏰', '🗽', '🎡', '🏔️', '🌋', '🌉', '🏙️'],
};

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [theme, setTheme] = useState<keyof typeof emojiSets>('nature');
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Initialize the game with cards based on difficulty
  const initializeGame = () => {
    // Reset game state
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameCompleted(false);

    // Determine number of pairs based on difficulty
    let numPairs = 6; // easy
    if (difficulty === 'medium') numPairs = 8;
    if (difficulty === 'hard') numPairs = 12;

    // Create pairs of cards
    const selectedEmojis = emojiSets[theme].slice(0, numPairs);
    let initialCards: MemoryCard[] = [];

    // Create pairs of each emoji
    selectedEmojis.forEach((emoji, index) => {
      const card1: MemoryCard = {
        id: index * 2,
        emoji,
        isFlipped: false,
        isMatched: false
      };
      
      const card2: MemoryCard = {
        id: index * 2 + 1,
        emoji,
        isFlipped: false,
        isMatched: false
      };
      
      initialCards.push(card1, card2);
    });

    // Shuffle the cards
    initialCards = shuffleCards(initialCards);
    setCards(initialCards);
  };

  // Shuffle an array of cards
  const shuffleCards = (cardArray: MemoryCard[]): MemoryCard[] => {
    const shuffled = [...cardArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start the game
  const startGame = (level: DifficultyLevel, themeChoice: keyof typeof emojiSets) => {
    setDifficulty(level);
    setTheme(themeChoice);
    setGameStarted(true);
    
    // Track game start in analytics
    trackEvent('memory_game_start', 'engagement', `${level}_${themeChoice}`);
    
    // Initialize with the chosen settings
    initializeGame();
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore clicks if two cards are already flipped
    if (flippedCards.length === 2) return;
    
    // Ignore clicks on already matched or flipped cards
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.isMatched || flippedCards.includes(id)) return;

    // Flip the card
    const newCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const firstCardId = newFlippedCards[0];
      const secondCardId = newFlippedCards[1];
      const firstCard = newCards.find(card => card.id === firstCardId);
      const secondCard = newCards.find(card => card.id === secondCardId);

      // Check for match
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // It's a match
        setTimeout(() => {
          const matchedCards = newCards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(prevPairs => {
            const newPairs = prevPairs + 1;
            // Check if game is completed
            if (newPairs === matchedCards.length / 2) {
              setGameCompleted(true);
              // Track game completion
              trackEvent(
                'memory_game_complete', 
                'engagement', 
                `${difficulty}_${theme}_${moves + 1}_${timer}`
              );
              
              // Update best score if this is better than previous
              const currentScore = calculateScore();
              if (!bestScore || currentScore > bestScore) {
                setBestScore(currentScore);
                localStorage.setItem('memory_game_best_score', currentScore.toString());
              }
            }
            return newPairs;
          });
        }, 500);
      } else {
        // Not a match, flip back after a delay
        setTimeout(() => {
          const flippedBackCards = newCards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(flippedBackCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Calculate score based on moves, time, and difficulty
  const calculateScore = (): number => {
    const difficultyMultiplier = 
      difficulty === 'easy' ? 1 :
      difficulty === 'medium' ? 1.5 : 2;
    
    // Base score considering time, moves, and difficulty
    const baseScore = Math.floor(
      (1000 * difficultyMultiplier) - (moves * 10) - (timer * 2)
    );
    
    // Ensure score is positive
    return Math.max(100, baseScore);
  };

  // Effect for the timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);

  // Load best score from localStorage on mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('memory_game_best_score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Memory Match
        </CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        {!gameStarted ? (
          // Game Start Screen
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Welcome to Memory Match!</h3>
              <p className="text-gray-600 mb-4">
                Test your memory by matching pairs of cards. Select a difficulty and theme to begin.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Select Difficulty:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={difficulty === 'easy' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('easy')}
                    className="w-full"
                  >
                    Easy
                  </Button>
                  <Button 
                    variant={difficulty === 'medium' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('medium')}
                    className="w-full"
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={difficulty === 'hard' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('hard')}
                    className="w-full"
                  >
                    Hard
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Select Theme:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={theme === 'nature' ? 'default' : 'outline'}
                    onClick={() => setTheme('nature')}
                    className="w-full"
                  >
                    Nature
                  </Button>
                  <Button 
                    variant={theme === 'food' ? 'default' : 'outline'}
                    onClick={() => setTheme('food')}
                    className="w-full"
                  >
                    Food
                  </Button>
                  <Button 
                    variant={theme === 'travel' ? 'default' : 'outline'}
                    onClick={() => setTheme('travel')}
                    className="w-full"
                  >
                    Travel
                  </Button>
                </div>
              </div>
            </div>
            
            {bestScore && (
              <div className="text-center">
                <div className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4 mr-1" />
                  Best Score: {bestScore}
                </div>
              </div>
            )}
            
            <Button 
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-medium"
              size="lg"
              onClick={() => startGame(difficulty, theme)}
            >
              Start Game
            </Button>
          </div>
        ) : (
          // Game Play Screen
          <div>
            {/* Game Stats */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center text-sm font-medium">
                <Clock3 className="h-4 w-4 mr-1" />
                {formatTime(timer)}
              </div>
              <div className="flex items-center text-sm font-medium">
                Moves: {moves}
              </div>
              <div className="flex items-center text-sm font-medium">
                Pairs: {matchedPairs}/{cards.length / 2}
              </div>
            </div>
            
            {/* Game Board */}
            <div className={`grid gap-2 ${
              difficulty === 'easy' ? 'grid-cols-3' : 
              difficulty === 'medium' ? 'grid-cols-4' : 
              'grid-cols-4'
            }`}>
              {cards.map(card => (
                <div
                  key={card.id}
                  className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 transform ${
                    card.isFlipped || card.isMatched 
                      ? 'bg-gradient-to-br from-primary/80 to-primary text-white rotate-0' 
                      : 'bg-gray-100 hover:bg-gray-200 text-transparent rotate-y-180'
                  } ${
                    card.isMatched ? 'opacity-80' : 'opacity-100'
                  } flex items-center justify-center text-2xl sm:text-3xl md:text-4xl`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
                </div>
              ))}
            </div>
            
            {/* Game Controls */}
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGameStarted(false)}
              >
                Exit Game
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={initializeGame}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
            
            {/* Game Completed Modal */}
            {gameCompleted && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4 animate-scale-in">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <Award className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                    <p className="text-gray-600 mb-4">
                      You completed the game in {formatTime(timer)} with {moves} moves!
                    </p>
                    <div className="text-3xl font-bold text-primary mb-4">
                      Score: {calculateScore()}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setGameCompleted(false);
                          setGameStarted(false);
                        }}
                      >
                        Main Menu
                      </Button>
                      <Button 
                        className="bg-primary text-white"
                        onClick={() => {
                          setGameCompleted(false);
                          initializeGame();
                        }}
                      >
                        Play Again
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryGame;