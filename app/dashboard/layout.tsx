"use client";

import Menu from "@/app/components/dashboard/Menu";
import { useContextAuth } from '@/database/contexts/AuthContext';
import { useEffect } from "react";
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
      <Menu />
      <div className="w-full h-full px-8 py-6">
        {children}
      </div>
    </section>
  );
}
