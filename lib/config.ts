export const APP_INFO = {
  name: 'The Polyclinic',
  email: process.env.GMAIL || '',
  url: process.env.NEXTAUTH_URL || '',
  description: `The Polyclinic is a platform for creating and managing your sprint projects.`
};

export const rowOptions = [
  {
    label: '10',
    value: 10
  },
  {
    label: '50',
    value: 50
  },
  {
    label: '100',
    value: 100
  }
];
