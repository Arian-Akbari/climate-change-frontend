import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Climate Data Visualization Platform',
  description: 'Interactive climate and environmental data visualization with mapping interface',
};

export default function ClimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

