# StudyFlow - Getting Started Guide

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/pratham173/music-fy.git
cd music-fy

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure AI Providers

You need at least one AI provider API key. Add your keys to `.env`:

```env
# Recommended: Google Gemini (Primary)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Additional providers for fallback
VITE_GROQ_API_KEY=your_groq_key
VITE_TOGETHER_API_KEY=your_together_key
VITE_HUGGINGFACE_API_KEY=your_hf_key
```

#### Getting API Keys:

**Google Gemini** (Recommended - Best Free Tier)
- Visit: https://makersuite.google.com/app/apikey
- Sign in with Google account
- Click "Get API Key" → "Create API Key"
- Free tier: 50 requests/day
- Best for: General use, multimodal support

**Groq** (Fast Inference)
- Visit: https://console.groq.com/
- Sign up and navigate to API Keys
- Create a new API key
- Free tier: Generous limits
- Best for: Speed-critical operations

**Together AI** (Good Backup)
- Visit: https://api.together.xyz/
- Sign up for $25 free credits
- Generate API key in settings
- Best for: Heavy usage after free tiers exhausted

**Hugging Face** (Fallback)
- Visit: https://huggingface.co/settings/tokens
- Create new token with "Read" permission
- Free tier: 300 requests/hour
- Best for: Last resort fallback

### 3. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

Visit `http://localhost:5173` in your browser.

## 📚 How to Use StudyFlow

### Step 1: Upload a PDF

1. Click "New Study Session" or "Upload Your First PDF"
2. Drag and drop a PDF file, or click to browse
3. Wait for the PDF to be processed (text extraction + chapter detection)

### Step 2: Select Chapter

1. Choose which chapter or section you want to study
2. The app automatically detects chapters/sections
3. If no chapters detected, it creates page ranges

### Step 3: Choose Study Theme

Select from three study modes:

**⚡ The Exam Cram** (Speed & Formula Focus)
- Quick review for exams
- High-yield topics & formulas
- Memory hooks and mnemonics
- Best for: Last-minute studying

**🧮 The Problem Solver** (Numerical Focus)
- Step-by-step solved examples
- Practice problems with solutions
- Common mistakes & edge cases
- Best for: Homework and practice

**🔬 The Deep Diver** (Concept Focus)
- Complete derivations
- Conceptual explanations
- Real-world applications
- Best for: Deep understanding

### Step 4: Generate & Study

1. Click "Generate Study Content ✨"
2. AI processes your content (10-30 seconds)
3. View beautifully formatted study material with LaTeX equations
4. Save the session for offline access

## 🎯 Features

### Offline Support
- All PDFs cached in browser (IndexedDB)
- Study content available offline
- No internet needed after generation

### LaTeX Rendering
- Mathematical equations rendered beautifully
- Supports inline: `$E = mc^2$`
- Block equations: `$$\int_a^b f(x)dx$$`

### Multi-Provider AI
- Automatic failover between providers
- Rate limit handling
- Never get stuck with one provider

### Dark Mode
- Automatic based on system preference
- Optimized for studying at night
- Easy on the eyes

## 🔧 Optional: Supabase Setup

For cloud sync across devices:

1. Create a Supabase project at https://supabase.com
2. Run the SQL from `supabase-schema.sql` in SQL Editor
3. Add credentials to `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Enable authentication (optional)

## 🐛 Troubleshooting

### PDF Upload Issues
- **Problem**: "Failed to parse PDF"
- **Solution**: Ensure PDF is not encrypted or password-protected
- Try a different PDF to test

### AI Generation Fails
- **Problem**: "Failed to generate content"
- **Solution**: 
  - Check API key is correct in `.env`
  - Verify you haven't hit rate limits
  - Try a different AI provider
  - Check internet connection

### Styles Not Loading
- **Problem**: App looks unstyled
- **Solution**: 
  - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  - Clear browser cache
  - Rebuild: `npm run build`

### LaTeX Not Rendering
- **Problem**: Equations show as raw text
- **Solution**: 
  - Ensure KaTeX CSS loaded (check browser console)
  - Try different browser
  - Disable ad blockers (may block CDN)

## 💡 Tips & Best Practices

1. **Chunk Size**: For best results, select individual chapters rather than entire books
2. **Theme Selection**: 
   - Exam tomorrow? → Exam Cram
   - Homework problems? → Problem Solver
   - Final project/research? → Deep Diver
3. **Save Sessions**: Always save important generated content
4. **Multiple Providers**: Configure 2-3 providers for reliability
5. **Mobile**: App is fully responsive, study on your phone!

## 🔒 Privacy

- PDFs stored locally in your browser
- API keys never sent to any server except AI providers
- No tracking or analytics
- Your data stays on your device

## 📱 Mobile Usage

- Fully responsive design
- Touch-friendly interface
- Works offline after first load
- PWA support (add to home screen)

## 🆘 Need Help?

1. Check the [README.md](README.md) for technical details
2. Review this guide for usage instructions
3. Open an issue on GitHub
4. Check browser console for error messages

## 🎓 Example Workflow

```
1. Upload "Physics_Chapter_5.pdf"
   ↓
2. Select "Chapter 5: Thermodynamics"
   ↓
3. Choose "Problem Solver" theme
   ↓
4. Generate content
   ↓
5. Study step-by-step examples
   ↓
6. Save session for review
   ↓
7. Return later for offline access
```

Happy Studying! 🚀
