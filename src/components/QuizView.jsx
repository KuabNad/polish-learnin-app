import { useState, useMemo, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import confetti from 'canvas-confetti';
import './QuizView.css';

const QuizView = ({ category, onBack }) => {
    const { speak } = useSpeech();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'

    // Shuffle items for questions
    const questions = useMemo(() => {
        return [...category.items].sort(() => Math.random() - 0.5);
    }, [category]);

    const currentQuestion = questions[currentQuestionIndex];

    // Generate options (1 correct + 2 random wrong ones)
    const options = useMemo(() => {
        if (!currentQuestion) return [];
        const others = category.items.filter(item => item.id !== currentQuestion.id);
        const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 2);
        return [currentQuestion, ...shuffledOthers].sort(() => Math.random() - 0.5);
    }, [currentQuestion, category.items]);

    useEffect(() => {
        if (currentQuestion) {
            speak(currentQuestion.pl, 'pl-PL');
        }
    }, [currentQuestion, speak]);

    const handleAnswer = (item) => {
        if (feedback) return; // Prevent double clicks

        if (item.id === currentQuestion.id) {
            setFeedback('correct');
            speak('Dobrze!', 'pl-PL'); // "Good!"
            setTimeout(() => {
                setScore(s => s + 1);
                nextQuestion();
            }, 1500);
        } else {
            setFeedback('incorrect');
            speak('Oj, nie.', 'pl-PL'); // "Oh no"
            setTimeout(() => {
                setFeedback(null); // Just clear feedback, let them try again? Or move on? 
                // Let's decide nextQuestion anyway or let retry? 
                // For kids, let's just move on but score doesn't go up.
                nextQuestion();
            }, 1500);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResult(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    if (showResult) {
        return (
            <div className="quiz-result">
                <h2>🎉 Koniec! / Koniec! 🎉</h2>
                <p className="score">
                    Wynik: {score} / {questions.length}
                </p>
                <button className="restart-btn" onClick={onBack}>
                    Volver / Wróć
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-view">
            <h3>¿Dónde está...? / Gdzie jest...?</h3>
            <h2 className="quiz-word" onClick={() => speak(currentQuestion.pl, 'pl-PL')}>
                {currentQuestion.pl} 🔊
            </h2>

            <div className="quiz-options">
                {options.map((item) => (
                    <button
                        key={item.id}
                        className={`quiz-option ${feedback && item.id === currentQuestion.id ? 'correct' : ''} ${feedback === 'incorrect' && item.id !== currentQuestion.id ? 'dim' : ''}`}
                        onClick={() => handleAnswer(item)}
                        disabled={!!feedback}
                    >
                        <div className="option-emoji">{item.image}</div>
                    </button>
                ))}
            </div>

            {feedback === 'correct' && <div className="feedback-anim">Dobrze! ⭐</div>}
            {feedback === 'incorrect' && <div className="feedback-anim">Oj! 😅</div>}

            <div className="quiz-progress">
                Pytanie: {currentQuestionIndex + 1} / {questions.length}
            </div>
        </div>
    );
};

export default QuizView;
