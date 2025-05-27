'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

interface AddCountryDialogProps {
  children: React.ReactNode;
}

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addCountry } from '@/features/locations/actions/countries';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(3, 'Code must be at most 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

export function AddCountryDialog({ children }: AddCountryDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
    },
  });

  async function onSubmit(values: FormData) {
    try {
      const result = await addCountry({
        name: values.name,
        code: values.code,
      });

      if (!result.success) {
        toast.error(result.error || 'Failed to add country');
        return;
      }

      toast.success('Country added successfully');
      form.reset();
      setOpen(false);
    } catch {
      toast.error('Failed to add country');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
          <DialogDescription>
            Add a new country to the system. This will allow you to add
            districts and other administrative units under it.
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
                    <Input placeholder="Enter country name" {...field} />
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
                    <Input
                      placeholder="Enter country code"
                      {...field}
                      maxLength={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Add Country</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
