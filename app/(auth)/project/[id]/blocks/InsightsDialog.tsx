import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

const TabContentWrapper = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-auto h-[600px]">
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </CardContent>
    </Card>
  );
};

interface InsightsDialogProps {
  summary: string;
  targetAudience: string;
  painPoints: string;
  empathyMap: string;
  commentsAnalysis: string;
}

export function InsightsDialog({
  summary,
  targetAudience,
  painPoints,
  empathyMap,
  commentsAnalysis,
}: InsightsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-6 w-24 px-2 text-xs">
          Full Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center min-w-[1200px] h-[800px]">
        <DialogTitle>Insights</DialogTitle>
        <Tabs defaultValue="summary" className="h-[1000px]">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="targetAudience">Target Audience</TabsTrigger>
            <TabsTrigger value="painPoints">Pain Points</TabsTrigger>
            <TabsTrigger value="empathyMap">Empathy Map</TabsTrigger>
            <TabsTrigger value="commentsAnalysis">Comments Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="">
            <TabContentWrapper title="Summary" content={summary} />
          </TabsContent>
          <TabsContent value="targetAudience">
            <TabContentWrapper
              title="Target Audience"
              content={targetAudience}
            />
          </TabsContent>
          <TabsContent value="painPoints">
            <TabContentWrapper title="Pain Points" content={painPoints} />
          </TabsContent>
          <TabsContent value="empathyMap">
            <TabContentWrapper title="Empathy Map" content={empathyMap} />
          </TabsContent>
          <TabsContent value="commentsAnalysis">
            <TabContentWrapper
              title="Comments Analysis"
              content={commentsAnalysis}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
