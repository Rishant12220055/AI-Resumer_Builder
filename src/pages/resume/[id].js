import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Rocket, ArrowLeft, Download, Moon, Sun, Plus, Sparkles, Eye, FileText, Briefcase, GraduationCap, Code, FolderOpen, Award, User, Mail, Phone, MapPin, Linkedin, Github, Globe, Trash2, Settings, Loader2
} from 'lucide-react';

const sectionIcons = {
  personal: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code,
  projects: FolderOpen,
  certifications: Award,
};

export default function ResumeBuilder() {
  const router = useRouter();
  const { id } = router.query;
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiLoading, setAiLoading] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  
  // Template styles configuration
  const templateStyles = {
    professional: {
      name: "Professional Classic",
      colors: {
        primary: "#1e40af",
        secondary: "#64748b", 
        accent: "#3b82f6",
        text: "#1f2937",
        background: "#ffffff",
        border: "#e5e7eb"
      },
      typography: "font-serif",
      spacing: "space-y-4"
    },
    modern: {
      name: "Modern Minimalist",
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#a855f7",
        text: "#1f2937",
        background: "#ffffff",
        border: "#f3f4f6"
      },
      typography: "font-sans",
      spacing: "space-y-6"
    },
    creative: {
      name: "Creative Portfolio",
      colors: {
        primary: "#ec4899",
        secondary: "#f97316",
        accent: "#eab308",
        text: "#1f2937",
        background: "#ffffff",
        border: "#fce7f3"
      },
      typography: "font-sans",
      spacing: "space-y-5"
    },
    executive: {
      name: "Executive Elite",
      colors: {
        primary: "#1f2937",
        secondary: "#374151",
        accent: "#6b7280",
        text: "#111827",
        background: "#ffffff",
        border: "#d1d5db"
      },
      typography: "font-serif",
      spacing: "space-y-4"
    },
    academic: {
      name: "Academic Scholar",
      colors: {
        primary: "#059669",
        secondary: "#065f46",
        accent: "#10b981",
        text: "#1f2937",
        background: "#ffffff",
        border: "#d1fae5"
      },
      typography: "font-serif",
      spacing: "space-y-4"
    },
    startup: {
      name: "Startup Innovator",
      colors: {
        primary: "#dc2626",
        secondary: "#ea580c",
        accent: "#f59e0b",
        text: "#1f2937",
        background: "#ffffff",
        border: "#fed7aa"
      },
      typography: "font-sans",
      spacing: "space-y-5"
    },
    minimal: {
      name: "Minimal Clean",
      colors: {
        primary: "#374151",
        secondary: "#6b7280",
        accent: "#9ca3af",
        text: "#1f2937",
        background: "#ffffff",
        border: "#f3f4f6"
      },
      typography: "font-sans",
      spacing: "space-y-3"
    },
    tech: {
      name: "Tech Professional",
      colors: {
        primary: "#0891b2",
        secondary: "#0e7490",
        accent: "#06b6d4",
        text: "#1f2937",
        background: "#ffffff",
        border: "#cffafe"
      },
      typography: "font-mono",
      spacing: "space-y-4"
    }
  };
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [sections, setSections] = useState([
    { id: 'personal', title: 'Personal Information', visible: true, order: 0, icon: User },
    { id: 'experience', title: 'Work Experience', visible: true, order: 1, icon: Briefcase },
    { id: 'education', title: 'Education', visible: true, order: 2, icon: GraduationCap },
    { id: 'skills', title: 'Skills', visible: true, order: 3, icon: Code },
    { id: 'projects', title: 'Projects', visible: true, order: 4, icon: FolderOpen },
    { id: 'certifications', title: 'Certifications', visible: false, order: 5, icon: Award },
  ]);

  useEffect(() => {
    if (!id) return;
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const currentResume = savedResumes.find(r => r.id === parseInt(id));
    if (!currentResume) {
      router.push('/dashboard');
      return;
    }
    setResume(currentResume);
    setSelectedTemplate(currentResume.template || 'professional');
    setLoading(false);
    setTimeout(() => setIsVisible(true), 100);
  }, [id, router]);

  const saveResume = (updatedResume) => {
    const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const updatedResumes = savedResumes.map(r =>
      r.id === updatedResume.id ? { ...updatedResume, updatedAt: new Date().toISOString() } : r
    );
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    setResume(updatedResume);
  };

  const handlePersonalInfoChange = (field, value) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      personalInfo: { ...resume.personalInfo, [field]: value },
    };
    saveResume(updatedResume);
  };

  const handleExperienceChange = (expId, field, value) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.map(exp => exp.id === expId ? { ...exp, [field]: value } : exp),
    };
    saveResume(updatedResume);
  };

  const handleBulletChange = (expId, index, value) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.map(exp =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.map((b, i) => (i === index ? value : b)) }
          : exp
      ),
    };
    saveResume(updatedResume);
  };

  const addExperience = () => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      experiences: [...resume.experiences, { id: Date.now(), company: '', position: '', duration: '', bullets: [''] }],
    };
    saveResume(updatedResume);
  };

  const removeExperience = (expId) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.filter(exp => exp.id !== expId),
    };
    saveResume(updatedResume);
  };

  const addBullet = (expId) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.map(exp =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      ),
    };
    saveResume(updatedResume);
  };

  const removeBullet = (expId, index) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      experiences: resume.experiences.map(exp =>
        exp.id === expId ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== index) } : exp
      ),
    };
    saveResume(updatedResume);
  };

  const handleAISuggest = async (expId, bulletIndex) => {
    if (!resume) return;
    const experience = resume.experiences.find(exp => exp.id === expId);
    if (!experience || !experience.company || !experience.position) {
      alert('Please fill in both company and position before requesting AI suggestions.');
      return;
    }
    setAiLoading({ ...aiLoading, [`${expId}-${bulletIndex}`]: true });
    setTimeout(() => {
      const suggestions = [
        `Led cross-functional team of 8 engineers to deliver ${experience.position} solutions, resulting in 25% improvement in system performance`,
        `Developed and implemented ${experience.position} strategies at ${experience.company}, increasing efficiency by 30%`,
        `Collaborated with stakeholders to design and execute ${experience.position} initiatives, reducing costs by 20%`,
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      handleBulletChange(expId, bulletIndex, randomSuggestion);
      setAiLoading({ ...aiLoading, [`${expId}-${bulletIndex}`]: false });
    }, 2000);
  };

  const addEducation = () => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      educations: [...resume.educations, { id: Date.now(), institution: '', degree: '', duration: '', achievements: [''] }],
    };
    saveResume(updatedResume);
  };

  const handleEducationChange = (eduId, field, value) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      educations: resume.educations.map(edu => edu.id === eduId ? { ...edu, [field]: value } : edu),
    };
    saveResume(updatedResume);
  };

  const handleAchievementChange = (eduId, index, value) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      educations: resume.educations.map(edu =>
        edu.id === eduId
          ? { ...edu, achievements: edu.achievements.map((a, i) => (i === index ? value : a)) }
          : edu
      ),
    };
    saveResume(updatedResume);
  };

  const addAchievement = (eduId) => {
    if (!resume) return;
    const updatedResume = {
      ...resume,
      educations: resume.educations.map(edu =>
        edu.id === eduId ? { ...edu, achievements: [...edu.achievements, ''] } : edu
      ),
    };
    saveResume(updatedResume);
  };

  const handleSkillsChange = (skills) => {
    if (!resume) return;
    const updatedResume = { ...resume, skills };
    saveResume(updatedResume);
  };

  const handleProjectsChange = (projects) => {
    if (!resume) return;
    const updatedResume = { ...resume, projects };
    saveResume(updatedResume);
  };

  const handleCertificationsChange = (certifications) => {
    if (!resume) return;
    const updatedResume = { ...resume, certifications };
    saveResume(updatedResume);
  };

  const toggleSection = (sectionId) => {
    setSections(
      sections.map(section => section.id === sectionId ? { ...section, visible: !section.visible } : section)
    );
  };

  const exportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900`}>
      <Head>
        <title>{resume.title} - AI Resume Builder</title>
      </Head>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ResumeAI
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Template Selector */}
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  const updatedResume = { ...resume, template: e.target.value };
                  saveResume(updatedResume);
                }}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white text-sm"
              >
                <option value="professional">Professional Classic</option>
                <option value="modern">Modern Minimalist</option>
                <option value="creative">Creative Portfolio</option>
                <option value="executive">Executive Elite</option>
                <option value="academic">Academic Scholar</option>
                <option value="startup">Startup Innovator</option>
                <option value="minimal">Minimal Clean</option>
                <option value="tech">Tech Professional</option>
              </select>

              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Export Options */}
              <div className="relative group">
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-green-500/25">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 dark:border-slate-700">
                  <button onClick={exportPDF} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <FileText className="w-4 h-4 mr-2 inline" />
                    Export as PDF
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <FileText className="w-4 h-4 mr-2 inline" />
                    Export as DOCX
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <FileText className="w-4 h-4 mr-2 inline" />
                    Export as TXT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Editor Section */}
          <div className="w-full xl:w-1/2 space-y-6">
            {/* Resume Title */}
            <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resume Builder</h2>
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 capitalize px-3 py-1 rounded-full text-sm font-medium">
                  {selectedTemplate} Template
                </span>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Resume Title
                </label>
                <input
                  value={resume.title}
                  onChange={(e) => {
                    const updatedResume = { ...resume, title: e.target.value }
                    saveResume(updatedResume)
                  }}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="My Professional Resume"
                />
              </div>
            </div>

            {/* Section Toggles */}
            <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resume Sections</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{section.title}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={section.visible}
                        onChange={() => toggleSection(section.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            {sections.find((s) => s.id === "personal")?.visible && (
              <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={resume.personalInfo.name}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="John Doe" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={resume.personalInfo.title}
                          onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="Software Engineer" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          value={resume.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="john.doe@example.com" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" 
                          value={resume.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="+1 (123) 456-7890" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={resume.personalInfo.location}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                        placeholder="San Francisco, CA" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">LinkedIn</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="url" 
                          value={resume.personalInfo.linkedin}
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="linkedin.com/in/johndoe" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">GitHub</label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="url" 
                          value={resume.personalInfo.github}
                          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="github.com/johndoe" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="url" 
                          value={resume.personalInfo.website}
                          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" 
                          placeholder="johndoe.com" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Work Experience */}
            {sections.find((s) => s.id === "experience")?.visible && (
              <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Work Experience</h3>
                  </div>
                  <button
                    onClick={addExperience}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resume.experiences.map((exp, expIndex) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-700/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">Experience #{expIndex + 1}</h4>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</label>
                          <input
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Position</label>
                          <input
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                            placeholder="Job Title"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duration</label>
                        <input
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(exp.id, "duration", e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white mt-2"
                          placeholder="Jan 2020 - Present"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Responsibilities & Achievements
                        </label>
                        {exp.bullets.map((bullet, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <textarea
                              value={bullet}
                              onChange={(e) => handleBulletChange(exp.id, index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white min-h-[80px] resize-none"
                              placeholder="Describe your responsibilities and achievements..."
                            />
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleAISuggest(exp.id, index)}
                                disabled={aiLoading[`${exp.id}-${index}`]}
                                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                              >
                                {aiLoading[`${exp.id}-${index}`] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Sparkles className="w-4 h-4" />
                                )}
                              </button>
                              {exp.bullets.length > 1 && (
                                <button
                                  onClick={() => removeBullet(exp.id, index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addBullet(exp.id)}
                          className="flex items-center px-3 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Bullet Point
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {sections.find((s) => s.id === "education")?.visible && (
              <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Education</h3>
                  </div>
                  <button
                    onClick={addEducation}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resume.educations.map((edu, eduIndex) => (
                    <div
                      key={edu.id}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-700/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">Education #{eduIndex + 1}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Institution</label>
                          <input
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(edu.id, "institution", e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                            placeholder="University Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Degree</label>
                          <input
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                            placeholder="Bachelor of Science"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duration</label>
                        <input
                          value={edu.duration}
                          onChange={(e) => handleEducationChange(edu.id, "duration", e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white mt-2"
                          placeholder="2018 - 2022"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Achievements & Courses
                        </label>
                        {edu.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <input
                              value={achievement}
                              onChange={(e) => handleAchievementChange(edu.id, index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                              placeholder="Describe achievements, courses, or GPA..."
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addAchievement(edu.id)}
                          className="flex items-center px-3 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Achievement
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {sections.find((s) => s.id === "skills")?.visible && (
              <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Code className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Skills</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    value={resume.skills.join(", ")}
                    onChange={(e) =>
                      handleSkillsChange(
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s),
                      )
                    }
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white min-h-[100px] resize-none"
                    placeholder="JavaScript, React, Node.js, Python, AWS, Docker..."
                  />
                </div>
              </div>
            )}

            {/* Projects */}
            {sections.find((s) => s.id === "projects")?.visible && (
              <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Projects</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Projects (separate each project with double line breaks)
                  </label>
                  <textarea
                    value={resume.projects.join("\n\n")}
                    onChange={(e) => handleProjectsChange(e.target.value.split("\n\n").filter((p) => p))}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white min-h-[150px] resize-none"
                    placeholder="Project Name - Description of the project, technologies used, and your role.

Another Project - Another description..."
                  />
                </div>
              </div>
            )}

            {/* Certifications */}
            {sections.find((s) => s.id === "certifications")?.visible && (
              <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Certifications</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Certifications (one per line)
                  </label>
                  <textarea
                    value={resume.certifications.join("\n")}
                    onChange={(e) => handleCertificationsChange(e.target.value.split("\n").filter((c) => c))}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white min-h-[100px] resize-none"
                    placeholder="AWS Certified Solutions Architect - 2023
Google Cloud Professional Developer - 2022"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="w-full xl:w-1/2">
            <div className="sticky top-24">
              <div 
                className="border-0 shadow-2xl print:shadow-none print:border rounded-xl animate-float"
                style={{
                  backgroundColor: templateStyles[selectedTemplate]?.colors.background || '#ffffff',
                  borderColor: templateStyles[selectedTemplate]?.colors.border || '#e5e7eb'
                }}
              >
                <div className="p-6 text-center print:pb-4">
                  <div className="flex items-center justify-center space-x-2 mb-4 print:hidden">
                    <Eye className="w-5 h-5" style={{ color: templateStyles[selectedTemplate]?.colors.primary || '#3b82f6' }} />
                    <h2 className="text-xl font-bold" style={{ color: templateStyles[selectedTemplate]?.colors.text || '#1f2937' }}>
                      Live Preview - {templateStyles[selectedTemplate]?.name || 'Professional'}
                    </h2>
                  </div>
                </div>
                <div className={`p-8 print:p-6 ${templateStyles[selectedTemplate]?.spacing || 'space-y-4'}`}>
                  {/* Personal Info Preview */}
                  <div className="text-center mb-8">
                    <h1 
                      className={`text-3xl font-bold mb-2 ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                      style={{ color: templateStyles[selectedTemplate]?.colors.text || '#1f2937' }}
                    >
                      {resume.personalInfo.name || "Your Name"}
                    </h1>
                    <p 
                      className="text-xl mb-4 font-medium"
                      style={{ color: templateStyles[selectedTemplate]?.colors.primary || '#3b82f6' }}
                    >
                      {resume.personalInfo.title || "Job Title"}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}>
                      {resume.personalInfo.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{resume.personalInfo.email}</span>
                        </div>
                      )}
                      {resume.personalInfo.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{resume.personalInfo.phone}</span>
                        </div>
                      )}
                      {resume.personalInfo.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{resume.personalInfo.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center gap-4 mt-3">
                      {resume.personalInfo.linkedin && (
                        <a
                          href={resume.personalInfo.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-sm"
                          style={{ color: templateStyles[selectedTemplate]?.colors.accent || '#3b82f6' }}
                        >
                          LinkedIn
                        </a>
                      )}
                      {resume.personalInfo.github && (
                        <a
                          href={resume.personalInfo.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-sm"
                          style={{ color: templateStyles[selectedTemplate]?.colors.accent || '#3b82f6' }}
                        >
                          GitHub
                        </a>
                      )}
                      {resume.personalInfo.website && (
                        <a
                          href={resume.personalInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-sm"
                          style={{ color: templateStyles[selectedTemplate]?.colors.accent || '#3b82f6' }}
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Experience Preview */}
                  {sections.find((s) => s.id === "experience")?.visible && resume.experiences.length > 0 && (
                    <div className="mb-8">
                      <h3 
                        className={`text-xl font-bold mb-4 pb-2 border-b ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                        style={{ 
                          color: templateStyles[selectedTemplate]?.colors.text || '#1f2937',
                          borderColor: templateStyles[selectedTemplate]?.colors.border || '#e5e7eb'
                        }}
                      >
                        Work Experience
                      </h3>
                      {resume.experiences.map((exp) => (
                        <div key={exp.id} className="mb-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 
                              className={`font-bold ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                              style={{ color: templateStyles[selectedTemplate]?.colors.text || '#1f2937' }}
                            >
                              {exp.company || "Company Name"}
                            </h4>
                            <span 
                              className="text-sm"
                              style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}
                            >
                              {exp.duration || "Duration"}
                            </span>
                          </div>
                          <p 
                            className="mb-3 font-medium"
                            style={{ color: templateStyles[selectedTemplate]?.colors.primary || '#3b82f6' }}
                          >
                            {exp.position || "Position"}
                          </p>
                          <ul 
                            className="list-disc pl-5 space-y-1"
                            style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}
                          >
                            {exp.bullets.map((bullet, index) => (
                              <li key={index} className="text-sm leading-relaxed">
                                {bullet || "Responsibility or achievement"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education Preview */}
                  {sections.find((s) => s.id === "education")?.visible && resume.educations.length > 0 && (
                    <div className="mb-8">
                      <h3 
                        className={`text-xl font-bold mb-4 pb-2 border-b ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                        style={{ 
                          color: templateStyles[selectedTemplate]?.colors.text || '#1f2937',
                          borderColor: templateStyles[selectedTemplate]?.colors.border || '#e5e7eb'
                        }}
                      >
                        Education
                      </h3>
                      {resume.educations.map((edu) => (
                        <div key={edu.id} className="mb-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 
                              className={`font-bold ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                              style={{ color: templateStyles[selectedTemplate]?.colors.text || '#1f2937' }}
                            >
                              {edu.institution || "Institution Name"}
                            </h4>
                            <span 
                              className="text-sm"
                              style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}
                            >
                              {edu.duration || "Duration"}
                            </span>
                          </div>
                          <p 
                            className="mb-3 font-medium"
                            style={{ color: templateStyles[selectedTemplate]?.colors.primary || '#3b82f6' }}
                          >
                            {edu.degree || "Degree"}
                          </p>
                          {edu.achievements.some((a) => a) && (
                            <ul 
                              className="list-disc pl-5 space-y-1"
                              style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}
                            >
                              {edu.achievements.map((achievement, index) => (
                                <li key={index} className="text-sm leading-relaxed">
                                  {achievement || "Achievement or course"}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills Preview */}
                  {sections.find((s) => s.id === "skills")?.visible && resume.skills.length > 0 && (
                    <div className="mb-8">
                      <h3 
                        className={`text-xl font-bold mb-4 pb-2 border-b ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                        style={{ 
                          color: templateStyles[selectedTemplate]?.colors.text || '#1f2937',
                          borderColor: templateStyles[selectedTemplate]?.colors.border || '#e5e7eb'
                        }}
                      >
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${templateStyles[selectedTemplate]?.colors.primary || '#3b82f6'}20`,
                              color: templateStyles[selectedTemplate]?.colors.primary || '#3b82f6'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Preview */}
                  {sections.find((s) => s.id === "projects")?.visible && resume.projects.length > 0 && (
                    <div className="mb-8">
                      <h3 
                        className={`text-xl font-bold mb-4 pb-2 border-b ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                        style={{ 
                          color: templateStyles[selectedTemplate]?.colors.text || '#1f2937',
                          borderColor: templateStyles[selectedTemplate]?.colors.border || '#e5e7eb'
                        }}
                      >
                        Projects
                      </h3>
                      {resume.projects.map((project, index) => (
                        <div key={index} className="mb-3">
                          <p 
                            className="text-sm leading-relaxed"
                            style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}
                          >
                            {project}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certifications Preview */}
                  {sections.find((s) => s.id === "certifications")?.visible && resume.certifications.length > 0 && (
                    <div className="mb-8">
                      <h3 
                        className={`text-xl font-bold mb-4 pb-2 border-b ${templateStyles[selectedTemplate]?.typography || 'font-serif'}`}
                        style={{ 
                          color: templateStyles[selectedTemplate]?.colors.text || '#1f2937',
                          borderColor: templateStyles[selectedTemplate]?.colors.border || '#e5e7eb'
                        }}
                      >
                        Certifications
                      </h3>
                      {resume.certifications.map((cert, index) => (
                        <div key={index} className="mb-2">
                          <p 
                            className="text-sm leading-relaxed"
                            style={{ color: templateStyles[selectedTemplate]?.colors.secondary || '#64748b' }}
                          >
                            {cert}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  );
} 