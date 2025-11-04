import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileInput, 
  Database, 
  Map, 
  Settings, 
  GitBranch, 
  CheckCircle2, 
  ChevronDown,
  Clock,
  Zap,
  Shield,
  FileCode
} from "lucide-react";

const Index = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      title: "Configuration & Model Selection",
      icon: FileInput,
      description: "User selects InfoSewer model location (.IEDB folder) and import settings",
      details: [
        "Prompts for InfoSewer .IEDB folder path",
        "Loads field mapping YAML configurations",
        "Option to delete/preserve existing CSVs",
        "Validates all paths exist and are accessible"
      ],
      file: "prompts.rb",
      color: "bg-primary"
    },
    {
      number: 2,
      title: "Scenario Detection & Selection",
      icon: GitBranch,
      description: "Automatically detects available scenarios from SCENARIO.DBF",
      details: [
        "Reads SCENARIO.DBF to find all scenarios",
        "BASE scenario is always required",
        "User selects additional scenarios to import",
        "Builds parent-child scenario relationships"
      ],
      file: "scenario_import.rb",
      color: "bg-primary"
    },
    {
      number: 3,
      title: "DBF to CSV Conversion",
      icon: Database,
      description: "Converts all DBF files to CSV format using Excel COM automation",
      details: [
        "Recursively finds all .DBF files in IEDB folder",
        "Uses Excel COM to convert to UTF-8 CSV",
        "Preserves folder structure for scenarios",
        "Caches CSVs for faster subsequent imports (12-15 min → <1 min)",
        "Converts 20+ files including MANHOLE, PIPE, PUMP, WWELL, etc."
      ],
      file: "data.rb",
      color: "bg-accent"
    },
    {
      number: 4,
      title: "BASE Geometry Import",
      icon: Map,
      description: "Imports node and link geometry from DBF files",
      details: [
        "Reads NODE.DBF for XYZ coordinates",
        "Reads LINK.DBF for connectivity",
        "Reads VERTEX.DBF for link bend points",
        "Identifies node types: Manhole, Outfall, WetWell",
        "Identifies link types: Pipe, Forcemain, Pump"
      ],
      file: "geo.rb",
      color: "bg-accent"
    },
    {
      number: 5,
      title: "BASE Data Import",
      icon: FileCode,
      description: "Imports all attribute data for BASE scenario",
      details: [
        "MANHOLE.DBF → Node properties (inverts, elevations)",
        "PIPE.DBF → Link properties (diameter, material, slope)",
        "PUMP.DBF → Pump specifications",
        "WWELL.DBF → Wet well definitions",
        "MHHYD.DBF → Hydraulic loads and patterns",
        "Uses YAML field mappings for flexible attribute assignment"
      ],
      file: "InfoSewer_Import_UI.rb",
      color: "bg-success"
    },
    {
      number: 6,
      title: "Subcatchment Creation",
      icon: Map,
      description: "Automatically creates subcatchments for all manholes",
      details: [
        "Creates one subcatchment per manhole",
        "Sets initial area to 0.10",
        "Links to parent node",
        "Sets to 100% connectivity",
        "Configured as 'sanitary' system type"
      ],
      file: "sql_cleanup.rb",
      color: "bg-success"
    },
    {
      number: 7,
      title: "SQL Cleanup & Transformations",
      icon: Settings,
      description: "Applies post-import SQL operations for data integrity",
      details: [
        "Sets outfall node types",
        "Resolves minimum conduit lengths (≥3.3 ft)",
        "Sets number of barrels default",
        "Converts pump conduits to pump objects",
        "Inserts pump curves from specifications",
        "Sets forcemain downstream nodes to 'Break' type",
        "Calculates wetwell surface areas"
      ],
      file: "sql_cleanup.rb",
      color: "bg-success"
    },
    {
      number: 8,
      title: "Scenario Creation",
      icon: GitBranch,
      description: "Creates ICM scenarios for each selected scenario",
      details: [
        "Creates scenario objects in ICM",
        "Establishes parent-child relationships",
        "Configures scenario inheritance chains",
        "Sets up scenario-specific data folders"
      ],
      file: "scenario_import.rb",
      color: "bg-primary"
    },
    {
      number: 9,
      title: "Scenario Data Import",
      icon: Database,
      description: "Imports scenario-specific hydraulic data with inheritance",
      details: [
        "MHHYD data per scenario (loads, patterns)",
        "PIPEHYD data per scenario (roughness, curves)",
        "PUMPHYD data per scenario (pump settings)",
        "WWELLHYD data per scenario (wet well parameters)",
        "Resolves data inheritance from parent scenarios",
        "Uses SET fields (MH_SET, PIPE_SET, etc.) for data location"
      ],
      file: "scenario_import.rb",
      color: "bg-primary"
    },
    {
      number: 10,
      title: "Selection Sets Import",
      icon: CheckCircle2,
      description: "Imports InfoSewer selection sets as ICM selection lists",
      details: [
        "Reads SELSET.CSV for set definitions",
        "Processes SS/{SET_NAME}/ANODE.CSV for nodes",
        "Processes SS/{SET_NAME}/ALINK.CSV for links",
        "Creates ICM selection lists with descriptions",
        "Maps InfoSewer IDs to ICM compound IDs"
      ],
      file: "selection_sets.rb",
      color: "bg-accent"
    }
  ];

  const stats = [
    { label: "Import Time (First)", value: "<5 min", icon: Clock },
    { label: "Import Time (Cached)", value: "<1 min", icon: Zap },
    { label: "Data Preservation", value: "100%", icon: Shield },
    { label: "Validation Status", value: "Clean", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-glow">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Ruby Import Tool v2.1
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              InfoSewer to ICM InfoWorks
              <br />
              <span className="text-white/90">Network Import Process</span>
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl max-w-2xl mx-auto">
              Fully automated tool for importing InfoSewer models into InfoWorks ICM. 
              Reduces import time from 30-45 minutes to under 5 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="p-6 text-center bg-card shadow-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Import Steps */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Import Process Steps
            </h2>
            <p className="text-muted-foreground text-lg">
              Click any step to see detailed information
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isExpanded = expandedStep === index;
              const StepIcon = step.icon;
              
              return (
                <Card 
                  key={index}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => setExpandedStep(isExpanded ? null : index)}
                >
                  <div className="flex items-start gap-4 p-6">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-soft`}>
                      {step.number}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <StepIcon className="w-5 h-5 text-primary flex-shrink-0" />
                          <h3 className="text-xl font-semibold text-foreground">
                            {step.title}
                          </h3>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      
                      <p className="text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      
                      <Badge variant="secondary" className="text-xs">
                        {step.file}
                      </Badge>
                      
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <ul className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <li 
                                key={detailIndex}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
            <p className="mb-2">
              InfoSewer to InfoWorks ICM Import Tool • Version 2.1 • Tested & Production Ready
            </p>
            <p>
              Tested on Ch12Start (314 nodes), Livermore (6.9k nodes, 32 scenarios), Bastrop (1.2k nodes)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
