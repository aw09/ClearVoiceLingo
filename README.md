# ClearVoiceLingo

A mobile-first web application for language learning with Text-to-Speech and Flashcard features.

## Features

- **Text-to-Speech Generation**: Generate language pairs and listen to pronunciation in different languages
- **Voice Selection**: Choose from available system voices for both source and target languages
- **Flashcard System**: Review generated language pairs with interactive flashcards
- **Offline Support**: All data is stored locally in your browser using IndexedDB
- **Mobile-First Design**: Responsive interface optimized for mobile devices

## Technologies Used

- React with Vite for fast performance
- Web Speech API for text-to-speech functionality
- IndexedDB for local data storage
- TailwindCSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/aw09/clearvoicelingo.git
   cd clearvoicelingo
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

```
npm run build
# or
yarn build
```

## Deployment to Firebase

1. Install Firebase CLI
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```
   firebase login
   ```

3. Initialize Firebase project
   ```
   firebase init
   ```
   - Select Hosting
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as a single-page app: `yes`

4. Deploy to Firebase
   ```
   firebase deploy
   ```

## Browser Compatibility

This application uses the Web Speech API, which is supported in most modern browsers. For the best experience, use the latest version of Chrome, Firefox, Edge, or Safari.

## License

MIT