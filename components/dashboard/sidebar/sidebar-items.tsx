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

export const sectionItemsWithTeams: SidebarItem[] = [...sectionItems];
