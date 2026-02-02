import { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import './LearningView.css';

const LearningView = ({ category, onBack, onQuiz }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { speak } = useSpeech();

    const currentItem = category.items[currentIndex];
    const totalItems = category.items.length;

    useEffect(() => {
        // Auto-speak Polish when slide changes
        if (currentItem) {
            speak(currentItem.pl, 'pl-PL');
        }
    }, [currentIndex, currentItem, speak]);

    const handleNext = () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (!currentItem) return <div>Loading...</div>;

    return (
        <div className="learning-view">
            <div className="learning-header">
                <h2>{category.nameEs} / {category.namePl}</h2>
            </div>

            <div className="flashcard">
                <div className="flashcard-image">{currentItem.image}</div>
                <div className="flashcard-content">
                    <div className="word-group">
                        <span className="word-es">{currentItem.es}</span>
                        <span className="word-pl">{currentItem.pl}</span>
                    </div>
                    <button
                        className="audio-btn"
                        onClick={() => speak(currentItem.pl, 'pl-PL')}
                        aria-label="Play Audio"
                    >
                        🔊
                    </button>
                </div>
            </div>

            <div className="controls">
                <button
                    className="nav-btn"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    ⬅️ Anterior
                </button>
                <span className="counter">{currentIndex + 1} / {totalItems}</span>
                <button
                    className="nav-btn"
                    onClick={handleNext}
                    disabled={currentIndex === totalItems - 1}
                >
                    Siguiente ➡️
                </button>
            </div>

            <div className="action-area">
                <button className="finish-btn" onClick={onBack}>
                    Wróć / Back
                </button>
                <button className="quiz-btn" onClick={onQuiz}>
                    Jugar Quiz 🎮
                </button>
            </div>
        </div>
    );
};

export default LearningView;
