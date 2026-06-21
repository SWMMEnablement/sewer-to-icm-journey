import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileCode,
  Code2,
  BookOpen,
  HelpCircle
} from "lucide-react";
import OnboardingModal from "@/components/OnboardingModal";
import DocumentationTab from "@/components/DocumentationTab";
import ThemeToggle from "@/components/ThemeToggle";
import DocumentationSearch from "@/components/DocumentationSearch";
import LimitationsPanel from "@/components/LimitationsPanel";

const Index = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding on first visit
    const hasSeenOnboarding = localStorage.getItem('infosewer-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('infosewer-onboarding-seen', 'true');
    }
  }, []);

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
      inputs: ["IEDB folder path", "YAML field mapping files", "Previous config (optional)"],
      outputs: ["Validated config object passed to downstream steps"],
      failures: ["IEDB path not found", "YAML mapping file missing or malformed"],
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
      inputs: ["SCENARIO.DBF", "User selection dialog"],
      outputs: ["Ordered list of scenarios with parent links"],
      failures: ["Missing BASE scenario", "Circular parent references"],
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
      inputs: ["*.DBF files under IEDB", "Excel (COM)"],
      outputs: ["UTF-8 CSV files mirrored under csv cache folder"],
      failures: ["Excel not installed / COM blocked", "Locked DBF files", "Non-Windows host"],
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
      inputs: ["NODE.CSV", "LINK.CSV", "VERTEX.CSV", "MANHOLE.CSV", "WWELL.CSV"],
      outputs: ["hw_nodes and hw_conduits with geometry in ICM"],
      failures: ["Mixed coordinate systems", "Orphan link endpoints", "Duplicate node IDs"],
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
      inputs: ["MANHOLE/PIPE/PUMP/WWELL/MHHYD CSVs", "YAML mappings"],
      outputs: ["Populated attribute fields on BASE network objects"],
      failures: ["Field name mismatch vs YAML", "Unit mismatch (ft vs m)"],
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
      inputs: ["Imported hw_node list (Manhole type)"],
      outputs: ["One hw_subcatchment per manhole (area = 0.10)"],
      failures: ["Manholes missing after geometry step", "Area must be re-evaluated manually"],
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
      inputs: ["BASE network after data import"],
      outputs: ["Cleaned network: outfalls, pumps, breaks, valid lengths"],
      failures: ["SQL transaction rollback on constraint violation", "Pump curve missing for converted link"],
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
      inputs: ["Scenario list from step 2"],
      outputs: ["ICM scenario tree mirroring InfoSewer hierarchy"],
      failures: ["Duplicate scenario name", "Parent not yet created"],
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
      inputs: ["Per-scenario MHHYD/PIPEHYD/PUMPHYD/WWELLHYD CSVs", "SET fields"],
      outputs: ["Scenario-specific overrides applied in ICM"],
      failures: ["SET points to missing parent folder", "Inheritance chain depth > supported"],
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
      inputs: ["SELSET.CSV", "SS/*/ANODE.CSV", "SS/*/ALINK.CSV"],
      outputs: ["ICM selection lists with mapped object IDs"],
      failures: ["Selection references missing object IDs", "Empty selection sets skipped"],
      file: "selection_sets.rb",
      color: "bg-accent"
    }
  ];

  const stats = [
    { label: "Import Time (First Run)", value: "<5 min", icon: Clock },
    { label: "Import Time (Cached)", value: "<1 min", icon: Zap },
    { label: "Tested Models", value: "314 / 1.2k / 6.9k nodes", icon: CheckCircle2 },
    { label: "Compatibility", value: "ICM 2024.x · Win · Excel", icon: Shield }
  ];


  return (
    <div className="min-h-screen bg-background">
      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
      
      {/* Header with Theme Toggle and Search */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <DocumentationSearch />
        <ThemeToggle />
      </div>

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
            <p className="mb-4 text-lg text-white/90 md:text-xl max-w-2xl mx-auto">
              Fully automated tool for converting InfoSewer models to InfoWorks ICM format. 
              Reduces import time from 30-45 minutes to under 5 minutes.
            </p>
            <p className="mb-8 text-sm text-white/70 max-w-2xl mx-auto">
              Note: This conversion process depends on external assumptions including Excel COM automation, 
              standard .IEDB folder structure, and YAML field mappings.
            </p>
            <Button 
              variant="secondary" 
              onClick={() => setShowOnboarding(true)}
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              View Onboarding Guide
            </Button>
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

      {/* Source Code Section */}
      <div className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code2 className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Ruby Source Code
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Complete source code for the import tool
            </p>
          </div>

          <Card className="overflow-hidden">
            <Tabs defaultValue="docs" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0 h-auto flex-wrap">
                <TabsTrigger value="docs" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger value="main" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  InfoSewer_Import_UI.rb
                </TabsTrigger>
                <TabsTrigger value="prompts" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  prompts.rb
                </TabsTrigger>
                <TabsTrigger value="data" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  data.rb
                </TabsTrigger>
                <TabsTrigger value="geo" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  geo.rb
                </TabsTrigger>
                <TabsTrigger value="scenario" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  scenario_import.rb
                </TabsTrigger>
                <TabsTrigger value="selection" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  selection_sets.rb
                </TabsTrigger>
                <TabsTrigger value="cleanup" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  sql_cleanup.rb
                </TabsTrigger>
              </TabsList>

              <TabsContent value="docs" className="p-6 m-0">
                <DocumentationTab />
              </TabsContent>

              <TabsContent value="main" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{mainCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="prompts" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{promptsCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="data" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{dataCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="geo" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{geoCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="scenario" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{scenarioCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="selection" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{selectionCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="cleanup" className="p-0 m-0">
                <div className="max-h-[600px] overflow-auto">
                  <pre className="p-6 text-sm bg-card">
                    <code>{cleanupCode}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background">
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

// Ruby source code content
const mainCode = `# ============================================================================
# InfoSewer to InfoWorks ICM Import Tool - UI SCRIPT
# ============================================================================
# Main entry point for importing InfoSewer models into InfoWorks ICM

load File.join(__dir__, 'lib', 'data.rb')
load File.join(__dir__, 'lib', 'prompts.rb')
load File.join(__dir__, 'lib', 'geo.rb')
load File.join(__dir__, 'lib', 'sql_cleanup.rb')
load File.join(__dir__, 'lib', 'scenario_import.rb')
load File.join(__dir__, 'lib', 'selection_sets.rb')

def main()
  puts "InfoSewer to InfoWorks ICM Import Tool"
  
  # Get network and configuration
  network = WSApplication.current_network
  return unless network
  
  # Import BASE scenario
  # Import scenarios
  # Import selection sets
  
  puts "Import Complete!"
end

main()`;

const promptsCode = `require 'yaml'

# User prompts and configuration dialogs

def prompt_get_config(config_file)
  # Load previous config or use defaults
  # Display configuration dialog
  # Save config for next time
end

def prompt_select_scenarios(scenario_names)
  # Display scenario selection dialog
  # Return selected scenarios
end`;

const dataCode = `require 'yaml'
require 'win32ole'
require 'csv'
require 'fileutils'

# DBF to CSV conversion using Excel COM automation

def get_converted_csvs(model_path, csv_path, delete_existing)
  # Convert DBF files to CSV format
  convert_dbf_to_csv(iedb_path, csv_path, delete_existing)
end

def convert_dbf_to_csv(dbf_path, csv_path, delete_existing = true)
  # Create Excel instance
  excel = WIN32OLE::new('Excel.Application')
  excel.DisplayAlerts = false
  
  # Convert each DBF file
  Dir.glob(File.join(dbf_path, '**', '*.DBF')).each do |dbf|
    # Open and save as UTF-8 CSV
  end
  
  excel.Quit()
end`;

const geoCode = `# Network geometry import from DBF files

def get_model_nodes(csv_anode_ids, csv_manhole, csv_wwell, csv_node)
  nodes = Hash.new
  
  # Read manholes and determine node types
  # Read wetwells
  # Append geometry from NODE.DBF
  
  return nodes
end

def get_model_links(csv_alink_ids, csv_vertex, csv_link, csv_pipe, csv_pump)
  links = Hash.new
  
  # Read pipes and forcemains
  # Read pumps
  # Add vertices and connectivity
  
  return links
end`;

const scenarioCode = `# Scenario-specific data import

def import_scenario_mhhyd(network, scenario_id, iedb_path, mh_set)
  # Import manhole hydraulic loads per scenario
  # Update subcatchment LOAD1-10, PATTERN1-10
end

def import_scenario_pipehyd(network, scenario_id, iedb_path, pipe_set)
  # Import pipe hydraulics per scenario
  # Update inverts, lengths, diameters, roughness
end

def import_scenario_pumphyd(network, scenario_id, iedb_path, pump_set)
  # Import pump curves per scenario
end

def import_scenario_wwellhyd(network, scenario_id, iedb_path, well_set)
  # Import wetwell data per scenario
end`;

const selectionCode = `# Import InfoSewer selection sets as ICM selection lists

def import_selection_sets(network, iedb_path, parent_object)
  # Read SELSET.CSV for set definitions
  # Process each selection set
  # Read ANODE.CSV and ALINK.CSV
  # Create ICM selection lists
end`;

const cleanupCode = `# Post-import SQL cleanup operations

def run_all_cleanup_sql(network)
  network.transaction_begin
  
  sql_set_outfall_types(network)
  sql_create_subcatchments(network)
  sql_resolve_conduit_lengths(network)
  sql_find_and_convert_pumps(network)
  sql_insert_pump_curves(network)
  
  network.transaction_commit
end`;

export default Index;
