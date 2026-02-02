import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
    return (
        <button className="category-card" onClick={() => onClick(category)}>
            <div className="category-emoji">{category.image}</div>
            <div className="category-names">
                <span className="category-name-es">{category.nameEs}</span>
                <span className="category-name-pl">{category.namePl}</span>
            </div>
        </button>
    );
};

export default CategoryCard;
