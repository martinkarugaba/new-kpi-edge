'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { downloadTemplate } from '../../lib/excel-utils';

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isLoading: boolean;
}

export function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileUpload}
        disabled={isLoading}
        className="max-w-[300px]"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={downloadTemplate}
        title="Download template"
      >
        <Download className="h-4 w-4" />
      </Button>
      {isLoading && (
        <span className="text-sm text-muted-foreground">Processing...</span>
      )}
    </div>
  );
}
