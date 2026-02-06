import { Bookmark, Clock, DollarSign, MapPin } from "lucide-react";
import { useState } from "react";
import { ApplicationModal } from "./application-model";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./ui/image-with-fallback";

export interface Internship {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  employmentType: string;
  salary: string;
  duration: string;
  category: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

interface InternshipCardProps {
  internship: Internship;
  onViewDetails: (id: string) => void;
}

export function InternshipCard({
  internship,
  onViewDetails,
}: InternshipCardProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  return (
    <>
      <Card
        className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onViewDetails(internship.id)}
      >
        <div className="flex items-start gap-4">
          <ImageWithFallback
            src={internship.logo}
            alt={internship.company}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-gray-900 mb-1">{internship.title}</h3>
                <p className="text-gray-600">{internship.company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-3 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{internship.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{internship.salary}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{internship.type}</Badge>
              <Badge variant="outline">{internship.category}</Badge>
            </div>

            <p className="text-gray-600 line-clamp-2 mb-3">
              {internship.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Posted {internship.postedDate}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsApplicationModalOpen(true);
                }}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        internshipTitle={internship.title}
        companyName={internship.company}
      />
    </>
  );
}
