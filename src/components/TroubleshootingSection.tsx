import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  CheckCircle2,
  Database,
  FileCode,
  Settings,
  Zap,
  HardDrive,
  Network
} from "lucide-react";

interface TroubleshootingItem {
  id: string;
  error: string;
  category: string;
  severity: "critical" | "warning" | "info";
  symptoms: string[];
  causes: string[];
  solutions: string[];
  icon: React.ElementType;
}

const troubleshootingItems: TroubleshootingItem[] = [
  {
    id: "excel-com",
    error: "Excel COM Automation Failed",
    category: "DBF Conversion",
    severity: "critical",
    symptoms: [
      "WIN32OLE error messages in console",
      "DBF files not converting to CSV",
      "Import hangs during conversion phase"
    ],
    causes: [
      "Microsoft Excel not installed on system",
      "Excel is running in background with open dialogs",
      "Insufficient permissions for COM automation"
    ],
    solutions: [
      "Ensure Microsoft Excel is installed (Office 2016 or later)",
      "Close all Excel instances before running import",
      "Run InfoWorks ICM as Administrator",
      "Check Windows Event Viewer for COM errors"
    ],
    icon: FileCode
  },
  {
    id: "iedb-structure",
    error: "Invalid IEDB Folder Structure",
    category: "File System",
    severity: "critical",
    symptoms: [
      "Cannot find required DBF files",
      "Empty geometry import",
      "Scenario detection fails"
    ],
    causes: [
      "Corrupted InfoSewer export",
      "Missing required DBF files (NODE, LINK, MANHOLE, PIPE)",
      "Incorrect folder selected (not .IEDB root)"
    ],
    solutions: [
      "Re-export model from InfoSewer with 'Export All' option",
      "Verify SCENARIO.DBF exists in root folder",
      "Ensure all required DBF files are present: NODE, LINK, VERTEX, MANHOLE, PIPE",
      "Check that scenario subfolders contain MHHYD.DBF files"
    ],
    icon: HardDrive
  },
  {
    id: "yaml-mapping",
    error: "Field Mapping Mismatch",
    category: "Configuration",
    severity: "warning",
    symptoms: [
      "Attributes not importing correctly",
      "Missing data in ICM objects",
      "YAML parse errors in log"
    ],
    causes: [
      "Custom InfoSewer field names not in YAML config",
      "Incorrect YAML syntax",
      "Field type mismatch (string vs numeric)"
    ],
    solutions: [
      "Review YAML field mapping files for typos",
      "Compare InfoSewer DBF column names with YAML keys",
      "Add custom field mappings for non-standard attributes",
      "Validate YAML syntax using an online validator"
    ],
    icon: Settings
  },
  {
    id: "scenario-inheritance",
    error: "Scenario Data Not Inheriting",
    category: "Scenarios",
    severity: "warning",
    symptoms: [
      "Child scenarios missing parent data",
      "Duplicate data across scenarios",
      "Incorrect SET folder references"
    ],
    causes: [
      "MH_SET, PIPE_SET pointing to non-existent folders",
      "Circular scenario references in SCENARIO.DBF",
      "Parent scenario not imported before child"
    ],
    solutions: [
      "Import BASE scenario first, then children",
      "Verify SET fields in SCENARIO.DBF are correct",
      "Check that referenced data folders exist",
      "Clear existing scenarios and re-import in order"
    ],
    icon: Network
  },
  {
    id: "pump-curves",
    error: "Pump Curves Not Created",
    category: "Hydraulics",
    severity: "warning",
    symptoms: [
      "Pump objects have no curves assigned",
      "Missing hw_pump entries",
      "SQL cleanup reports errors"
    ],
    causes: [
      "PUMP.DBF missing curve specification data",
      "Pump IDs don't match conduit IDs",
      "Curve format incompatible with ICM"
    ],
    solutions: [
      "Verify PUMP.DBF contains PUMPCRV field data",
      "Check that pump link IDs match PUMP.DBF entries",
      "Manually create pump curves in ICM if data missing",
      "Review SQL cleanup log for specific failures"
    ],
    icon: Zap
  },
  {
    id: "min-length",
    error: "Conduit Minimum Length Violations",
    category: "Geometry",
    severity: "info",
    symptoms: [
      "Validation warnings for short pipes",
      "Conduits auto-lengthened to 3.3 ft",
      "Geometry doesn't match source model"
    ],
    causes: [
      "InfoSewer allows shorter pipes than ICM minimum",
      "Vertex points creating near-zero segments",
      "Coordinate precision issues during conversion"
    ],
    solutions: [
      "These are automatically resolved by SQL cleanup",
      "Review affected conduits in ICM validation report",
      "Consider merging very short pipes in source model",
      "Adjust SQL cleanup minimum length if needed"
    ],
    icon: Database
  },
  {
    id: "encoding",
    error: "Character Encoding Issues",
    category: "Data Quality",
    severity: "info",
    symptoms: [
      "Special characters appearing as ???? or boxes",
      "Description fields corrupted",
      "CSV parsing errors"
    ],
    causes: [
      "DBF files using non-UTF8 encoding",
      "Excel adding BOM characters during conversion",
      "Regional settings affecting character interpretation"
    ],
    solutions: [
      "The tool converts to UTF-8 automatically",
      "Check Windows regional settings match source data",
      "Manually edit problematic CSV files if needed",
      "Avoid special characters in critical fields"
    ],
    icon: AlertCircle
  }
];

const TroubleshootingSection = () => {
  const getSeverityColor = (severity: TroubleshootingItem["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "info":
        return "bg-info text-info-foreground";
    }
  };

  const getSeverityIcon = (severity: TroubleshootingItem["severity"]) => {
    switch (severity) {
      case "critical":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <h3 className="text-xl font-bold">Troubleshooting Guide</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Common errors encountered during the InfoSewer to ICM import process and their solutions. 
          Click on any issue to expand the details.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="w-3 h-3 mr-1" />
            Critical - Blocks Import
          </Badge>
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning - Data Issues
          </Badge>
          <Badge className="bg-info/20 text-info border-info/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Info - Auto-resolved
          </Badge>
        </div>

        <Accordion type="multiple" className="w-full space-y-2">
          {troubleshootingItems.map((item) => {
            const SeverityIcon = getSeverityIcon(item.severity);
            const ItemIcon = item.icon;
            
            return (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="border rounded-lg px-4 data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-lg ${getSeverityColor(item.severity)}`}>
                      <SeverityIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{item.error}</span>
                        <Badge variant="secondary" className="text-xs">
                          <ItemIcon className="w-3 h-3 mr-1" />
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid md:grid-cols-3 gap-4 mt-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        Symptoms
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        Possible Causes
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.causes.map((cause, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Solutions
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-success">•</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>

      {/* Quick Reference Card */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Pre-Import Checklist
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Microsoft Excel installed and closed</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>InfoSewer model exported to .IEDB folder</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>YAML field mapping files accessible</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>ICM network open and writable</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Sufficient disk space for CSV cache</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Run ICM as Administrator (recommended)</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default TroubleshootingSection;
