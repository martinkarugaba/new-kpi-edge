"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClusterForm } from "./cluster-form";
import { Plus } from "lucide-react";

export function CreateClusterDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Cluster
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Cluster</DialogTitle>
          <DialogDescription>
            Add a new cluster to your organization
          </DialogDescription>
        </DialogHeader>
        <ClusterForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
