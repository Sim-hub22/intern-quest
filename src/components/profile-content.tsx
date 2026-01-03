"use client";

import {
  Camera,
  Download,
  Edit2,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useState } from "react";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
}

export function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null
  );
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Computer Science student passionate about software development and innovation. Seeking internship opportunities to apply my skills in real-world projects.",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: "2025",
    gpa: "3.8",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "Software Engineering Intern",
      company: "Tech Startup Inc.",
      period: "Jun 2024 - Aug 2024",
      description:
        "Developed full-stack features using React and Node.js, improving application performance by 30%.",
    },
    {
      id: "2",
      title: "Web Developer",
      company: "University IT Department",
      period: "Sep 2023 - Present",
      description:
        "Maintained and enhanced university web applications, collaborating with a team of 5 developers.",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      school: "Stanford University",
      period: "2021 - 2025",
    },
  ]);

  const [experienceForm, setExperienceForm] = useState<Omit<Experience, "id">>({
    title: "",
    company: "",
    period: "",
    description: "",
  });

  const [educationForm, setEducationForm] = useState<Omit<Education, "id">>({
    degree: "",
    school: "",
    period: "",
  });

  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "Python",
    "Node.js",
    "TypeScript",
    "SQL",
    "Git",
    "AWS",
    "Docker",
    "Tailwind CSS",
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleExperienceFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExperienceForm({ ...experienceForm, [name]: value });
  };

  const handleEducationFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEducationForm({ ...educationForm, [name]: value });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...experienceForm,
    };
    setExperiences([...experiences, newExperience]);
    setShowExperienceForm(false);
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      ...educationForm,
    };
    setEducation([...education, newEducation]);
    setShowEducationForm(false);
  };

  const editExperience = (id: string) => {
    const experienceToEdit = experiences.find((exp) => exp.id === id);
    if (experienceToEdit) {
      setExperienceForm({
        title: experienceToEdit.title,
        company: experienceToEdit.company,
        period: experienceToEdit.period,
        description: experienceToEdit.description,
      });
      setEditingExperienceId(id);
      setShowExperienceForm(true);
    }
  };

  const editEducation = (id: string) => {
    const educationToEdit = education.find((edu) => edu.id === id);
    if (educationToEdit) {
      setEducationForm({
        degree: educationToEdit.degree,
        school: educationToEdit.school,
        period: educationToEdit.period,
      });
      setEditingEducationId(id);
      setShowEducationForm(true);
    }
  };

  const updateExperience = () => {
    const updatedExperiences = experiences.map((exp) =>
      exp.id === editingExperienceId ? { ...exp, ...experienceForm } : exp
    );
    setExperiences(updatedExperiences);
    setShowExperienceForm(false);
    setEditingExperienceId(null);
  };

  const updateEducation = () => {
    const updatedEducation = education.map((edu) =>
      edu.id === editingEducationId ? { ...edu, ...educationForm } : edu
    );
    setEducation(updatedEducation);
    setShowEducationForm(false);
    setEditingEducationId(null);
  };

  const deleteExperience = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
  };

  const deleteEducation = (id: string) => {
    const updatedEducation = education.filter((edu) => edu.id !== id);
    setEducation(updatedEducation);
  };

  const deleteSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setShowSkillForm(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    document.getElementById("profile-image-input")?.click();
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setResumeFile({ name: file.name, url });
    }
  };

  const triggerResumeUpload = () => {
    document.getElementById("resume-file-input")?.click();
  };

  const handleResumeDownload = () => {
    if (resumeFile) {
      const link = document.createElement("a");
      link.href = resumeFile.url;
      link.download = resumeFile.name;
      link.click();
    }
  };

  const handleResumeDelete = () => {
    setResumeFile(null);
  };

  return (
    <div>
      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Profile Header */}
        <div className="p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-4xl">
                  {formData.name.charAt(0)}
                </div>
              )}
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={triggerImageUpload}
                disabled={!isEditing}
                className={`absolute bottom-0 right-0 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center transition-colors ${
                  isEditing
                    ? "hover:bg-gray-50 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-gray-900 mb-2 px-3 py-1 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                    />
                  ) : (
                    <h1 className="text-gray-900 mb-2">{formData.name}</h1>
                  )}
                  <p className="text-gray-600 mb-1">
                    {formData.major} • {formData.university}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Class of {formData.graduationYear} • GPA: {formData.gpa}
                  </p>
                </div>
                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    "Edit Profile"
                  )}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 text-sm"
                />
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600"
                />
              ) : (
                <span className="text-gray-700">{formData.email}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600"
                />
              ) : (
                <span className="text-gray-700">{formData.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600"
                />
              ) : (
                <span className="text-gray-700">{formData.location}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Linkedin className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600"
                />
              ) : (
                <a
                  href={`https://${formData.linkedin}`}
                  className="text-blue-600 hover:underline"
                >
                  {formData.linkedin}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Github className="w-4 h-4 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600"
                />
              ) : (
                <a
                  href={`https://${formData.github}`}
                  className="text-blue-600 hover:underline"
                >
                  {formData.github}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Skills</h2>
          {isEditing && (
            <button
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => setShowSkillForm(true)}
            >
              + Add Skill
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm border border-blue-200 flex items-center gap-1.5"
            >
              {skill}
              {isEditing && (
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => deleteSkill(skill)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
        {showSkillForm && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Add Skill</h3>
              <button
                className="text-gray-600 hover:text-gray-700 text-sm"
                onClick={() => setShowSkillForm(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Skill"
              />
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                onClick={addSkill}
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Experience</h2>
          {isEditing && (
            <button
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => setShowExperienceForm(true)}
            >
              + Add Experience
            </button>
          )}
        </div>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                {exp.company.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{exp.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
                <p className="text-gray-500 text-xs mb-2">{exp.period}</p>
                <p className="text-gray-700 text-sm">{exp.description}</p>
                {isEditing && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      onClick={() => editExperience(exp.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 text-sm"
                      onClick={() => deleteExperience(exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {showExperienceForm && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Add Experience</h3>
              <button
                className="text-gray-600 hover:text-gray-700 text-sm"
                onClick={() => setShowExperienceForm(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={experienceForm.title}
                onChange={handleExperienceFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Title"
              />
              <input
                type="text"
                name="company"
                value={experienceForm.company}
                onChange={handleExperienceFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Company"
              />
              <input
                type="text"
                name="period"
                value={experienceForm.period}
                onChange={handleExperienceFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Period"
              />
              <textarea
                name="description"
                value={experienceForm.description}
                onChange={handleExperienceFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Description"
              />
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                onClick={editingExperienceId ? updateExperience : addExperience}
              >
                {editingExperienceId ? (
                  <>
                    <Save className="w-4 h-4" />
                    Update Experience
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Education</h2>
          {isEditing && (
            <button
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => setShowEducationForm(true)}
            >
              + Add Education
            </button>
          )}
        </div>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                {edu.school.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{edu.degree}</h3>
                <p className="text-gray-600 text-sm mb-2">{edu.school}</p>
                <p className="text-gray-500 text-xs">{edu.period}</p>
                {isEditing && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      onClick={() => editEducation(edu.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 text-sm"
                      onClick={() => deleteEducation(edu.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {showEducationForm && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Add Education</h3>
              <button
                className="text-gray-600 hover:text-gray-700 text-sm"
                onClick={() => setShowEducationForm(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="degree"
                value={educationForm.degree}
                onChange={handleEducationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Degree"
              />
              <input
                type="text"
                name="school"
                value={educationForm.school}
                onChange={handleEducationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="School"
              />
              <input
                type="text"
                name="period"
                value={educationForm.period}
                onChange={handleEducationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
                placeholder="Period"
              />
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                onClick={editingEducationId ? updateEducation : addEducation}
              >
                {editingEducationId ? (
                  <>
                    <Save className="w-4 h-4" />
                    Update Education
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Education
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resume */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-gray-900 mb-6">Resume / CV</h2>

        {resumeFile ? (
          <div className="border-2 border-gray-200 rounded-xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">{resumeFile.name}</h3>
                  <p className="text-gray-500 text-sm">Uploaded Resume</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResumeDownload}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download Resume"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResumeDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Upload Your Resume</h3>
              <p className="text-gray-500 text-sm mb-6">
                PDF, DOC, or DOCX (Max 5MB)
              </p>
              <button
                onClick={triggerResumeUpload}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          id="resume-file-input"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
