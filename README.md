# 🚀 AI-Based Resume Builder

A modern, AI-powered resume builder built with Next.js that helps professionals create stunning, ATS-friendly resumes in minutes.

![Resume Builder Preview](https://img.shields.io/badge/Next.js-14.2.30-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎨 **Beautiful Templates**
- **8 Professional Templates** - From classic to modern designs
- **ATS-Friendly** - Optimized for Applicant Tracking Systems
- **Responsive Design** - Works perfectly on all devices
- **Premium Templates** - Special designs for executives and creative professionals

### 🤖 **AI-Powered Features**
- **Smart Suggestions** - AI-powered content recommendations
- **Real-time Optimization** - Instant feedback on resume quality
- **Content Enhancement** - Improve your descriptions with AI assistance
- **Keyword Optimization** - Match job descriptions automatically

> 🚧 **Coming Soon**: Advanced AI features including automated content generation and intelligent resume scoring

### 🛠️ **Advanced Builder**
- **Live Preview** - See changes in real-time
- **Section Management** - Add, remove, and reorder sections
- **Export Options** - PDF, Word, and plain text formats
- **Template Switching** - Change templates on the fly

### 📊 **Professional Dashboard**
- **Resume Management** - Create, edit, and organize multiple resumes
- **Progress Tracking** - Monitor your resume completion
- **Version History** - Keep track of all your changes
- **Analytics** - View download and usage statistics

> 🚧 **Coming Soon**: Advanced analytics, collaboration features, and team management

## 🎯 **Templates Available**

| Template | Category | Features | Premium |
|----------|----------|----------|---------|
| Professional Classic | Professional | ATS-Friendly, Clean Layout | ❌ |
| Modern Minimalist | Modern | Tech-Focused, Minimalist | ❌ |
| Creative Portfolio | Creative | Visual Appeal, Color Accents | ✅ |
| Executive Elite | Executive | Leadership Focus, Premium Design | ✅ |
| Academic Scholar | Academic | Research Emphasis, Detailed Sections | ❌ |
| Startup Innovator | Startup | Innovation Focus, Growth Metrics | ✅ |
| Minimal Clean | Minimal | Ultra Clean, Content Focus | ❌ |
| Tech Professional | Technology | Skills Showcase, Project Focus | ✅ |

## 🚧 **Upcoming Features**

We're actively developing new features to make your resume building experience even better:

### 🤖 **Enhanced AI Capabilities**
- **Automated Content Generation** - AI will suggest complete sections based on your experience
- **Intelligent Resume Scoring** - Get detailed feedback on your resume's effectiveness
- **Job Description Matching** - Automatically optimize your resume for specific job postings
- **Smart Keyword Suggestions** - AI-powered keyword recommendations for better ATS performance

### 👥 **Collaboration & Sharing**
- **Team Workspaces** - Collaborate with colleagues on resume projects
- **Resume Sharing** - Share resumes with recruiters and mentors
- **Feedback System** - Get feedback from industry professionals
- **Version Control** - Advanced version history with branching

### 📊 **Advanced Analytics**
- **Resume Performance Tracking** - Monitor how your resume performs in applications
- **Interview Success Metrics** - Track interview invitations and success rates
- **Industry Insights** - Get data-driven insights about resume trends
- **Personalized Recommendations** - AI-powered suggestions based on your career goals

### 🎨 **Premium Features**
- **Custom Template Designer** - Create your own unique templates
- **Advanced Export Options** - Multiple formats including LaTeX and HTML
- **Resume A/B Testing** - Test different versions of your resume
- **Priority Support** - Dedicated support for premium users

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rishant12220055/AI-Resume-Builder.git
   cd ai-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
ai-resume-builder/
├── public/                 # Static assets
│   ├── placeholder.svg     # Template preview images
│   └── ...
├── src/
│   ├── pages/             # Next.js pages
│   │   ├── index.js       # Landing page
│   │   ├── dashboard.js   # Main dashboard
│   │   ├── templates.js   # Template selection
│   │   ├── resume/        # Resume builder pages
│   │   └── auth/          # Authentication pages
│   ├── styles/
│   │   └── globals.css    # Global styles and animations
│   └── components/        # Reusable components
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── README.md             # This file
```

## 🛠️ **Tech Stack**

- **Framework**: Next.js 14.2.30 (Pages Router)
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **AI Integration**: @xenova/transformers
- **Database**: PostgreSQL (optional)
- **Deployment**: Vercel-ready

## 🎨 **Key Features**

### **Smart Resume Builder**
- Real-time preview with floating animation
- Section toggles for easy customization
- AI-powered content suggestions
- Template switching with instant visual updates

### **Professional Templates**
- 8 carefully designed templates
- ATS-optimized layouts
- Color scheme customization
- Premium and free options

### **User Experience**
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation
- Loading states and error handling

### **Export & Sharing**
- PDF export with high quality
- Multiple format support
- Direct sharing options
- Version control

## 🔧 **Configuration**

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database (optional)
DATABASE_URL=your_postgresql_connection_string

# AI Configuration
AI_MODEL_PATH=your_model_path

# Authentication (optional)
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Customization
- **Colors**: Modify `tailwind.config.js` for brand colors
- **Templates**: Add new templates in `src/pages/templates.js`
- **Animations**: Customize animations in `src/styles/globals.css`

## 📱 **Responsive Design**

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices
- 💻 Desktop computers
- 🖥️ Tablets
- 📺 Large screens

## 🚀 **Deployment**

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with static export
- **Railway**: Full-stack deployment
- **Heroku**: Node.js deployment

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Next.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons
- **Vercel** - For the deployment platform

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/Rishant12220055/AI-Resume-Builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Rishant12220055/AI-Resume-Builder/discussions)
- **Email**: rishantvik@gmail.com

## 🌟 **Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=Rishant12220055/AI-Resume-Builder&type=Date)](https://star-history.com/#Rishant12220055/AI-Resume-Builder&Date)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Rishant12220055">Rishant Vikramaditya</a></p>
  <p>If this project helps you, please give it a ⭐️</p>
</div> 