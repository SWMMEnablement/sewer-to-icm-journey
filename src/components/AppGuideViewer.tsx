import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download } from "lucide-react";
// Vite raw import — bundles the markdown source as a string at build time.
import guideMarkdown from "../../APP_GUIDE.md?raw";
import { downloadMarkdown } from "@/lib/validationReport";

const AppGuideViewer = () => {
  return (
    <Card className="p-6 md:p-10">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">App Guide (blog-ready)</h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={() => downloadMarkdown("APP_GUIDE.md", guideMarkdown)}
        >
          <Download className="w-4 h-4" /> Download source
        </Button>
      </div>
      <article
        className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-mt-24
          prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-10 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
          prose-p:leading-relaxed
          prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:text-foreground
          prose-a:text-primary
          prose-table:text-sm
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/40 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:not-italic
          prose-hr:my-8
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideMarkdown}</ReactMarkdown>
      </article>
    </Card>
  );
};

export default AppGuideViewer;
