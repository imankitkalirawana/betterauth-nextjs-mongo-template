'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles
} from 'lucide-react';

import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  DropdownTrigger
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export function NavUser({
  user
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown placement="left">
          <DropdownTrigger>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                className="h-8 w-8 rounded-lg"
                src={user.avatar}
                name={user.name}
                showFallback
                fallback={user.name.charAt(0)}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownSection
              showDivider
              classNames={{
                divider: 'border-red-500'
              }}
              className="p-0 font-normal"
            >
              <DropdownItem
                key="user"
                className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                startContent={
                  <Avatar
                    className="h-8 w-8 rounded-lg"
                    src={user.avatar}
                    name={user.name}
                    showFallback
                    fallback={user.name.charAt(0)}
                  />
                }
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </DropdownItem>
            </DropdownSection>

            <DropdownSection showDivider>
              <DropdownItem
                key="upgrade"
                startContent={
                  <Icon icon="solar:stars-minimalistic-outline" width={20} />
                }
              >
                Upgrade to Pro
              </DropdownItem>
              <DropdownItem
                key="account"
                startContent={
                  <Icon icon="solar:user-circle-linear" width={20} />
                }
              >
                Account
              </DropdownItem>
              <DropdownItem
                key="billing"
                startContent={<Icon icon="solar:card-linear" width={20} />}
              >
                Billing
              </DropdownItem>
              <DropdownItem
                key="notifications"
                startContent={
                  <Icon icon="solar:notification-unread-linear" width={20} />
                }
              >
                Notifications
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem
                key="logout"
                startContent={<Icon icon="solar:logout-linear" width={20} />}
              >
                Log out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
