import {
  ArrowRight,
  Calendar,
  CheckCircle,
  FileText,
  Mail,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";

interface ApplicationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipTitle: string;
  companyName: string;
  applicationId?: string;
}

export function ApplicationSuccessModal({
  isOpen,
  onClose,
  internshipTitle,
  companyName,
  applicationId = "APP-" +
    Math.random().toString(36).substring(2, 9).toUpperCase(),
}: ApplicationSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogDescription className="sr-only">
          Your application for {internshipTitle} at {companyName} has been
          successfully submitted. View next steps and track your application
          progress.
        </DialogDescription>
        <div className="text-center py-6">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full p-6">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-gray-900 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-8">
            Your application for{" "}
            <span className="font-semibold text-gray-900">
              {internshipTitle}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-gray-900">{companyName}</span>{" "}
            has been received.
          </p>

          {/* Application ID */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Application ID</p>
            <p className="font-mono font-semibold text-lg text-gray-900">
              {applicationId}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white border rounded-lg p-6 mb-6 text-left">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                What&apos;s Next?
              </span>
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Email Confirmation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Check your inbox for a confirmation email with application
                    details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Application Review
                  </h4>
                  <p className="text-sm text-gray-600">
                    The hiring team will review your application within 5-7
                    business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Track Your Progress
                  </h4>
                  <p className="text-sm text-gray-600">
                    Monitor your application status in your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-gray-700">
              While you wait, continue exploring other opportunities and prepare
              for potential interviews by reviewing the company&apos;s recent
              projects and news.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Continue Browsing
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
              onClick={() => {
                // Navigate to dashboard
                onClose();
              }}
            >
              View My Applications
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
