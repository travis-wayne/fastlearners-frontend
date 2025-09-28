"use client";

import { useState } from 'react';
import { Check, ChevronDown, GraduationCap, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAcademicContext, useAcademicDisplay } from '@/components/providers/academic-context';
import { ClassLevel, Term } from '@/config/education';

interface AcademicSelectorProps {
  variant?: 'default' | 'compact' | 'card';
  showAcademicYear?: boolean;
  className?: string;
}

export function AcademicSelector({ 
  variant = 'default', 
  showAcademicYear = true,
  className = '' 
}: AcademicSelectorProps) {
  const [classOpen, setClassOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  
  const {
    currentClass,
    currentTerm,
    availableClasses,
    availableTerms,
    setCurrentClass,
    setCurrentTerm
  } = useAcademicContext();
  
  const { academicYear } = useAcademicDisplay();

  const handleClassSelect = (classLevel: ClassLevel) => {
    setCurrentClass(classLevel);
    setClassOpen(false);
  };

  const handleTermSelect = (term: Term) => {
    setCurrentTerm(term);
    setTermOpen(false);
  };

  // Group classes by stage
  const primaryClasses = availableClasses.filter(c => c.stage === 'primary');
  const jssClasses = availableClasses.filter(c => c.stage === 'jss');
  const sssClasses = availableClasses.filter(c => c.stage === 'sss');

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Select
          value={currentClass?.id || ''}
          onValueChange={(value) => {
            const classLevel = availableClasses.find(c => c.id === value);
            if (classLevel) handleClassSelect(classLevel);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {primaryClasses.length > 0 && (
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Primary
              </div>
            )}
            {primaryClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
            {jssClasses.length > 0 && (
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Junior Secondary
              </div>
            )}
            {jssClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
            {sssClasses.length > 0 && (
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Senior Secondary
              </div>
            )}
            {sssClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentTerm?.id || ''}
          onValueChange={(value) => {
            const term = availableTerms.find(t => t.id === value);
            if (term) handleTermSelect(term);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            {availableTerms.map((term) => (
              <SelectItem key={term.id} value={term.id}>
                {term.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showAcademicYear && (
          <Badge variant="outline" className="text-xs">
            {academicYear}
          </Badge>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Academic Context</div>
              <div className="text-xs text-muted-foreground">
                {currentClass?.name} • {currentTerm?.shortName} • {academicYear}
              </div>
            </div>
            <div className="flex gap-2">
              <AcademicSelector variant="compact" showAcademicYear={false} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <GraduationCap className="size-4 text-muted-foreground" />
        <Popover open={classOpen} onOpenChange={setClassOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={classOpen}
              className="w-[200px] justify-between"
            >
              {currentClass ? currentClass.name : "Select class..."}
              <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search class..." />
              <CommandEmpty>No class found.</CommandEmpty>
              
              {primaryClasses.length > 0 && (
                <CommandGroup heading="Primary Education">
                  {primaryClasses.map((cls) => (
                    <CommandItem
                      key={cls.id}
                      onSelect={() => handleClassSelect(cls)}
                    >
                      <Check
                        className={`mr-2 size-4 ${
                          currentClass?.id === cls.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{cls.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cls.description}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {jssClasses.length > 0 && (
                <CommandGroup heading="Junior Secondary">
                  {jssClasses.map((cls) => (
                    <CommandItem
                      key={cls.id}
                      onSelect={() => handleClassSelect(cls)}
                    >
                      <Check
                        className={`mr-2 size-4 ${
                          currentClass?.id === cls.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{cls.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cls.description}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {sssClasses.length > 0 && (
                <CommandGroup heading="Senior Secondary">
                  {sssClasses.map((cls) => (
                    <CommandItem
                      key={cls.id}
                      onSelect={() => handleClassSelect(cls)}
                    >
                      <Check
                        className={`mr-2 size-4 ${
                          currentClass?.id === cls.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{cls.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cls.description}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <Popover open={termOpen} onOpenChange={setTermOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={termOpen}
              className="w-[150px] justify-between"
            >
              {currentTerm ? currentTerm.shortName : "Select term..."}
              <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandEmpty>No term found.</CommandEmpty>
              <CommandGroup>
                {availableTerms.map((term) => (
                  <CommandItem
                    key={term.id}
                    onSelect={() => handleTermSelect(term)}
                  >
                    <Check
                      className={`mr-2 size-4 ${
                        currentTerm?.id === term.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{term.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {term.description}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {showAcademicYear && (
        <Badge variant="secondary" className="ml-2">
          {academicYear}
        </Badge>
      )}
    </div>
  );
}