'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { OrganizationType } from '@/models/Organization';
import { Avatar, Button } from '@heroui/react';

export default function Organizations({
  organizations
}: {
  organizations: OrganizationType[];
}) {
  if (!organizations) {
    return null;
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your organizations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Logo</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization: OrganizationType) => (
            <TableRow key={organization.slug}>
              <TableCell className="font-medium">
                <Avatar src={organization.logo} name={organization.name} />
              </TableCell>
              <TableCell className="font-medium">{organization.name}</TableCell>
              <TableCell>{organization.slug}</TableCell>
              <TableCell>{organization.createdAt}</TableCell>
              <TableCell className="text-right">
                <Button>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
