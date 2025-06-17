
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`transition-all duration-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm md:text-base">{title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 h-auto"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <div className={`transition-all duration-200 overflow-hidden ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <CardContent className={isExpanded ? 'pt-0' : 'pt-0 pb-0'}>
          {children}
        </CardContent>
      </div>
    </Card>
  );
};
