import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Database, 
  GitBranch, 
  Map, 
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to InfoSewer → ICM InfoWorks Converter",
      description: "This tool automates the migration of InfoSewer sewer models to Innovyze InfoWorks ICM format.",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The conversion process reads your InfoSewer .IEDB database files and creates 
            equivalent network objects in InfoWorks ICM, preserving:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Network geometry (nodes, links, vertices)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Hydraulic properties and settings</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Scenario configurations and inheritance</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Selection sets and groupings</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "External Assumptions & Requirements",
      description: "The conversion process depends on several external factors and assumptions.",
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Important Assumptions
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Excel COM Automation:</strong> Microsoft Excel must be installed for DBF conversion</li>
              <li>• <strong>File Structure:</strong> InfoSewer .IEDB folder must have standard structure</li>
              <li>• <strong>Coordinate System:</strong> Assumes consistent coordinate reference system</li>
              <li>• <strong>Field Mappings:</strong> Uses YAML configuration for attribute mapping</li>
              <li>• <strong>ICM Version:</strong> Tested with InfoWorks ICM 2024.x and later</li>
            </ul>
          </div>
          <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
            <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Data Validation
            </h4>
            <p className="text-sm text-muted-foreground">
              Post-import SQL cleanup operations ensure data integrity, including 
              minimum conduit lengths, pump curve insertions, and node type assignments.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Conversion Workflow Overview",
      description: "The 10-step process ensures complete and accurate model migration.",
      icon: GitBranch,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Badge className="mb-2 bg-primary">Phase 1</Badge>
              <p className="text-sm font-medium">Configuration</p>
              <p className="text-xs text-muted-foreground">Model selection & settings</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Badge className="mb-2 bg-primary">Phase 2</Badge>
              <p className="text-sm font-medium">Data Extraction</p>
              <p className="text-xs text-muted-foreground">DBF to CSV conversion</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Badge className="mb-2 bg-accent">Phase 3</Badge>
              <p className="text-sm font-medium">Geometry Import</p>
              <p className="text-xs text-muted-foreground">Nodes, links, vertices</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <Badge className="mb-2 bg-success">Phase 4</Badge>
              <p className="text-sm font-medium">Data & Cleanup</p>
              <p className="text-xs text-muted-foreground">Attributes & validation</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scroll down on the main page to see detailed steps and source code.
          </p>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">
                Step {step + 1} of {steps.length}
              </Badge>
              <DialogTitle>{currentStep.title}</DialogTitle>
            </div>
          </div>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {currentStep.content}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => onOpenChange(false)}>
                Get Started <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
