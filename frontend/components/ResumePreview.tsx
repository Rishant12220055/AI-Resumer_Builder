"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Building, GraduationCap, Code, Award, User } from "lucide-react"

interface Resume {
  id: number
  title: string
  createdAt: string
  updatedAt: string
  template?: string
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
    about: string
  }
  experiences: Array<{
    id: number
    company: string
    position: string
    duration: string
    bullets: string[]
  }>
  educations: Array<{
    id: number
    institution: string
    degree: string
    duration: string
    achievements: string[]
  }>
  skills: string[]
  projects: Array<{
    id: number
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  certifications: Array<{
    id: number
    name: string
    issuer: string
    date: string
  }>
}

interface ResumePreviewProps {
  resume: Resume
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="bg-white text-gray-900 font-sans text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{resume.personalInfo.name || "Your Name"}</h1>
        <p className="text-xl text-gray-600 mb-4">{resume.personalInfo.title || "Professional Title"}</p>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {resume.personalInfo.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <span>{resume.personalInfo.email}</span>
            </div>
          )}
          {resume.personalInfo.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <span>{resume.personalInfo.phone}</span>
            </div>
          )}
          {resume.personalInfo.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span>{resume.personalInfo.location}</span>
            </div>
          )}
          {resume.personalInfo.linkedin && (
            <div className="flex items-center space-x-2">
              <Linkedin className="w-4 h-4 text-gray-600" />
              <span>{resume.personalInfo.linkedin}</span>
            </div>
          )}
          {resume.personalInfo.github && (
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4 text-gray-600" />
              <span>{resume.personalInfo.github}</span>
            </div>
          )}
          {resume.personalInfo.website && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <span>{resume.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* About Me */}
      {resume.personalInfo.about && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resume.personalInfo.about}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Professional Experience
          </h2>
          <div className="space-y-4">
            {resume.experiences.map((experience, index) => (
              <div key={experience.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{experience.position || "Position"}</h3>
                    <p className="text-gray-600">{experience.company || "Company"}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{experience.duration || "Duration"}</span>
                  </div>
                </div>
                {experience.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {experience.bullets.map((bullet, bulletIndex) => (
                      bullet.trim() && (
                        <li key={bulletIndex} className="text-sm">{bullet}</li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Education
          </h2>
          <div className="space-y-4">
            {resume.educations.map((education, index) => (
              <div key={education.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{education.degree || "Degree"}</h3>
                    <p className="text-gray-600">{education.institution || "Institution"}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{education.duration || "Duration"}</span>
                  </div>
                </div>
                {education.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {education.achievements.map((achievement, achievementIndex) => (
                      achievement.trim() && (
                        <li key={achievementIndex} className="text-sm">{achievement}</li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Projects
          </h2>
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={project.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name || "Project Name"}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-gray-700 mb-2 text-sm">{project.description || "Project description"}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Certifications
          </h2>
          <div className="space-y-3">
            {resume.certifications.map((certification, index) => (
              <div key={certification.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{certification.name || "Certification Name"}</h3>
                  <p className="text-gray-600 text-sm">{certification.issuer || "Issuing Organization"}</p>
                </div>
                <span className="text-gray-500 text-sm">{certification.date || "Date"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!resume.personalInfo.name && resume.experiences.length === 0 && resume.educations.length === 0 && resume.skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Start adding your information to see the preview here</p>
        </div>
      )}
    </div>
  )
} 