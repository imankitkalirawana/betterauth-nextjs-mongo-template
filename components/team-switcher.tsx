'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  DropdownSection
} from '@heroui/react';

export function TeamSwitcher({
  organizations
}: {
  organizations: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(organizations[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown placement="left">
          <DropdownTrigger>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSection title="Organizations" items={organizations}>
              {(organization) => (
                <DropdownItem
                  key={organization.name}
                  onPress={() => setActiveTeam(organization)}
                  startContent={
                    <div className="flex size-6 items-center justify-center rounded-sm">
                      <organization.logo className="size-4 shrink-0" />
                    </div>
                  }
                >
                  {organization.name}
                </DropdownItem>
              )}
            </DropdownSection>
            <DropdownSection title="Actions">
              <DropdownItem
                key="add-organization"
                startContent={<Plus className="size-4" />}
              >
                Add Organization
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
