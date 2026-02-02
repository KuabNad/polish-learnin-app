import { useState } from 'react';
import './App.css';
import CategoryCard from './components/CategoryCard';
import LearningView from './components/LearningView';
import QuizView from './components/QuizView';
import ColorMixingView from './components/ColorMixingView';
import ColorsView from './components/ColorsView';
import NumbersView from './components/NumbersView';
import MathGameView from './components/MathGameView';
import categoriesSource from './data/categories.json';

function App() {
  const [view, setView] = useState('home'); // 'home', 'learn', 'quiz'
  const [categoryStack, setCategoryStack] = useState([]); // Stack of parent categories
  const [currentCategory, setCurrentCategory] = useState(null); // Active category for Learn/Quiz

  // Get the current list of categories to display
  // If stack is empty, show root list.
  // If stack has items, show subcategories of the last item.
  const activeList = categoryStack.length === 0
    ? categoriesSource
    : categoryStack[categoryStack.length - 1].subcategories || [];

  const handleCategoryClick = (cat) => {
    // Check for special view FIRST
    if (cat.specialView) {
      if (cat.specialView === 'colors') {
        setCurrentCategory(cat);
        setView('colors');
      } else if (cat.specialView === 'mixing') {
        setView('mixing');
      } else if (cat.specialView === 'numbers') {
        setCurrentCategory(cat);
        setView('numbers');
      } else if (cat.specialView === 'math_game') {
        setView('math_game');
      }
      return;
    }

    if (cat.items) {
      // It's a leaf node with items -> Start Learning
      // Randomly select 10 items if more than 10
      let selectedItems = cat.items;
      if (cat.items.length > 10) {
        const shuffled = [...cat.items].sort(() => 0.5 - Math.random());
        selectedItems = shuffled.slice(0, 10);
      }

      setCurrentCategory({
        ...cat,
        items: selectedItems
      });
      setView('learn');
    } else if (cat.subcategories) {
      // It's a folder -> Dive in
      setCategoryStack([...categoryStack, cat]);
    }
  };

  const handleBack = () => {
    if (view === 'learn' || view === 'quiz' || view === 'colors' || view === 'numbers' || view === 'math_game') {
      setView('home');
      setCurrentCategory(null);
    } else if (view === 'mixing') {
      // If we are in mixing, we likely came from colors
      setView('colors');
    } else {
      // In navigation mode, pop the stack
      const newStack = [...categoryStack];
      newStack.pop();
      setCategoryStack(newStack);
    }
  };

  const currentTitle = categoryStack.length === 0
    ? "¡Vamos a aprender! / Uczmy się!"
    : `${categoryStack[categoryStack.length - 1].nameEs} / ${categoryStack[categoryStack.length - 1].namePl}`;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🇵🇱 Polski dla wszystkich 🇪🇸</h1>
        {(view !== 'home' || categoryStack.length > 0) && (
          <button className="back-button" onClick={handleBack}>
            🏠 Volver / Wróć
          </button>
        )}
      </header>
      <main className="app-content">
        {view === 'home' && (
          <div className="home-view">
            <h2>{currentTitle}</h2>
            <div className="categories-grid">
              {activeList.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onClick={() => handleCategoryClick(cat)}
                />
              ))}
            </div>
            {activeList.length === 0 && <p>No items here yet!</p>}
          </div>
        )}
        {view === 'learn' && currentCategory && (
          <LearningView
            category={currentCategory}
            onBack={handleBack}
            onQuiz={() => setView('quiz')}
          />
        )}
        {view === 'quiz' && currentCategory && (
          <QuizView
            category={currentCategory}
            onBack={handleBack}
          />
        )}
        {view === 'mixing' && (
          <ColorMixingView
            onBack={() => setView('colors')}
          />
        )}
        {view === 'colors' && currentCategory && (
          <ColorsView
            category={currentCategory}
            onBack={() => setView('home')}
            onMix={() => setView('mixing')}
          />
        )}
        {view === 'numbers' && currentCategory && (
          <NumbersView
            category={currentCategory}
            onBack={() => setView('home')}
          />
        )}
        {view === 'math_game' && (
          <MathGameView
            onBack={() => setView('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
