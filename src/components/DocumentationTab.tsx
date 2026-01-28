import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  Database, 
  GitBranch, 
  Map, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Workflow,
  Table,
  Layers
} from "lucide-react";

const DocumentationTab = () => {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Program Overview</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          The InfoSewer to ICM InfoWorks Import Tool is a Ruby-based automation script designed to 
          migrate sewer network models from Innovyze InfoSewer format (.IEDB) to InfoWorks ICM. 
          This tool significantly reduces manual migration effort and ensures data consistency 
          across the conversion process.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="font-semibold mb-1">Input Format</h4>
            <p className="text-sm text-muted-foreground">InfoSewer .IEDB folder containing DBF database files</p>
          </div>
          <div className="p-4 bg-accent/10 rounded-lg">
            <h4 className="font-semibold mb-1">Output Format</h4>
            <p className="text-sm text-muted-foreground">InfoWorks ICM network model with scenarios</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <h4 className="font-semibold mb-1">Processing Time</h4>
            <p className="text-sm text-muted-foreground">First run: ~5 min, Cached: &lt;1 min</p>
          </div>
        </div>
      </Card>

      {/* Data Flow Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Workflow className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Data Flow Architecture</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-24 text-center">
              <Badge className="bg-primary">Source</Badge>
              <p className="text-xs mt-1">InfoSewer</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-primary/50" />
            <div className="flex-shrink-0 w-24 text-center">
              <Badge className="bg-accent">Transform</Badge>
              <p className="text-xs mt-1">Ruby Scripts</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-accent/50" />
            <div className="flex-shrink-0 w-24 text-center">
              <Badge className="bg-success">Target</Badge>
              <p className="text-xs mt-1">ICM InfoWorks</p>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dbf-files">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  DBF Source Files
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4 p-4">
                  <div>
                    <h5 className="font-semibold mb-2">Node Files</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <code>NODE.DBF</code> - XYZ coordinates</li>
                      <li>• <code>MANHOLE.DBF</code> - Manhole properties</li>
                      <li>• <code>WWELL.DBF</code> - Wet well definitions</li>
                      <li>• <code>MHHYD.DBF</code> - Hydraulic loads</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Link Files</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <code>LINK.DBF</code> - Connectivity data</li>
                      <li>• <code>VERTEX.DBF</code> - Bend points</li>
                      <li>• <code>PIPE.DBF</code> - Pipe properties</li>
                      <li>• <code>PUMP.DBF</code> - Pump specifications</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="icm-objects">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  ICM Object Mapping
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">InfoSewer Type</th>
                        <th className="text-left py-2">ICM Type</th>
                        <th className="text-left py-2">Key Attributes</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2">Manhole</td>
                        <td className="py-2">hw_manhole</td>
                        <td className="py-2">ground_level, invert, flood_level</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Outfall</td>
                        <td className="py-2">hw_outfall</td>
                        <td className="py-2">outfall_type, invert_level</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Wet Well</td>
                        <td className="py-2">hw_wet_well</td>
                        <td className="py-2">base_level, surface_area</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Pipe</td>
                        <td className="py-2">hw_conduit</td>
                        <td className="py-2">diameter, roughness, length</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Forcemain</td>
                        <td className="py-2">hw_conduit (pressurized)</td>
                        <td className="py-2">diameter, hazen_williams_c</td>
                      </tr>
                      <tr>
                        <td className="py-2">Pump</td>
                        <td className="py-2">hw_pump</td>
                        <td className="py-2">pump_curve, on_level, off_level</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>

      {/* Scenario Handling */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Scenario Handling</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          InfoSewer scenarios are converted to ICM scenarios with full inheritance support. 
          The BASE scenario is always imported first, with child scenarios inheriting and 
          overriding specific data as needed.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Scenario Data Sources</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span><strong>MH_SET:</strong> Manhole hydraulic data location</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span><strong>PIPE_SET:</strong> Pipe hydraulic data location</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span><strong>PUMP_SET:</strong> Pump configuration location</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span><strong>WWELL_SET:</strong> Wet well data location</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Inheritance Resolution</h4>
            <div className="p-4 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">
                When a scenario references a parent scenario's data (e.g., <code>MH_SET = "BASE"</code>), 
                the import tool resolves this by reading from the parent's data folder. This ensures 
                proper data inheritance chains are maintained in ICM.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* SQL Cleanup Operations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Post-Import SQL Cleanup</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          After the initial data import, several SQL operations are executed to ensure 
          data integrity and compatibility with ICM requirements.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Node Operations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Set outfall node types based on connectivity</li>
              <li>• Create subcatchments for all manholes</li>
              <li>• Calculate wet well surface areas</li>
              <li>• Set forcemain downstream nodes to 'Break'</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Link Operations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Resolve minimum conduit lengths (≥3.3 ft)</li>
              <li>• Set default number of barrels</li>
              <li>• Convert pump conduits to pump objects</li>
              <li>• Insert pump curves from specifications</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* External Dependencies */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <h3 className="text-xl font-bold">External Dependencies & Assumptions</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <h4 className="font-semibold mb-2">Required Software</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>InfoWorks ICM:</strong> Version 2024.x or later with Ruby scripting enabled</li>
              <li>• <strong>Microsoft Excel:</strong> Required for DBF to CSV conversion via COM automation</li>
              <li>• <strong>Windows OS:</strong> WIN32OLE dependency for Excel automation</li>
            </ul>
          </div>
          
          <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
            <h4 className="font-semibold mb-2">Data Assumptions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• InfoSewer model uses standard .IEDB folder structure</li>
              <li>• All DBF files use consistent encoding (converted to UTF-8)</li>
              <li>• Coordinate system is consistent across all geometry files</li>
              <li>• SCENARIO.DBF contains valid parent-child relationships</li>
              <li>• Field names match expected YAML mapping configurations</li>
            </ul>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">YAML Field Mappings</h4>
            <p className="text-sm text-muted-foreground">
              The tool uses YAML configuration files to map InfoSewer field names to ICM 
              attributes. This allows for flexible customization without modifying the 
              Ruby source code. Default mappings are provided for standard InfoSewer exports.
            </p>
          </div>
        </div>
      </Card>

      {/* Tested Models */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-success" />
          <h3 className="text-xl font-bold">Tested & Validated Models</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg text-center">
            <h4 className="font-bold text-2xl text-primary">314</h4>
            <p className="text-sm text-muted-foreground">Ch12Start Nodes</p>
            <Badge variant="secondary" className="mt-2">Tutorial Model</Badge>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <h4 className="font-bold text-2xl text-primary">6,900</h4>
            <p className="text-sm text-muted-foreground">Livermore Nodes</p>
            <Badge variant="secondary" className="mt-2">32 Scenarios</Badge>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <h4 className="font-bold text-2xl text-primary">1,200</h4>
            <p className="text-sm text-muted-foreground">Bastrop Nodes</p>
            <Badge variant="secondary" className="mt-2">Production Model</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentationTab;
