'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { addParish } from '@/features/locations/actions/parishes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  subCountyId: z.string().min(1, 'Sub County is required'),
  districtId: z.string().min(1, 'District is required'),
  countyId: z.string().min(1, 'County is required'),
  countryId: z.string().min(1, 'Country is required'),
});

interface AddParishDialogProps {
  children: React.ReactNode;
}

export function AddParishDialog({ children }: AddParishDialogProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      subCountyId: '',
      districtId: '',
      countyId: '',
      countryId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addParish(values);
      form.reset();
      toast.success('Parish added successfully');
      router.refresh();
    } catch {
      toast.error('Failed to add parish');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Parish</DialogTitle>
          <DialogDescription>Add a new parish to the system.</DialogDescription>
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
                    <Input placeholder="Enter parish name..." {...field} />
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
                    <Input placeholder="Enter parish code..." {...field} />
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
              <Button type="submit">Add Parish</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
