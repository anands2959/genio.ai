# Genio AI 🚀

Genio AI is a powerful AI-powered content generation platform built with Next.js, offering various creative tools for generating images, videos, blog content, and more.

## ✨ Features

- **Multi-Modal Content Generation**
  - Image Generation 🖼️
  - Video Creation 🎥
  - Blog Content Writing ✍️
  - Voice Generation 🎤

- **User Management**
  - Secure Authentication (NextAuth.js)
  - Multiple Login Options (Google, GitHub, Email)
  - User Profile Management
  - Credit System

- **Modern UI/UX**
  - Responsive Dashboard
  - Real-time Generation Status
  - Interactive Previews
  - Smooth Animations (Framer Motion)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.2, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Services**: Google Gemini, HuggingFace
- **Cloud Storage**: Cloudinary
- **UI Animation**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- MongoDB Database
- API Keys for:
  - Google Gemini
  - HuggingFace
  - Cloudinary

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/genio.ai.git
cd genio.ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Initialize Prisma
```bash
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📦 Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── components/   # React components
│   │   ├── dashboard/    # Dashboard pages
│   │   └── hooks/        # Custom React hooks
│   ├── lib/              # Utility functions
│   └── utils/            # Helper functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🔒 Security

- Secure authentication with NextAuth.js
- Protected API routes
- Input validation
- Rate limiting
- Secure credit transactions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
