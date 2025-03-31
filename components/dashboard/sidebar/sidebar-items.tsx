import { type SidebarItem } from './';

export const sectionItems: SidebarItem[] = [
  {
    key: 'overview',
    title: 'Overview',
    items: [
      {
        key: 'home',
        href: '/dashboard',
        icon: 'solar:home-2-bold-duotone',
        title: 'Home'
      },
      {
        key: 'organizations',
        href: '/dashboard/organizations',
        icon: 'solar:buildings-bold-duotone',
        title: 'Organizations'
      }
    ]
  }
];

export const sectionItemFooter: SidebarItem[] = [
  {
    key: 'help',
    href: '/dashboard/help',
    icon: 'solar:question-circle-bold-duotone',
    title: 'Help & Information'
  },
  {
    key: 'logout',
    href: '/dashboard/logout',
    icon: 'solar:logout-bold-duotone',
    title: 'Log Out'
  }
];
