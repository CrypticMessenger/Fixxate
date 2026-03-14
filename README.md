# Fixxate 🚀

Fixxate is a minimalist, high-performance RSVP (Rapid Serial Visual Presentation) reader designed to eliminate saccadic eye movements and double your reading speed.

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

- **Multi-Format Support**: Seamlessly read `.epub`, `.pdf`, and `.md` files.
- **ORP Highlighting**: Optimal Recognition Point centering to keep your focus locked.
- **Context Strip**: Optional surrounding text context to maintain reading flow.
- **Smart Pausing**: Automatic timing adjustments at punctuation and long words.
- **Premium Themes**: Choose between **Dark**, **Light**, and **Sepia** to reduce eye strain.
- **Responsive Design**: Fast, fluid, and fully reactive interface.
- **Keyboard First**: Navigate entirely via shortcuts for an uninterrupted experience.

## 🧠 The Science

Traditional reading wastes ~80% of your time on **saccades** (eye jumps between words). Fixxate brings the words to you at a fixed point, allowing your brain to focus 100% on language processing.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play / Pause |
| `↑` / `↓` | Increase / Decrease Speed (WPM) |
| `←` / `→` | Jump ±10 Words |
| `[` / `]` | Jump ±Sentence |
| `T` | Cycle Themes |
| `F` | Toggle Font Size |
| `Esc` | Back to Library |

## 🛠️ Tech Stack

- **Core**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Persistence**: IndexedDB (for book storage) + LocalStorage (for settings)
- **Analytics**: Vercel Analytics

## 🚀 Getting Started

1. **Clone the repo**:
   ```bash
   git clone https://github.com/CrypticMessenger/Fixxate.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```

## 📄 License

MIT License. Feel free to use and contribute!
