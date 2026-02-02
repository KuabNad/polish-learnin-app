# 🇵🇱 Polish Learning App 🇪🇸

An interactive language learning application for Polish and Spanish vocabulary, featuring games, quizzes, and audio pronunciation.

## ✨ Features

- **13 Categories**: Animals, Colors, Math, Numbers, Food, Family, Body, Clothes, Transport, House, Nature, School, Flags
- **Interactive Games**:
  - Math Game with Easy (1-20) and Hard (1-100) difficulty levels
  - Color Mixing Challenge
  - Quiz mode for all categories
- **Audio Pronunciation**: Text-to-speech for Polish and Spanish
- **Rich Content**: 
  - Universe subcategory with all 8 planets, galaxies, satellites
  - Earth Nature with weather, landscapes, and natural phenomena
  - Flags from 30 countries worldwide
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎮 How to Use

1. Select a category from the home screen
2. Learn vocabulary with flashcards and audio
3. Test your knowledge with quizzes
4. Play interactive games (Math, Color Mixing)

## 🛠️ Tech Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Audio**: Web Speech API
- **Animations**: canvas-confetti

## 📦 Project Structure

```
src/
├── components/        # React components
├── data/             # categories.json vocabulary data
├── hooks/            # Custom hooks (useSpeech)
├── styles/           # Global CSS variables
└── App.jsx           # Main application
```

## 🌍 Deployment

See [deployment_guide.md](deployment_guide.md) for detailed instructions on deploying to Vercel, Netlify, or GitHub Pages.

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ for language learners
