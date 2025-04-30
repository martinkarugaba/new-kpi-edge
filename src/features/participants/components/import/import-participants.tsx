"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { type ParticipantFormValues } from "../participant-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "./file-upload";
import { SheetSelector } from "./sheet-selector";
import { ValidationErrors } from "./validation-errors";
import { DataPreview } from "./data-preview";
import { useExcelImport } from "./hooks/use-excel-import";

interface ImportParticipantsProps {
  onImport: (data: ParticipantFormValues[]) => Promise<void>;
  clusterId: string;
  projects: { id: string; name: string }[];
}

export function ImportParticipants({
  onImport,
  clusterId,
  projects,
}: ImportParticipantsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [subCounties, setSubCounties] = useState<string[]>([]);

  const {
    isLoading,
    parsedData,
    availableSheets,
    selectedSheet,
    handleFileUpload,
    handleSheetSelect,
    resetImport,
  } = useExcelImport(clusterId);

  // Extract districts and subcounties from parsed data when available
  useEffect(() => {
    if (parsedData?.data) {
      // Extract unique districts and subcounties
      const uniqueDistricts = [
        ...new Set(parsedData.data.map((p) => p.district)),
      ].filter(Boolean);
      setDistricts(uniqueDistricts);

      // Reset selected district if it's no longer available
      if (selectedDistrict && !uniqueDistricts.includes(selectedDistrict)) {
        setSelectedDistrict("");
      }
    }
  }, [parsedData, selectedDistrict]);

  // Update subcounties when district is selected
  useEffect(() => {
    if (parsedData?.data && selectedDistrict) {
      const uniqueSubCounties = [
        ...new Set(
          parsedData.data
            .filter((p) => p.district === selectedDistrict)
            .map((p) => p.subCounty),
        ),
      ].filter(Boolean);
      setSubCounties(uniqueSubCounties);

      // Reset selected subcounty if it's no longer available
      if (selectedSubCounty && !uniqueSubCounties.includes(selectedSubCounty)) {
        setSelectedSubCounty("");
      }
    }
  }, [parsedData, selectedDistrict, selectedSubCounty]);

  const handleImport = async () => {
    if (!parsedData?.data || parsedData.data.length === 0) {
      toast.error("No data to import");
      return;
    }

    const toastId = toast.loading(
      `Importing ${parsedData.data.length} participants...`,
    );
    try {
      await onImport(parsedData.data);
      toast.success(
        `Successfully imported ${parsedData.data.length} participants`,
        {
          id: toastId,
        },
      );
      setIsOpen(false);
      resetImport();
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error instanceof Error
          ? `Import failed: ${error.message}`
          : "Failed to import participants",
        { id: toastId },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-[90vw] lg:max-w-[900px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Participants</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing participant data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 min-w-0">
          <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

          <SheetSelector
            sheets={availableSheets}
            selectedSheet={selectedSheet}
            onSheetSelect={handleSheetSelect}
            isLoading={isLoading}
          />

          {parsedData && (
            <div className="space-y-6 w-full">
              <ValidationErrors errors={parsedData.errors} />
              <DataPreview
                data={parsedData.data}
                projects={projects || []}
                selectedProject={selectedProject}
                selectedDistrict={selectedDistrict}
                selectedSubCounty={selectedSubCounty}
                onProjectSelect={setSelectedProject}
                onDistrictSelect={setSelectedDistrict}
                onSubCountySelect={setSelectedSubCounty}
                districts={districts}
                subCounties={subCounties}
              />

              {parsedData.errors.length === 0 && (
                <Button
                  className="cursor-pointer w-full"
                  onClick={handleImport}
                  disabled={isLoading}
                >
                  {isLoading ? "Importing..." : "Confirm Import"}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
