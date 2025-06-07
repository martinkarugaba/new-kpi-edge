"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationId } from "@/features/auth/actions";
import { getCurrentOrganizationWithCluster } from "@/features/organizations/actions/organizations";
import { type ParsedData } from "../types";
import { type ParticipantFormValues } from "../../participant-form";

export function useExcelImport(
  clusterId: string
  // projectId: string | null = null
) {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);

  const { data: organizationId } = useQuery({
    queryKey: ["organizationId"] as const,
    queryFn: getOrganizationId,
  });

  const { data: organization } = useQuery({
    queryKey: ["currentOrganization", organizationId] as const,
    queryFn: async () => {
      if (!organizationId) return null;
      const result = await getCurrentOrganizationWithCluster(organizationId);
      return result.success ? result.data : null;
    },
    enabled: !!organizationId,
  });

  const processSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    try {
      setIsLoading(true);
      const worksheet = wb.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
        string,
        unknown
      >[];

      const errors: string[] = [];
      const participants = jsonData.map((row, index) => {
        let firstName = "";
        let lastName = "";
        const nameStr = (row.Name || row.name) as string;
        if (nameStr) {
          const nameParts = nameStr.split(" ");
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(" ");
        }

        let sex = (row.Sex || row.sex || "").toString().toLowerCase();
        if (sex === "f" || sex === "female") {
          sex = "female";
        } else if (sex === "m" || sex === "male") {
          sex = "male";
        } else {
          sex = "other";
        }

        if (!organizationId) {
          errors.push(
            `Row ${index + 1}: No organization assigned to current user`
          );
          return null;
        }

        const data = {
          firstName: firstName || "Unknown",
          lastName: lastName || "",
          sex: sex as "male" | "female" | "other",
          age: String(parseInt(String(row.Age || row.age || "18"), 10) || "18"),
          contact: (
            row["Phone No."] ||
            row.Phone ||
            row.contact ||
            ""
          ).toString(),
          isPWD: (row.Disability || row["Disability?"] || "")
            .toString()
            .toLowerCase()
            .includes("yes")
            ? "yes"
            : "no",
          isMother: "no",
          isRefugee: "no",
          project_id: row.Project?.toString() || "",
          cluster_id: clusterId,
          organization_id: organizationId,
          country: "Uganda",
          // Instead of sending district/subCounty IDs directly, store the names
          // The district/subCounty IDs will be set by the DataPreview component
          district: (row.District || organization?.district || "").toString(),
          subCounty: (row.SubCounty || row["Sub County"] || "").toString(),
          parish: (row.Parish || "").toString(),
          village: (row.Village || "").toString(),
          designation: (row["Employment status"] || "Other").toString(),
          enterprise: (row["Skill of Interest"] || "Other").toString(),
          noOfTrainings: "0",
          isActive: "yes",
          isPermanentResident: (row["Permanent Resident"] || "")
            .toString()
            .toLowerCase()
            .includes("yes")
            ? "yes"
            : "no",
          areParentsAlive: (row["Both parents alive"] || "")
            .toString()
            .toLowerCase()
            .includes("yes")
            ? "yes"
            : "no",
          numberOfChildren: String(
            parseInt(String(row["No. of children"] || "0"), 10) || "0"
          ),
          employmentStatus: (row["Employment status"] || "unemployed")
            .toString()
            .toLowerCase(),
          monthlyIncome: String(
            parseInt(String(row["Monthly income (UGX)"] || "0"), 10) || "0"
          ),
          mainChallenge: (row["Main Challenge"] || "").toString(),
          skillOfInterest: (row["Skill of Interest"] || "").toString(),
          expectedImpact: (row["Expected Impact"] || "").toString(),
          isWillingToParticipate: (row["Willingness to Participate"] || "")
            .toString()
            .toLowerCase()
            .includes("yes")
            ? "yes"
            : "no",
        } as ParticipantFormValues;

        return data;
      });

      const validParticipants = participants.filter(
        (p): p is ParticipantFormValues => p !== null
      );
      setParsedData({
        data: validParticipants,
        errors,
        rawData: jsonData,
      });
    } catch (error) {
      console.error("Processing error:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to process sheet. Please check the format.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const loadingToastId = toast.loading("Reading Excel file...");
    try {
      setIsLoading(true);
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      setWorkbook(wb);

      if (wb.SheetNames.length === 1) {
        setAvailableSheets(wb.SheetNames);
        setSelectedSheet(wb.SheetNames[0]);
        processSheet(wb, wb.SheetNames[0]);
      } else {
        setAvailableSheets(wb.SheetNames);
        setSelectedSheet("");
        setParsedData(null);
      }
      toast.success("Excel file loaded successfully", { id: loadingToastId });
    } catch (error) {
      console.error("Import error:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to import participants. Please check your Excel file format.";
      toast.error(errorMsg, { id: loadingToastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetSelect = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      setIsLoading(true);
      // Small delay to ensure UI updates before processing begins
      setTimeout(() => {
        processSheet(workbook, sheetName);
      }, 100);
    }
  };

  const resetImport = () => {
    setParsedData(null);
    setSelectedSheet("");
    setAvailableSheets([]);
    setWorkbook(null);
  };

  return {
    isLoading,
    parsedData,
    availableSheets,
    selectedSheet,
    handleFileUpload,
    handleSheetSelect,
    resetImport,
  };
}
