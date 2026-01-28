import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileInput, 
  Database, 
  Map, 
  Settings, 
  GitBranch, 
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  FileCode,
  Loader2
} from "lucide-react";

interface WizardStep {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
  status: "pending" | "active" | "completed" | "error";
  duration: string;
  details: string[];
}

const initialSteps: WizardStep[] = [
  {
    id: 1,
    title: "Select Model",
    shortTitle: "Model",
    description: "Choose your InfoSewer .IEDB folder location",
    icon: FileInput,
    status: "pending",
    duration: "~10 sec",
    details: [
      "Browse to your InfoSewer .IEDB export folder",
      "Verify SCENARIO.DBF and NODE.DBF are present",
      "Load YAML field mapping configurations"
    ]
  },
  {
    id: 2,
    title: "Scenario Selection",
    shortTitle: "Scenarios",
    description: "Choose which scenarios to import",
    icon: GitBranch,
    status: "pending",
    duration: "~5 sec",
    details: [
      "BASE scenario is required and auto-selected",
      "Choose additional scenarios from detected list",
      "Parent-child relationships are preserved"
    ]
  },
  {
    id: 3,
    title: "DBF Conversion",
    shortTitle: "Convert",
    description: "Convert DBF files to CSV format",
    icon: Database,
    status: "pending",
    duration: "~3 min (first) / <1 min (cached)",
    details: [
      "Excel COM automation processes each DBF file",
      "CSV files are cached for faster re-imports",
      "UTF-8 encoding applied to all outputs"
    ]
  },
  {
    id: 4,
    title: "Geometry Import",
    shortTitle: "Geometry",
    description: "Import nodes and links with coordinates",
    icon: Map,
    status: "pending",
    duration: "~30 sec",
    details: [
      "NODE.DBF coordinates → hw_node objects",
      "LINK.DBF connectivity → hw_conduit objects",
      "VERTEX.DBF → bend points on conduits"
    ]
  },
  {
    id: 5,
    title: "Attribute Import",
    shortTitle: "Attributes",
    description: "Import all object properties and data",
    icon: FileCode,
    status: "pending",
    duration: "~45 sec",
    details: [
      "Manhole, pipe, pump specifications imported",
      "Wet well parameters and curves loaded",
      "Hydraulic loads assigned to nodes"
    ]
  },
  {
    id: 6,
    title: "SQL Cleanup",
    shortTitle: "Cleanup",
    description: "Apply data transformations and fixes",
    icon: Settings,
    status: "pending",
    duration: "~15 sec",
    details: [
      "Minimum conduit length enforcement (3.3 ft)",
      "Pump curve creation from specifications",
      "Outfall and break node type assignment"
    ]
  }
];

const ConversionWizard = () => {
  const [steps, setSteps] = useState<WizardStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = isComplete ? 100 : (currentStep / steps.length) * 100;

  const handleStart = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === 0 ? "active" : "pending"
    })));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx < currentStep ? "completed" : idx === currentStep ? "active" : "pending"
      })));
      setCurrentStep(prev => prev + 1);
    }
    
    if (currentStep === steps.length) {
      setSteps(prev => prev.map(step => ({ ...step, status: "completed" })));
      setIsComplete(true);
      setIsRunning(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx < currentStep - 1 ? "completed" : idx === currentStep - 1 ? "active" : "pending"
      })));
    }
  };

  const handleReset = () => {
    setSteps(initialSteps);
    setCurrentStep(0);
    setIsRunning(false);
    setIsComplete(false);
  };

  const getStatusIcon = (status: WizardStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "active":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "error":
        return <Circle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: WizardStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/20 border-success text-success";
      case "active":
        return "bg-primary/20 border-primary text-primary";
      case "error":
        return "bg-destructive/20 border-destructive text-destructive";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const activeStep = steps[currentStep - 1];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Interactive Conversion Wizard
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Step through the import process interactively
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  step.status === "active" ? "scale-110" : ""
                }`}
                onClick={() => {
                  if (isRunning && step.status !== "pending") {
                    setCurrentStep(idx + 1);
                    setSteps(prev => prev.map((s, i) => ({
                      ...s,
                      status: i < idx ? "completed" : i === idx ? "active" : "pending"
                    })));
                  }
                }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${getStatusColor(step.status)}`}>
                  {step.status === "active" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : step.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step.status === "active" ? "text-primary" : 
                  step.status === "completed" ? "text-success" : "text-muted-foreground"
                }`}>
                  {step.shortTitle}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${
                  steps[idx + 1].status === "pending" ? "bg-border" : "bg-primary"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Details */}
      {!isRunning && !isComplete && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Ready to Start</h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Click "Start Wizard" to begin stepping through the conversion process interactively.
          </p>
          <Button onClick={handleStart} className="gap-2">
            <Play className="w-4 h-4" />
            Start Wizard
          </Button>
        </div>
      )}

      {isRunning && activeStep && (
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getStatusColor(activeStep.status)}`}>
              <activeStep.icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold">
                  Step {activeStep.id}: {activeStep.title}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {activeStep.duration}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{activeStep.description}</p>
              
              <ul className="space-y-2">
                {activeStep.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {getStatusIcon(activeStep.status)}
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep <= 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className="gap-2"
            >
              {currentStep === steps.length ? "Complete" : "Next Step"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="text-center py-8 bg-success/5 rounded-lg border border-success/20">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h4 className="text-lg font-semibold text-success mb-2">Conversion Complete!</h4>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            All steps have been completed successfully. Your InfoSewer model has been 
            converted to InfoWorks ICM format.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Start New Conversion
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ConversionWizard;
