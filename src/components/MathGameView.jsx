import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSpeech } from '../hooks/useSpeech';
import './MathGameView.css';

const MathGameView = ({ onBack }) => {
    const { speak } = useSpeech();
    const [difficulty, setDifficulty] = useState(null); // null, 'easy', 'hard'
    const [problem, setProblem] = useState(null);
    const [choices, setChoices] = useState([]);
    const [status, setStatus] = useState('playing'); // playing, success, failure

    useEffect(() => {
        if (difficulty) {
            newGame();
        }
    }, [difficulty]);

    const generateProblem = () => {
        const maxNumber = difficulty === 'easy' ? 20 : 100;

        // Decide operation
        const isAddition = Math.random() > 0.5;

        let a, b, result;

        if (isAddition) {
            // A + B = Result (Max based on difficulty)
            result = Math.floor(Math.random() * maxNumber) + 1;
            a = Math.floor(Math.random() * result);
            b = result - a;
        } else {
            // A - B = Result (Min 0)
            a = Math.floor(Math.random() * maxNumber) + 1;
            b = Math.floor(Math.random() * a); // Ensure b <= a for non-negative
            result = a - b;
        }

        return { a, b, result, op: isAddition ? '+' : '-' };
    };

    const newGame = () => {
        const p = generateProblem();
        setProblem(p);

        // Generate choices
        const correct = p.result;
        let distractor1 = correct + Math.floor(Math.random() * 5) + 1;
        let distractor2 = correct - Math.floor(Math.random() * 5) - 1;

        if (distractor2 < 0) distractor2 = correct + 10;

        const allChoices = [correct, distractor1, distractor2].sort(() => 0.5 - Math.random());
        setChoices(allChoices);
        setStatus('playing');

        // Speak problem? Maybe just "Ile to jest?" (How much is it?)
        speak('Ile to jest?', 'pl-PL');
    };

    const handleAnswer = (choice) => {
        if (status !== 'playing') return;

        if (choice === problem.result) {
            setStatus('success');
            speak(choice.toString(), 'pl-PL'); // Speak the number
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            setStatus('failure');
            speak('Nie. Spróbuj jeszcze raz.', 'pl-PL');
        }
    };

    // Show difficulty selection if not chosen yet
    if (!difficulty) {
        return (
            <div className="math-game">
                <h2>Matematyka 🧮</h2>
                <h3>Wybierz poziom / Elige nivel</h3>

                <div className="difficulty-selection">
                    <button
                        className="difficulty-btn easy"
                        onClick={() => setDifficulty('easy')}
                    >
                        🟢 Łatwy / Fácil
                        <span className="difficulty-range">(1-20)</span>
                    </button>

                    <button
                        className="difficulty-btn hard"
                        onClick={() => setDifficulty('hard')}
                    >
                        🔴 Trudny / Difícil
                        <span className="difficulty-range">(1-100)</span>
                    </button>
                </div>

                <button className="back-btn-math" onClick={onBack}>Wróć / Volver</button>
            </div>
        );
    }

    if (!problem) return null;

    return (
        <div className="math-game">
            <h2>Matematyka 🧮</h2>

            <div className="problem-card">
                <span className="number">{problem.a}</span>
                <span className="operator">{problem.op}</span>
                <span className="number">{problem.b}</span>
                <span className="equals">=</span>
                <span className="question-mark">?</span>
            </div>

            <div className="choices-grid">
                {choices.map((choice, i) => (
                    <button
                        key={i}
                        className="choice-btn"
                        onClick={() => handleAnswer(choice)}
                        disabled={status === 'success'}
                    >
                        {choice}
                    </button>
                ))}
            </div>

            {status === 'success' && (
                <div className="math-feedback success">
                    <h3>Dobrze! {problem.result}</h3>
                    <button className="next-btn" onClick={newGame}>➡️ Dalej</button>
                </div>
            )}

            {status === 'failure' && (
                <div className="math-feedback failure">
                    <h3>Ups... 😅</h3>
                </div>
            )}

            <button className="back-btn-math" onClick={onBack}>Wróć / Volver</button>
        </div>
    );
};

export default MathGameView;
