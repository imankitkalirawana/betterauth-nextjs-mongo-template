'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createOrganization } from '@/lib/actions/server/organization';
import { useRouter } from 'next/navigation';
import { addToast, Button, Input } from '@heroui/react';

export default function NewOrganizationPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      logo: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Organization name is required'),
      logo: Yup.string().url('Logo must be a valid URL').optional()
    }),
    onSubmit: async (values) => {
      try {
        await createOrganization(values);
        addToast({
          title: 'Organization created successfully',
          color: 'success'
        });
        router.push('/dashboard/organizations');
      } catch (error: any) {
        addToast({
          title: error.message || 'Failed to create organization',
          color: 'danger'
        });
      }
    }
  });

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Organization</h1>
        <p className="text-muted-foreground">
          Add a new organization to your account
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Organization Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={
              formik.touched.name && formik.errors.name
                ? 'border-destructive'
                : ''
            }
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-destructive text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="logo"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Logo URL (optional)
          </label>
          <Input
            id="logo"
            name="logo"
            type="url"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.logo}
            className={
              formik.touched.logo && formik.errors.logo
                ? 'border-destructive'
                : ''
            }
          />
          {formik.touched.logo && formik.errors.logo && (
            <p className="text-destructive text-sm">{formik.errors.logo}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            isDisabled={!formik.isValid || formik.isSubmitting}
            isLoading={formik.isSubmitting}
          >
            Create Organization
          </Button>
          <Button
            type="button"
            variant="bordered"
            onPress={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
