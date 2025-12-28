# ✨ What If Machine

*Another version of your life, waiting to be read - plausible futures, softly lit.*

A beautiful, interactive storytelling app that explores alternate versions of your life through AI-generated narratives. Ask "What if?" and discover a day in the life you almost lived.

## 🎯 Features

### 📖 Interactive Storytelling
- **Paginated Book Experience** - Navigate through your alternate life story like turning pages in a journal
- **AI-Generated Narratives** - Powered by Groq's Llama 3.3 70B for creative, emotionally resonant stories
- **Structured Storytelling** - Each story includes Morning, Midday, Afternoon, Evening, and Reflection sections

### 💾 Story Management
- **Save Stories** - Keep up to 10 of your favorite alternate lives
- **Quick Access** - Instantly reload any saved story from the dropdown
- **LocalStorage Integration** - Stories persist in your browser

### 🎨 Beautiful UI/UX
- **Book-Style Design** - Realistic spiral notebook aesthetic with page-flip animations
- **Smooth Scrolling** - Content flows naturally with navigation controls at the bottom
- **Responsive Layout** - Works beautifully on desktop and mobile

### 🚀 Additional Features
- **📥 Download Stories** - Export your stories as formatted text files
- **📤 Share Links** - Copy story URLs to share with friends
- **⚡ Fast Generation** - Stories generated in 3-5 seconds using Groq's blazing-fast inference

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with animations

### Backend
- **Node.js + Express** - API server
- **Groq API** - AI text generation (Llama 3.3 70B)
- **CORS** - Cross-origin resource sharing

### Storage
- **LocalStorage** - Client-side story persistence

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (free at [console.groq.com](https://console.groq.com/keys))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Aditi777613/what-if.git
cd what-if
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies (if separate)
cd server
npm install
cd ..
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=5174
```

Create a `.env` file in the frontend (optional):
```env
VITE_API_URL=http://localhost:5174
```

4. **Start the development servers**

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
node server.js
```

5. **Open your browser**
```
http://localhost:5173
```

## 🚀 Usage

### Creating a Story

1. **Enter your "What if" scenario**
   - Example: "What if I became an astronaut?"
   
2. **Optionally add current life context**
   - Example: "I'm currently a software engineer"

3. **Click "Open this page"**
   - Wait 3-5 seconds for AI generation

4. **Navigate through pages**
   - Use "Next →" and "← Previous" buttons
   - Read through Morning, Midday, Afternoon, Evening, Reflection, and The End

### Managing Stories

- **Save a story**: Click "💾 Save" while reading
- **View saved stories**: Click "Saved (X)" on the home page
- **Load a story**: Click any saved story from the dropdown
- **Share a story**: Click "📤 Share" to copy the link
- **Download a story**: Click "📥 Download Story" on the end page

## 🏗️ Project Structure

```
what-if-machine/
├── src/
│   ├── components/
│   │   ├── WhatIfMachine.tsx    # Main component
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/
│   │   └── api.ts                # API service layer
│   ├── pages/
│   │   └── Index.tsx             # Home page
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── server.js                     # Express backend
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── vite.config.ts                # Vite configuration
└── README.md                     # You are here!
```

## 🎨 Customization

### Styling
The app uses custom CSS classes. Key classes to modify:
- `.whatif-page` - Main container
- `.page-card` - Book page styling
- `.whatif-btn` - Button styles

### Story Structure
Modify the `parseStory` function in `server.js` to change how stories are structured.

### AI Model
Change the model in `server.js`:
```javascript
model: "llama-3.3-70b-versatile", // Current model
// Or try: "mixtral-8x7b-32768"
```

## 🔧 API Endpoints

### `POST /api/generate`
Generate a new story based on a "What if" prompt.

**Request:**
```json
{
  "whatIf": "What if I became an astronaut?",
  "currentLife": "I'm a software engineer"
}
```

**Response:**
```json
{
  "story": {
    "title": "Cosmic Dreams Unfolding",
    "morning": "...",
    "midday": "...",
    "afternoon": "...",
    "evening": "...",
    "reflection": "..."
  },
  "imageUrl": null
}
```

## 🌟 Key Features Explained

### Pagination System
- 6 pages total: Title+Morning, Midday, Afternoon, Evening, Reflection, The End
- Smooth navigation between pages
- Page counter shows current position

### Story Persistence
- Saves last 10 stories automatically
- Stored in browser's localStorage
- Survives page refreshes

### Download Functionality
- Creates formatted .txt file
- Includes all story sections
- Timestamped filename

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License

## 🙏 Acknowledgments

- **Groq** - For providing blazing-fast AI inference
- **Anthropic Claude** - For assistance in development
- **React Team** - For the amazing framework
- **shadcn/ui** - For beautiful UI components

## 📧 Contact

- **Author**: Aditi Chourasia
- **GitHub**: https://github.com/Aditi777613

---

**Built with ❤️ and AI**

*Turn the page — read a day you almost lived.*
