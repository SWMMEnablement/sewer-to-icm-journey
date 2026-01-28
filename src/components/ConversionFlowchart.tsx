import { Card } from "@/components/ui/card";
import { 
  Database, 
  FileSpreadsheet, 
  Settings, 
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Layers,
  GitBranch,
  Wrench
} from "lucide-react";

const ConversionFlowchart = () => {
  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Layers className="w-6 h-6 text-primary" />
        Data Conversion Pipeline
      </h3>
      
      {/* Main Flowchart */}
      <div className="min-w-[800px]">
        {/* Row 1: Source Files */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <div className="w-40 p-4 bg-primary/10 border-2 border-primary rounded-lg">
              <Database className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="font-semibold text-sm">InfoSewer .IEDB</div>
              <div className="text-xs text-muted-foreground mt-1">Source Model</div>
            </div>
          </div>
          
          <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
          
          <div className="text-center">
            <div className="w-40 p-4 bg-muted/50 border-2 border-muted-foreground/30 rounded-lg">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <div className="font-semibold text-sm">DBF Files</div>
              <div className="text-xs text-muted-foreground mt-1">
                NODE, LINK, PIPE,<br/>MANHOLE, PUMP...
              </div>
            </div>
          </div>
          
          <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
          
          <div className="text-center">
            <div className="w-40 p-4 bg-accent/10 border-2 border-accent rounded-lg">
              <Settings className="w-8 h-8 mx-auto text-accent mb-2 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="font-semibold text-sm">Excel COM</div>
              <div className="text-xs text-muted-foreground mt-1">DBF → CSV Conversion</div>
            </div>
          </div>
          
          <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
          
          <div className="text-center">
            <div className="w-40 p-4 bg-muted/50 border-2 border-muted-foreground/30 rounded-lg">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <div className="font-semibold text-sm">CSV Files</div>
              <div className="text-xs text-muted-foreground mt-1">UTF-8 Encoded</div>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center mb-8">
          <ArrowDown className="w-8 h-8 text-primary animate-bounce" />
        </div>

        {/* Row 2: Processing */}
        <div className="flex items-start justify-center gap-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-52 p-4 bg-primary/20 border-2 border-primary rounded-lg">
              <div className="font-semibold text-sm text-center mb-3">Ruby Processing Engine</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Parse SCENARIO.DBF</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Build Inheritance Tree</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Apply YAML Mappings</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Geometry Processing</span>
                </div>
              </div>
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-muted-foreground mt-16 animate-pulse" />

          <div className="flex flex-col items-center gap-4">
            <div className="w-52 p-4 bg-accent/20 border-2 border-accent rounded-lg">
              <GitBranch className="w-6 h-6 mx-auto text-accent mb-2" />
              <div className="font-semibold text-sm text-center mb-3">Scenario Handler</div>
              <div className="space-y-2">
                <div className="text-xs bg-background/50 p-2 rounded text-center">
                  <span className="font-medium">BASE</span>
                  <div className="text-muted-foreground">Primary scenario</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 text-xs bg-background/50 p-2 rounded text-center">
                    <span className="font-medium">ALT1</span>
                  </div>
                  <div className="flex-1 text-xs bg-background/50 p-2 rounded text-center">
                    <span className="font-medium">ALT2</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Inherits & overrides
                </div>
              </div>
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-muted-foreground mt-16 animate-pulse" />

          <div className="flex flex-col items-center gap-4">
            <div className="w-52 p-4 bg-warning/20 border-2 border-warning rounded-lg">
              <Wrench className="w-6 h-6 mx-auto text-warning mb-2" />
              <div className="font-semibold text-sm text-center mb-3">ICM API Import</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Create hw_nodes</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Create hw_conduits</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Create hw_pumps</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-background/50 p-2 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Set Subcatchments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center mb-8">
          <ArrowDown className="w-8 h-8 text-primary animate-bounce" />
        </div>

        {/* Row 3: Post-Processing & Output */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-48 p-4 bg-info/10 border-2 border-info rounded-lg">
              <Settings className="w-8 h-8 mx-auto text-info mb-2" />
              <div className="font-semibold text-sm">SQL Cleanup</div>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <div>• Min conduit length fix</div>
                <div>• Pump curve insertion</div>
                <div>• Outfall type assignment</div>
              </div>
            </div>
          </div>
          
          <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
          
          <div className="text-center">
            <div className="w-48 p-4 bg-success/20 border-2 border-success rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
              <div className="font-semibold text-sm">ICM Model</div>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <div>✓ Complete network</div>
                <div>✓ All scenarios</div>
                <div>✓ Ready to simulate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-sm font-semibold mb-3">Legend</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/20 border-2 border-primary rounded" />
              <span>Source/Input</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent/20 border-2 border-accent rounded" />
              <span>Transformation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning/20 border-2 border-warning rounded" />
              <span>API Operations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-info/10 border-2 border-info rounded" />
              <span>Post-Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success/20 border-2 border-success rounded" />
              <span>Output</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversionFlowchart;
