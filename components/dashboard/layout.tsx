'use client';
import {
  sectionItemFooter,
  sectionItems
} from '@/components/dashboard/sidebar/sidebar-items';
import {
  cn,
  Spacer,
  ScrollShadow,
  Button,
  Breadcrumbs as NextUIBreadcrumbs,
  BreadcrumbItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../ui/logo';
import { useRouter } from 'nextjs-toploader/app';

export default function DashboardLayout({
  children
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const isHidden = localStorage.getItem('isHidden');
    setIsHidden(isHidden === 'true');
  }, []);

  const pathname = usePathname();
  let currentPath = pathname.split('/')?.[2];

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: segment, link: path };
  });

  const sidebar = useMemo(() => {
    return (
      <div
        className={cn(
          'relative flex h-full w-16 max-w-16 flex-1 flex-col !border-r-small border-divider transition-all duration-250 ease-in-out',
          {
            'w-72 max-w-[288px]': !isHidden
          }
        )}
      >
        <div className="flex flex-col gap-4 px-4 py-2">
          <Link href="/">
            <Logo />
          </Link>
          {/* <QuickButtons /> */}
        </div>

        <ScrollShadow className="h-full max-h-full pl-2">
          <Sidebar
            defaultSelectedKey="home"
            items={sectionItems}
            selectedKeys={[currentPath || 'dashboard']}
            isCompact={isHidden}
          />
        </ScrollShadow>
        <Spacer y={8} />
        <div className="flex flex-col px-2 pb-4">
          <Sidebar
            items={sectionItemFooter}
            defaultSelectedKey="home"
            isCompact={isHidden}
          />
        </div>
      </div>
    );
  }, [isHidden, currentPath]);

  const header = useMemo(() => {
    return (
      <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
        <Button
          aria-label="Toggle Sidebar"
          isIconOnly
          size="sm"
          variant="light"
          onPress={() =>
            setIsHidden((prev) => {
              localStorage.setItem('isHidden', !prev ? 'true' : 'false');
              return !prev;
            })
          }
        >
          <Icon
            className="text-default-500"
            height={24}
            icon="solar:sidebar-minimalistic-outline"
            width={24}
          />
        </Button>
        <NextUIBreadcrumbs variant="light">
          {breadcrumbItems?.map((item, index) => (
            <BreadcrumbItem key={index}>
              {index !== breadcrumbItems.length - 1 ? (
                <Link href={item.link} className="capitalize">
                  {item.label}
                </Link>
              ) : (
                <span className="capitalize">{item.label}</span>
              )}
            </BreadcrumbItem>
          ))}
        </NextUIBreadcrumbs>
      </header>
    );
  }, [breadcrumbItems, isHidden]);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {sidebar}
      <div className="w-[80vw] flex-1 flex-col md:p-4">
        {header}
        <main className="mt-4 h-full w-full overflow-visible">
          <div className="flex h-[85vh] flex-col gap-4 overflow-scroll rounded-medium border-small border-divider p-2 pb-12 pt-4 md:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
