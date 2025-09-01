# AI Image Detector v1.0

A modern, retro-styled web application for detecting whether images are AI-generated or human-captured. Built with Next.js 15, featuring a sleek dark UI and powered by advanced AI models.

![AI Image Detector](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)

## 🚀 Features

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Real-time Analysis**: Instant AI detection using state-of-the-art models
- **Visual Feedback**: Radial meter displaying confidence score (0-100%)
- **Multiple Providers**: Supports OpenRouter, XAI Grok, and fallback heuristics
- **Retro UI**: Nostalgic design with modern performance
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Handling**: Robust error messages and validation
- **Audio Feedback**: Optional sound effects for interactions

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **AI SDK** - Unified interface for AI providers
- **Zod** - Runtime type validation

### AI Providers
- **OpenRouter** - Access to multiple AI models (GPT-4o, Gemini, Claude)
- **XAI Grok** - Advanced multimodal analysis
- **Fallback Heuristic** - Deterministic analysis when APIs unavailable

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aryangaikwadsql/ai-image-detector.git
   cd ai-image-detector
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenRouter (recommended for best results)
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_SITE=https://your-site.com
   OPENROUTER_TITLE=AI Image Detector
   OPENROUTER_MODEL=openai/gpt-4o,google/gemini-1.5-pro

   # XAI (alternative provider)
   XAI_API_KEY=your_xai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Upload an Image**
   - Click "Click to upload" or drag and drop an image
   - Supported formats: JPEG, PNG, WebP, GIF
   - Maximum file size: 5MB

2. **Analyze**
   - Click the "Analyze" button
   - Wait for the AI analysis to complete

3. **View Results**
   - Detection score displayed on radial meter
   - Verdict: AI-Generated, Human-Captured, or Uncertain
   - Detailed reasoning provided

## 🔧 API Reference

### POST /api/detect

Analyzes an uploaded image for AI generation likelihood.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (File) - The image to analyze

**Response:**
```json
{
  "score": 75,
  "label": "AI-Generated",
  "reason": "Texture regularity suggests model synthesis.",
  "provider": "openrouter:openai/gpt-4o"
}
```

**Response Fields:**
- `score` (number): 0-100, higher = more likely AI-generated
- `label` (string): "AI-Generated", "Human-Captured", or "Uncertain"
- `reason` (string): Brief explanation of the analysis
- `provider` (string): AI model/provider used

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | No |
| `OPENROUTER_SITE` | Your site URL for OpenRouter | No |
| `OPENROUTER_TITLE` | App title for OpenRouter | No |
| `OPENROUTER_MODEL` | Comma-separated model preferences | No |
| `XAI_API_KEY` | XAI API key | No |

### Model Selection

The app tries models in this order:
1. OpenRouter models (configurable via `OPENROUTER_MODEL`)
2. XAI Grok-4
3. Fallback heuristic (no API required)

## 🎨 UI Components

The app uses a custom component library built on Radix UI:

- **Detector**: Main upload and analysis component
- **RadialMeter**: Circular progress indicator
- **ThemeProvider**: Dark/light theme support
- **UI Components**: Buttons, cards, dialogs, etc.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI SDK** for unified AI provider interface
- **Radix UI** for accessible components
- **Tailwind CSS** for styling
- **Vercel** for hosting and deployment

## 📞 Support

If you have any questions or issues:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Retro-grade analysis. Modern accuracy.** ✨
