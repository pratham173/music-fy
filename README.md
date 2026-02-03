# StudyFlow

AI-powered educational study assistant that generates personalized learning content from uploaded PDFs. Built with React + Vite and featuring a premium Apple-inspired aesthetic.

## 🌟 Features

### Core Features
- **PDF Upload & Processing**: Drag-and-drop PDF uploads with automatic text extraction
- **Smart Chapter Detection**: Automatically identifies chapters and sections
- **Multi-Provider AI Integration**: Supports Google Gemini, Groq, Together AI, and Hugging Face
- **Three Study Themes**:
  - 🔥 **The Exam Cram**: Speed & formula focus for last-minute studying
  - 🧮 **The Problem Solver**: Numerical & logic focus with solved examples
  - 🔬 **The Deep Diver**: Derivation & concept focus for deep understanding
- **LaTeX Rendering**: Beautiful mathematical equation rendering with KaTeX
- **Offline Support**: IndexedDB caching for PDFs and study content
- **Cloud Sync**: Optional Supabase integration for cross-device sync

### Technical Features
- Apple-inspired glassmorphism design
- Light/Dark theme support
- Framer Motion animations
- Responsive mobile design
- Progressive Web App (PWA) ready

## 🚀 Quick Start

### Installation

```bash
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

### Environment Variables

```env
# Optional: Music streaming (legacy feature)
VITE_JAMENDO_CLIENT_ID=YOUR_CLIENT_ID

# Optional: Supabase for cloud sync
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# AI Providers (at least one required)
VITE_GEMINI_API_KEY=your_gemini_key          # Recommended: 50 req/day free
VITE_GROQ_API_KEY=your_groq_key              # Fast inference
VITE_TOGETHER_API_KEY=your_together_key      # $25 free credits
VITE_HUGGINGFACE_API_KEY=your_hf_key         # 300 req/hour free
```

## 🔑 Getting API Keys

### Google Gemini (Recommended - Primary Provider)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Free tier: 50 requests/day

### Groq (Fast Inference)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up and create an API key
3. Free tier with generous limits

### Together AI (Backup Provider)
1. Visit [Together AI](https://api.together.xyz/)
2. Sign up for $25 free credits
3. Create an API key

### Hugging Face (Fallback)
1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new token
3. Free tier: 300 requests/hour

## 📖 Usage

1. **Upload PDF**: Drop or select a PDF file to analyze
2. **Select Chapter**: Choose which chapter or section to study
3. **Choose Theme**: Select your preferred study mode
4. **Generate**: AI creates personalized study content with LaTeX-rendered equations
5. **Save**: Store sessions locally or sync to cloud

## 🗄️ Supabase Setup (Optional)

If you want cloud sync, create these tables in Supabase:

```sql
-- User profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique
);

-- Study sessions
create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  pdf_name text not null,
  chapter_name text,
  theme text check (theme in ('exam_cram', 'problem_solver', 'deep_diver')),
  content jsonb,
  created_at timestamptz default now()
);

-- User preferences
create table study_preferences (
  user_id uuid primary key references auth.users on delete cascade,
  default_theme text default 'exam_cram',
  auto_save boolean default true
);

-- Enable Row Level Security
alter table study_sessions enable row level security;
alter table study_preferences enable row level security;

-- Policies
create policy "Users can view own sessions" on study_sessions
  for select using (auth.uid() = user_id);

create policy "Users can create own sessions" on study_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can view own preferences" on study_preferences
  for select using (auth.uid() = user_id);

create policy "Users can update own preferences" on study_preferences
  for all using (auth.uid() = user_id);
```

## 🏗️ Project Structure

```
src/
├── components/
│   └── study/              # Study-specific components
│       ├── PDFUploader.jsx
│       ├── ChapterSelector.jsx
│       ├── ThemeSelector.jsx
│       ├── StudyContent.jsx
│       ├── AIProviderStatus.jsx
│       └── LoadingAnimation.jsx
├── services/
│   ├── aiProvider.js       # Multi-provider AI service
│   ├── pdfParser.js        # PDF text extraction
│   ├── chunkingService.js  # Smart text chunking
│   ├── promptTemplates.js  # Theme-specific prompts
│   ├── supabase.js         # Supabase client
│   └── indexedDB.js        # Local storage
├── hooks/
│   ├── useAI.js            # AI generation hook
│   ├── usePDF.js           # PDF handling hook
│   └── useStudySession.js  # Session management
├── pages/
│   ├── Study.jsx           # Dashboard
│   ├── Upload.jsx          # Upload & selection
│   └── Results.jsx         # AI results display
└── styles/
    ├── global.css          # Global styles
    └── study.css           # Study-specific styles
```

## 🎨 Design Philosophy

- **Apple-inspired aesthetic**: Clean, minimal, premium feel
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth animations**: Framer Motion for fluid transitions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Mobile-first**: Responsive design for on-the-go studying

## 🔒 Privacy & Security

- PDFs are stored locally in IndexedDB
- API keys are never sent to the server
- Optional cloud sync with Supabase (end-to-end encrypted)
- No third-party analytics or tracking

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
