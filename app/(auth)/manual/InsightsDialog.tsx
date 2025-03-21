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

interface InsightsDialogProps {
  summary: string;
  targetAudience: string;
  painPoints: string;
  empathyMap: string;
}

export function InsightsDialog({
  summary,
  targetAudience,
  painPoints,
  empathyMap,
}: InsightsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-6 w-24 px-2 text-xs">
          Full Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center items-center w-[800px] debug">
        <DialogTitle>Insights</DialogTitle>
        <Tabs defaultValue="summary" className="w-full h-[500px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="targetAudience">Target Audience</TabsTrigger>
            <TabsTrigger value="painPoints">Pain Points</TabsTrigger>
            <TabsTrigger value="empathyMap">Empathy Map</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="overflow-y-auto h-[400px]">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <MarkdownRenderer>{summary}</MarkdownRenderer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="targetAudience">
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">{targetAudience}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="painPoints">
            <Card>
              <CardHeader>
                <CardTitle>Pain Points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">{painPoints}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="empathyMap">
            <Card>
              <CardHeader>
                <CardTitle>Empathy Map</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">{empathyMap}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
