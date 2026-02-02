import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useSpeech } from '../hooks/useSpeech';
import './ColorMixingView.css';

const PALETTE = [
    { id: 'red', name: 'Rojo', pl: 'Czerwony', color: '#FF4136' },
    { id: 'blue', name: 'Azul', pl: 'Niebieski', color: '#0074D9' },
    { id: 'yellow', name: 'Amarillo', pl: 'Żółty', color: '#FFDC00' },
    { id: 'white', name: 'Blanco', pl: 'Biały', color: '#FFFFFF', border: '#ddd' },
    { id: 'black', name: 'Negro', pl: 'Czarny', color: '#111111' }
];

const TARGETS = [
    { id: 'orange', name: 'Naranja', pl: 'Pomarańczowy', color: '#FF851B', emoji: '🟠', recipe: ['red', 'yellow'] },
    { id: 'green', name: 'Verde', pl: 'Zielony', color: '#2ECC40', emoji: '🟢', recipe: ['blue', 'yellow'] },
    { id: 'purple', name: 'Morado', pl: 'Fioletowy', color: '#B10DC9', emoji: '🟣', recipe: ['red', 'blue'] }
];

const MIX_RESULTS = {
    'red-yellow': { id: 'orange', name: 'Naranja', pl: 'Pomarańczowy', color: '#FF851B', emoji: '🟠' },
    'yellow-red': { id: 'orange', name: 'Naranja', pl: 'Pomarańczowy', color: '#FF851B', emoji: '🟠' },
    'blue-yellow': { id: 'green', name: 'Verde', pl: 'Zielony', color: '#2ECC40', emoji: '🟢' },
    'yellow-blue': { id: 'green', name: 'Verde', pl: 'Zielony', color: '#2ECC40', emoji: '🟢' },
    'red-blue': { id: 'purple', name: 'Morado', pl: 'Fioletowy', color: '#B10DC9', emoji: '🟣' },
    'blue-red': { id: 'purple', name: 'Morado', pl: 'Fioletowy', color: '#B10DC9', emoji: '🟣' }
};

const ColorMixingView = ({ onBack }) => {
    const { speak } = useSpeech();
    const [target, setTarget] = useState(null);
    const [slot1, setSlot1] = useState(null);
    const [slot2, setSlot2] = useState(null);
    const [result, setResult] = useState(null); // The calculated result
    const [status, setStatus] = useState('playing'); // playing, success, failure

    // Initialize random target
    useEffect(() => {
        newGame();
    }, []);

    const newGame = () => {
        const randomTarget = TARGETS[Math.floor(Math.random() * TARGETS.length)];
        setTarget(randomTarget);
        setSlot1(null);
        setSlot2(null);
        setResult(null);
        setStatus('playing');
        speak(`Jakie kolory tworzą ${randomTarget.pl}?`, 'pl-PL');
    };

    const handleColorClick = (color) => {
        if (status !== 'playing') return;

        speak(color.pl, 'pl-PL');

        if (!slot1) {
            setSlot1(color);
        } else if (!slot2) {
            if (slot1.id === color.id) return; // Ignore double tap same color

            setSlot2(color);

            // Calculate Mix
            const key = `${slot1.id}-${color.id}`;
            const mixResult = MIX_RESULTS[key];

            if (mixResult) {
                setResult(mixResult);

                // WIN CHECK
                if (mixResult.id === target.id) {
                    setStatus('success');
                    speak('Brawo! Dobrze!', 'pl-PL');
                    confetti({
                        particleCount: 200,
                        spread: 100,
                        gravity: 1.2
                    });
                } else {
                    setStatus('failure');
                    speak('Oj! To nie ten kolor.', 'pl-PL');
                }
            } else {
                // Invalid mix (e.g. involving Black/White)
                setResult({ name: '???', pl: '???', color: '#666', emoji: '💩' });
                setStatus('failure');
                speak('To nie zadziała.', 'pl-PL');
            }
        }
    };

    const resetRound = () => {
        setSlot1(null);
        setSlot2(null);
        setResult(null);
        setStatus('playing');
    };

    if (!target) return null;

    return (
        <div className="mixing-view">
            <div className="challenge-header">
                <h2>¿Qué colores hacen: <span style={{ color: target.color }}>{target.name}</span>?</h2>
                <h3>Jakie kolory tworzą: <span style={{ color: target.color }}>{target.pl}</span>?</h3>
            </div>

            {/* Equation UI */}
            <div className="equation-container">
                <div
                    className="color-slot"
                    style={{ backgroundColor: slot1?.color || 'transparent', borderColor: slot1 ? slot1.color : '#ccc' }}
                >
                    {!slot1 && <span className="slot-placeholder">?</span>}
                </div>

                <span className="equation-symbol">+</span>

                <div
                    className="color-slot"
                    style={{ backgroundColor: slot2?.color || 'transparent', borderColor: slot2 ? slot2.color : '#ccc' }}
                >
                    {!slot2 && <span className="slot-placeholder">?</span>}
                </div>

                <span className="equation-symbol">=</span>

                <div
                    className="result-slot"
                    style={{
                        backgroundColor: result ? result.color : '#eee',
                        borderColor: result ? result.color : '#eee',
                        boxShadow: result && status === 'success' ? `0 0 20px ${result.color}` : 'none'
                    }}
                >
                    {result ? <span className="result-emoji">{result.emoji}</span> : <span className="slot-placeholder" style={{ color: target.color }}>?</span>}
                </div>
            </div>

            {/* Feedback Area */}
            {status === 'success' && (
                <div className="feedback-area success">
                    <h3>🎉 ¡Muy bien! / Dobrze! 🎉</h3>
                    <button className="next-btn" onClick={newGame}>➡️ Siguiente / Dalej</button>
                </div>
            )}

            {status === 'failure' && (
                <div className="feedback-area failure">
                    <h3>😅 Ups... Intenta de nuevo / Spróbuj jeszcze raz</h3>
                    <button className="retry-btn" onClick={resetRound}>🔄 Retry</button>
                </div>
            )}

            {/* Palette */}
            {status === 'playing' && (
                <div className="palette">
                    {PALETTE.map(c => (
                        <button
                            key={c.id}
                            className="palette-btn"
                            style={{
                                backgroundColor: c.color,
                                borderColor: c.border || 'white',
                                color: c.id === 'white' || c.id === 'yellow' ? '#333' : 'white'
                            }}
                            onClick={() => handleColorClick(c)}
                            disabled={!!slot1 && !!slot2}
                        >
                            {c.name}
                        </button>
                    ))}
                    {(slot1 || slot2) && <button className="reset-small-btn" onClick={resetRound}>❌</button>}
                </div>
            )}

            <button className="back-btn-mix" onClick={onBack}>Wróć / Volver</button>
        </div>
    );
};

export default ColorMixingView;
