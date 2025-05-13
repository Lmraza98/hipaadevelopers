"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checklistFormSchema, type ChecklistFormData } from '@/lib/schemas/checklist-form';

export function useChecklistForm() {
  const form = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return {
    form,
    isLoading: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
} 