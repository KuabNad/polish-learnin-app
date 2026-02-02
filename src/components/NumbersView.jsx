import { useSpeech } from '../hooks/useSpeech';
import './ColorsView.css'; // Reusing ColorsView styles for list layout

const NumbersView = ({ category, onBack, onGame }) => {
    const { speak } = useSpeech();

    const Row = ({ item }) => (
        <div className="color-row" onClick={() => speak(item.pl, 'pl-PL')}>
            <div className="color-icon">{item.image}</div>
            <div className="color-info">
                <span className="color-es">{item.es}</span>
                <span className="color-pl">{item.pl}</span>
            </div>
            <button className="speak-btn">🔊</button>
        </div>
    );

    return (
        <div className="colors-view">
            <div className="colors-section">
                <h3>Liczby 1-100</h3>
                <div className="color-list">
                    {category.items.map(item => <Row key={item.id} item={item} />)}
                </div>
            </div>

            <div className="lab-promo">
                <button className="lab-btn-large" onClick={onGame} style={{ background: 'linear-gradient(135deg, #0074D9 0%, #7FDBFF 100%)' }}>
                    🧮 Szkoła Matematyki / Escuela de Matemáticas
                </button>
            </div>

        </div>
    );
};

export default NumbersView;
