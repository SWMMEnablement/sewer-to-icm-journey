import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  X, 
  FileCode, 
  AlertTriangle, 
  BookOpen,
  Database,
  Settings,
  GitBranch,
  Map,
  Workflow
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  category: "documentation" | "troubleshooting" | "step";
  description: string;
  keywords: string[];
  icon: React.ElementType;
}

const searchableContent: SearchResult[] = [
  // Documentation sections
  {
    id: "overview",
    title: "Program Overview",
    category: "documentation",
    description: "Ruby-based automation for migrating InfoSewer to ICM InfoWorks",
    keywords: ["overview", "ruby", "automation", "migration", "infosewer", "icm", "infoworks"],
    icon: BookOpen
  },
  {
    id: "data-flow",
    title: "Data Flow Architecture",
    category: "documentation",
    description: "Source to target transformation pipeline via Ruby scripts",
    keywords: ["data flow", "architecture", "pipeline", "transform", "source", "target"],
    icon: Workflow
  },
  {
    id: "dbf-files",
    title: "DBF Source Files",
    category: "documentation",
    description: "NODE.DBF, MANHOLE.DBF, LINK.DBF, PIPE.DBF and other source files",
    keywords: ["dbf", "source", "node", "manhole", "link", "pipe", "pump", "wwell", "vertex"],
    icon: Database
  },
  {
    id: "icm-mapping",
    title: "ICM Object Mapping",
    category: "documentation",
    description: "Mapping from InfoSewer types to ICM types like hw_manhole, hw_conduit",
    keywords: ["mapping", "icm", "hw_manhole", "hw_conduit", "hw_pump", "hw_outfall", "hw_wet_well"],
    icon: Map
  },
  {
    id: "scenario-handling",
    title: "Scenario Handling",
    category: "documentation",
    description: "Scenario inheritance, MH_SET, PIPE_SET, PUMP_SET, WWELL_SET",
    keywords: ["scenario", "inheritance", "mh_set", "pipe_set", "pump_set", "wwell_set", "base"],
    icon: GitBranch
  },
  {
    id: "sql-cleanup",
    title: "SQL Cleanup Operations",
    category: "documentation",
    description: "Post-import SQL for outfalls, conduit lengths, pump curves",
    keywords: ["sql", "cleanup", "outfall", "conduit", "length", "pump", "curve", "barrel"],
    icon: Settings
  },
  {
    id: "yaml-config",
    title: "YAML Field Mappings",
    category: "documentation",
    description: "Configuration files for flexible field name mapping",
    keywords: ["yaml", "config", "field", "mapping", "configuration", "attribute"],
    icon: FileCode
  },
  // Troubleshooting items
  {
    id: "excel-com",
    title: "Excel COM Automation Failed",
    category: "troubleshooting",
    description: "WIN32OLE errors, DBF not converting, Excel issues",
    keywords: ["excel", "com", "win32ole", "automation", "dbf", "csv", "convert", "error"],
    icon: AlertTriangle
  },
  {
    id: "iedb-structure",
    title: "Invalid IEDB Folder Structure",
    category: "troubleshooting",
    description: "Missing DBF files, empty geometry, scenario detection failure",
    keywords: ["iedb", "folder", "structure", "missing", "dbf", "geometry", "scenario"],
    icon: AlertTriangle
  },
  {
    id: "yaml-mapping",
    title: "Field Mapping Mismatch",
    category: "troubleshooting",
    description: "Attributes not importing, YAML parse errors",
    keywords: ["field", "mapping", "mismatch", "yaml", "attribute", "parse", "error"],
    icon: AlertTriangle
  },
  {
    id: "scenario-inheritance",
    title: "Scenario Data Not Inheriting",
    category: "troubleshooting",
    description: "Child scenarios missing parent data, SET folder issues",
    keywords: ["scenario", "inheritance", "parent", "child", "set", "folder", "missing"],
    icon: AlertTriangle
  },
  {
    id: "pump-curves",
    title: "Pump Curves Not Created",
    category: "troubleshooting",
    description: "Missing hw_pump entries, curve assignment failures",
    keywords: ["pump", "curve", "hw_pump", "missing", "assignment", "pumpcrv"],
    icon: AlertTriangle
  },
  {
    id: "min-length",
    title: "Conduit Minimum Length Violations",
    category: "troubleshooting",
    description: "Short pipes, 3.3 ft minimum, geometry adjustments",
    keywords: ["conduit", "length", "minimum", "short", "pipe", "3.3", "geometry"],
    icon: AlertTriangle
  },
  {
    id: "encoding",
    title: "Character Encoding Issues",
    category: "troubleshooting",
    description: "Special characters corrupted, UTF-8 conversion",
    keywords: ["encoding", "character", "utf8", "utf-8", "corrupted", "special", "bom"],
    icon: AlertTriangle
  },
  // Import steps
  {
    id: "step-config",
    title: "Step 1: Configuration & Model Selection",
    category: "step",
    description: "Select InfoSewer .IEDB folder and import settings",
    keywords: ["step", "configuration", "model", "selection", "iedb", "folder", "yaml"],
    icon: FileCode
  },
  {
    id: "step-scenario",
    title: "Step 2: Scenario Detection",
    category: "step",
    description: "Detect and select scenarios from SCENARIO.DBF",
    keywords: ["step", "scenario", "detection", "selection", "base", "parent", "child"],
    icon: GitBranch
  },
  {
    id: "step-dbf",
    title: "Step 3: DBF to CSV Conversion",
    category: "step",
    description: "Convert DBF files to CSV using Excel COM",
    keywords: ["step", "dbf", "csv", "conversion", "excel", "com", "cache"],
    icon: Database
  },
  {
    id: "step-geometry",
    title: "Step 4: Geometry Import",
    category: "step",
    description: "Import nodes, links, and vertices with coordinates",
    keywords: ["step", "geometry", "import", "node", "link", "vertex", "coordinates", "xyz"],
    icon: Map
  }
];

interface DocumentationSearchProps {
  onResultClick?: (resultId: string, category: string) => void;
}

const DocumentationSearch = ({ onResultClick }: DocumentationSearchProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);
    
    return searchableContent
      .filter(item => {
        const searchText = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      })
      .slice(0, 8);
  }, [query]);

  const getCategoryColor = (category: SearchResult["category"]) => {
    switch (category) {
      case "documentation":
        return "bg-primary/20 text-primary border-primary/30";
      case "troubleshooting":
        return "bg-warning/20 text-warning border-warning/30";
      case "step":
        return "bg-accent/20 text-accent border-accent/30";
    }
  };

  const getCategoryLabel = (category: SearchResult["category"]) => {
    switch (category) {
      case "documentation":
        return "Docs";
      case "troubleshooting":
        return "Fix";
      case "step":
        return "Step";
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result.id, result.category);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search documentation, troubleshooting..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10 bg-background/80 backdrop-blur-sm border-border/50"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isFocused && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-auto shadow-lg">
          <div className="p-2">
            {results.map((result) => {
              const ResultIcon = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="p-1.5 rounded-md bg-muted">
                    <ResultIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{result.title}</span>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(result.category)}`}>
                        {getCategoryLabel(result.category)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {result.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* No Results */}
      {isFocused && query && results.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <div className="p-6 text-center text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found for "{query}"</p>
            <p className="text-xs mt-1">Try different keywords</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentationSearch;
