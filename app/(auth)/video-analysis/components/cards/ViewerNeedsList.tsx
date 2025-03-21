import { ViewerNeed } from '../../lib/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { MessageSquare } from 'lucide-react';

interface ViewerNeedsListProps {
  viewerNeeds: ViewerNeed[];
}

export function ViewerNeedsList({ viewerNeeds }: ViewerNeedsListProps) {
  return (
    <div>
      <h4 className="text-sm mb-2 font-bold">Viewer Needs & Requests:</h4>
      <ul className="space-y-1">
        {viewerNeeds.map((needItem, i) => (
          <ViewerNeedItem key={i} needItem={needItem} />
        ))}
      </ul>
    </div>
  );
}

interface ViewerNeedItemProps {
  needItem: ViewerNeed;
}

function ViewerNeedItem({ needItem }: ViewerNeedItemProps) {
  return (
    <li className="text-sm flex items-start">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button
            className="text-left hover:text-primary transition-colors flex items-center group"
            aria-label={`View comments for ${needItem.need}`}
          >
            <span className="border-b border-dashed border-muted-foreground group-hover:border-primary">
              {needItem.need}
            </span>
            <MessageSquare className="h-3.5 w-3.5 ml-1.5 opacity-60 group-hover:opacity-100" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="top" align="start" className="w-80 p-4">
          <CommentsList comments={needItem.quotes} />
        </HoverCardContent>
      </HoverCard>
    </li>
  );
}

interface CommentsListProps {
  comments: string[];
}

function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium flex items-center">
        <MessageSquare className="h-3.5 w-3.5 mr-1" />
        Comments supporting this need
      </h5>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((comment, j) => (
          <div key={j} className="p-2 bg-muted rounded-md text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">NOT IMPLEMENTED YET</span>
              <span className="text-muted-foreground text-[10px] flex items-center">
                99999999999 likes
              </span>
            </div>
            <p className="italic">"{comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
} 