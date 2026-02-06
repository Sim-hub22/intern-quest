import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ApplicationSuccessModal } from "./application-success-modal";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipTitle: string;
  companyName: string;
  companyLogo?: string;
  workType?: string;
}

const APPLICATION_STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Resume" },
  { id: 3, title: "Questions" },
  { id: 4, title: "Review" },
];

export function ApplicationModal({
  isOpen,
  onClose,
  internshipTitle,
  companyName,
  companyLogo,
  workType = "Remote",
}: ApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resume: null as File | null,
    coverLetter: null as File | null,
    whyInterested: "",
    relevantExperience: "",
    agreedToTerms: false,
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (
    field: "resume" | "coverLetter",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }
      if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        toast.error("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      handleInputChange(field, file);
      toast.success(
        `${field === "resume" ? "Resume" : "Cover letter"} uploaded successfully`,
      );
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.phone) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        break;
      case 2:
        if (!formData.resume || !formData.coverLetter) {
          toast.error("Please upload both resume and cover letter");
          return false;
        }
        break;
      case 3:
        if (!formData.whyInterested || !formData.relevantExperience) {
          toast.error("Please answer all questions");
          return false;
        }
        break;
      case 4:
        if (!formData.agreedToTerms) {
          toast.error("Please agree to the terms and conditions");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < APPLICATION_STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      toast.success("Application submitted successfully!");
      onClose();
      setTimeout(() => {
        setShowSuccessModal(true);
        setCurrentStep(1);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          linkedinUrl: "",
          portfolioUrl: "",
          resume: null,
          coverLetter: null,
          whyInterested: "",
          relevantExperience: "",
          agreedToTerms: false,
        });
      }, 500);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Let&apos;s start with your basic details
              </p>
            </div>

            <div>
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="linkedinUrl"
                className="text-sm font-medium text-gray-700"
              >
                LinkedIn Profile (Optional)
              </Label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  handleInputChange("linkedinUrl", e.target.value)
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label
                htmlFor="portfolioUrl"
                className="text-sm font-medium text-gray-700"
              >
                Portfolio/Website (Optional)
              </Label>
              <Input
                id="portfolioUrl"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={(e) =>
                  handleInputChange("portfolioUrl", e.target.value)
                }
                className="mt-1.5"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Resume & Cover Letter
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Share your credentials and motivation
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Upload Resume <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <div className="mb-2">
                  <Label
                    htmlFor="resume-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Click to upload
                  </Label>
                  <span className="text-gray-600"> or drag and drop</span>
                </div>
                <p className="text-sm text-gray-500">PDF or DOC (max. 5MB)</p>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileUpload("resume", e)}
                />
              </div>
              {formData.resume && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formData.resume.name}
                    </span>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Cover Letter <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <div className="mb-2">
                  <Label
                    htmlFor="cover-letter-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Click to upload
                  </Label>
                  <span className="text-gray-600"> or drag and drop</span>
                </div>
                <p className="text-sm text-gray-500">PDF or DOC (max. 5MB)</p>
                <Input
                  id="cover-letter-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileUpload("coverLetter", e)}
                />
              </div>
              {formData.coverLetter && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formData.coverLetter.name}
                    </span>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Application Questions
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Help us understand you better
              </p>
            </div>

            <div>
              <Label
                htmlFor="whyInterested"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Why are you interested in this internship?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="whyInterested"
                placeholder="Describe what excites you about this opportunity..."
                className="min-h-[140px] resize-none"
                value={formData.whyInterested}
                onChange={(e) =>
                  handleInputChange("whyInterested", e.target.value)
                }
              />
            </div>

            <div>
              <Label
                htmlFor="relevantExperience"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Describe your relevant experience{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="relevantExperience"
                placeholder="Share your relevant skills, projects, coursework, or previous internships..."
                className="min-h-[140px] resize-none"
                value={formData.relevantExperience}
                onChange={(e) =>
                  handleInputChange("relevantExperience", e.target.value)
                }
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Review Your Application
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Please review your information before submitting
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium text-gray-900">
                    {formData.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">
                    {formData.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {formData.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-2.5">
                {formData.resume && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formData.resume.name}
                    </span>
                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                  </div>
                )}
                {formData.coverLetter && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formData.coverLetter.name}
                    </span>
                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreedToTerms", checked)
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm cursor-pointer leading-relaxed text-gray-700"
                >
                  I confirm that all information provided is accurate and I
                  agree to InternQuest&apos;s{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  <span className="text-red-500">*</span>
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogTitle className="sr-only">
            Apply for {internshipTitle} at {companyName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Step {currentStep} of {APPLICATION_STEPS.length}:{" "}
            {APPLICATION_STEPS[currentStep - 1]?.title}
          </DialogDescription>

          {/* Header */}
          <div className="p-8 pb-6">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-blue-600"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Apply for {internshipTitle}
                </h2>
                <p className="text-base text-gray-600 mt-1">
                  {companyName} • {workType}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between px-4">
              {APPLICATION_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base transition-all ${
                        currentStep > step.id
                          ? "bg-blue-600 text-white"
                          : currentStep === step.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span
                      className={`text-sm mt-2.5 font-medium ${
                        currentStep >= step.id
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < APPLICATION_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 mt-[-28px] transition-all ${
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-8 flex justify-between items-center">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="gap-2 h-11 px-6 text-base"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onClose}
                className="h-11 px-6 text-base"
              >
                Cancel
              </Button>
            )}

            {currentStep < APPLICATION_STEPS.length ? (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-6 text-base"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.agreedToTerms}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 h-11 px-6 text-base"
              >
                <Check className="h-5 w-5" />
                Submit Application
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ApplicationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        internshipTitle={internshipTitle}
        companyName={companyName}
      />
    </>
  );
}
