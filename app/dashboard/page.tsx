'use client';

import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { addToast, Button, Card, CardBody, CardHeader } from '@heroui/react';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const { data, isPending, error, refetch } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/auth/login');
  };

  console.log(data);

  const [sessions, setSessions] = useState<any>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const sessions = await authClient.listSessions();

      setSessions(sessions.data);
    };
    const fetchUsers = async () => {
      const updatedUser = await authClient.admin.setRole({
        userId: '67c800ab8806578388eb70ef',
        role: 'admin'
      });

      console.log(updatedUser);
    };
    data && fetchSessions();
    data && fetchUsers();
  }, [data]);

  const createOrganization = async () => {
    await authClient.organization
      .checkSlug({
        slug: 'devocode'
      })
      .then(async (res) => {
        if (res.data?.status) {
          const organization = await authClient.organization.create({
            name: 'Devocode',
            slug: 'devocode',
            logo: 'https://example.com/logo.png'
          });

          console.log(organization);
        } else {
          addToast({
            title: 'Slug already exists',
            description: 'Please choose another slug',
            color: 'danger'
          });
        }
      });
  };

  const tableData = [
    {
      title: 'Sessions',
      description: (
        <Card className="bg-transparent shadow-none">
          <CardBody>
            {sessions &&
              sessions?.map((session: any) => (
                <div className="flex items-center gap-2" key={session.userId}>
                  <p>{session.userId}</p>
                  <Button
                    color="danger"
                    radius="full"
                    variant="light"
                    size="sm"
                    isIconOnly
                    onPress={async () => {
                      await authClient.revokeSession({
                        token: session.token
                      });
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}
          </CardBody>
        </Card>
      ),
      actions: <Button color="primary">View</Button>
    },
    {
      title: 'Organizations',
      description: 'Organizations',
      actions: <Button color="primary">View</Button>
    },
    {
      title: 'Delete User',
      description: 'Delete User',
      actions: (
        <Button
          onPress={async () => {
            await authClient
              .deleteUser({
                callbackURL: '/auth/register' // you can provide a callback URL to redirect after deletion
              })
              .then((res) => {
                addToast({
                  title: 'Deleted',
                  color: 'success'
                });
              })
              .catch((err) => {
                addToast({
                  title: 'Error',
                  description: err.message,
                  color: 'danger'
                });
              });
          }}
          color="danger"
        >
          Delete
        </Button>
      )
    },
    {
      title: 'Logout',
      description: 'Logout',
      actions: (
        <Button onPress={handleLogout} color="danger">
          Logout
        </Button>
      )
    }
  ];

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
        <table className="w-full bg-default-200">
          <thead>
            <tr className="bg-default-100">
              <th className="px-2 py-1 text-left">Title</th>
              <th className="px-2 py-1 text-left">Description</th>
              <th className="px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.title}>
                <td className="px-2 py-1 text-left">{row.title}</td>
                <td className="px-2 py-1 text-left">{row.description}</td>
                <td className="px-2 py-1 text-left">{row.actions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
