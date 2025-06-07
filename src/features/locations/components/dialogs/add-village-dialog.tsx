"use client";

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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addVillage } from "@/features/locations/actions/villages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  parishId: z.string().min(1, "Parish is required"),
  subCountyId: z.string().min(1, "Sub County is required"),
  countyId: z.string().min(1, "County is required"),
  districtId: z.string().min(1, "District is required"),
  countryId: z.string().min(1, "Country is required"),
});

interface AddVillageDialogProps {
  children: React.ReactNode;
}

export function AddVillageDialog({ children }: AddVillageDialogProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      parishId: "",
      subCountyId: "",
      countyId: "",
      districtId: "",
      countryId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addVillage(values);
      form.reset();
      toast.success("Village added successfully");
      router.refresh();
    } catch {
      toast.error("Failed to add village");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Village</DialogTitle>
          <DialogDescription>
            Add a new village to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter village name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter village code..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parishId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parish ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter parish ID..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subCountyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub County ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sub county ID..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter county ID..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter district ID..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country ID..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Village</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
