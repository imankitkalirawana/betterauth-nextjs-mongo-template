'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  ChipProps,
  Chip,
  Selection,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Input,
  Pagination,
  Tooltip,
  Spinner,
  Avatar
} from '@heroui/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { CopyText } from '@/components/ui/copy';
import { Organization as OrganizationType } from 'better-auth/plugins';
import { useQuery } from '@tanstack/react-query';
import FormatTimeInTable from '@/components/ui/format-time-in-table';
import Skeleton from '@/components/ui/skeleton';
import { saveTableConfig, loadTableConfig } from '@/utils/local-storage';
import axios from 'axios';
import { toast } from 'sonner';
import { useDebounce } from 'react-haiku';
import { rowOptions } from '@/lib/config';

const tableKey = 'organizations';

const savedConfig = loadTableConfig(tableKey);

const INITIAL_VISIBLE_COLUMNS = savedConfig?.columns || [
  'logo',
  'slug',
  'name',
  'createdAt',
  'actions'
];

const INITIAL_SORT_DESCRIPTOR = savedConfig?.sortDescriptor || {
  column: 'date',
  direction: 'ascending'
};

const INITIAL_LIMIT = savedConfig?.limit || 10;

const getAllOrganizations = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
}): Promise<{
  organizations: OrganizationType[];
  total: number;
  totalPages: number;
}> => {
  const res = await axios.get(`/api/v1/organizations`, {
    params
  });
  console.log(res.data);
  return res.data;
};

const handleExport = async () => {
  try {
    const response = await fetch('/api/v1/organizations/export');
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `organizations-${new Date().toLocaleDateString()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error downloading the file:', error);
    toast.error('Error downloading the file');
  }
};

export default function Organizations() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const query = useDebounce(searchQuery, 500);

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(INITIAL_LIMIT);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>(
    INITIAL_SORT_DESCRIPTOR
  );

  const { data, isLoading } = useQuery({
    queryKey: ['organizations', query, limit, page, sortDescriptor],
    queryFn: () =>
      getAllOrganizations({
        limit,
        page,
        sortColumn: sortDescriptor.column as string,
        sortDirection: sortDescriptor.direction,
        query
      })
  });

  useEffect(() => {
    if (data) {
      setPages(data?.totalPages);
    }
  }, [data]);

  const [pages, setPages] = React.useState(1);

  const organizations: OrganizationType[] = data?.organizations || [];

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  useEffect(() => {
    saveTableConfig(tableKey, {
      columns: Array.from(visibleColumns),
      sortDescriptor,
      limit
    });
  }, [visibleColumns, sortDescriptor, limit]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback(
    (organization: OrganizationType, columnKey: React.Key) => {
      const cellValue = organization[columnKey as keyof OrganizationType];
      switch (columnKey) {
        case 'logo':
          return (
            <>
              <Avatar
                src={organization.logo || ''}
                className="h-10 w-10"
                name={organization.name}
              />
            </>
          );
        case 'slug':
          return (
            <>
              <CopyText>{organization.slug}</CopyText>
            </>
          );
        case 'name':
          return (
            <>
              <div className="flex items-center gap-2">
                <p className="text-bold whitespace-nowrap text-sm capitalize">
                  {organization.name}
                </p>
              </div>
            </>
          );
        case 'createdAt':
          return (
            <div className="space-y-1">
              {organization.createdAt && (
                <>
                  <FormatTimeInTable
                    date={organization.createdAt}
                    template="PP"
                  />
                  <FormatTimeInTable
                    date={organization.createdAt}
                    template="p"
                    className="text-xs text-default-400"
                    skeleton={<Skeleton className="h-4 w-20" />}
                  />
                </>
              )}
            </div>
          );
        case 'actions':
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <Icon icon="tabler:dots-vertical" fontSize={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key={'view'}
                  startContent={
                    <Icon icon="ic:round-view-in-ar" fontSize={20} />
                  }
                  as={Link}
                  href={`/dashboard/organizations/${organization.uid}`}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key={'edit'}
                  startContent={<Icon icon="tabler:edit" fontSize={20} />}
                  as={Link}
                  href={`/dashboard/organizations/${organization.uid}/edit`}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key={'delete'}
                  startContent={<Icon icon="tabler:trash" fontSize={20} />}
                  className="text-danger"
                  color="danger"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLimit(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="mt-12 flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-sm"
            placeholder="Search by name, slug, etc."
            startContent={<Icon icon="tabler:search" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:download'} />}
              onPress={handleExport}
            >
              Export
            </Button>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:plus'} />}
              as={Link}
              href="/dashboard/organizations/new"
            >
              New Organization
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data?.total} organizations
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
              value={limit}
            >
              {rowOptions.map((row) => (
                <option key={row.label} value={row.value}>
                  {row.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, [visibleColumns, onRowsPerPageChange, organizations.length, searchQuery]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          Showing {organizations.length} of {data?.total} organizations
        </span>
        <Pagination
          page={page}
          total={pages}
          onChange={setPage}
          isCompact
          showControls
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1 || page === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1 || page === pages}
            size="sm"
            variant="flat"
            onPress={() => setPage((prev) => (prev < 10 ? prev + 1 : prev))}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, organizations.length, page, pages]);

  return (
    <>
      <Table
        aria-label="Organizations"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]'
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => {
          console.log(key);
        }}
        className="cursor-pointer"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={organizations}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={'No organizations found'}
        >
          {(item) => (
            <TableRow
              key={item.slug}
              className="transition-all hover:bg-default-100"
            >
              {(columnKey) => (
                // @ts-ignore
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

const columns = [
  { name: 'LOGO', uid: 'logo', sortable: true },
  { name: 'SLUG', uid: 'slug', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'CREATED ON', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];
