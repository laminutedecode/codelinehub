"use client";

import DashboardMenu from "@/app/components/dashboard/DashboardMenu";
import { useContextAuth } from '@/contexts/AuthContext';
import Loader from "../components/Loader";

export default function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  
  const { isFetch } = useContextAuth();



  if (isFetch) {
    return <Loader />;
  }

  return (
    <section className="md:flex items-stretch gap-4 min-h-screen w-full">
      <DashboardMenu />
      <div className="w-full h-full px-8 py-6">
        {children}
      </div>
    </section>
  );
}
