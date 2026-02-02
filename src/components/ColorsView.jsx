import { useSpeech } from '../hooks/useSpeech';
import './ColorsView.css';

const ColorsView = ({ category, onBack, onMix }) => {
    const { speak } = useSpeech();

    // Helper to find subcategory items
    const primary = category.subcategories.find(sub => sub.id === 'primary')?.items || [];
    const secondary = category.subcategories.find(sub => sub.id === 'secondary')?.items || [];

    const ColorRow = ({ item }) => (
        <div className="color-row" onClick={() => speak(item.pl, 'pl-PL')}>
            <div className="color-icon">{item.image}</div>
            <div className="color-info">
                <span className="color-es">{item.es}</span>
                <span className="color-pl">{item.pl}</span>
            </div>
            <button className="speak-btn" aria-label="Play Audio">🔊</button>
        </div>
    );

    return (
        <div className="colors-view">

            <div className="colors-section">
                <h3>Primarios / Podstawowe</h3>
                <div className="color-list">
                    {primary.map(item => <ColorRow key={item.id} item={item} />)}
                </div>
            </div>

            <div className="colors-section">
                <h3>Secundarios / Pochodne</h3>
                <div className="color-list">
                    {secondary.map(item => <ColorRow key={item.id} item={item} />)}
                </div>
            </div>

            <div className="lab-promo">
                <button className="lab-btn-large" onClick={onMix}>
                    🧪 Laboratorio de Mezclas / Laboratorium
                </button>
            </div>

        </div>
    );
};

export default ColorsView;
