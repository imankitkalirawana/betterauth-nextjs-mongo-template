import DashboardLayout from '@/components/dashboard/layout';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
