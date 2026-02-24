"use client";
import FloralCorner from "@/components/FloralCorner";
import { Button } from "@/components/ui/button";
import { UserCheck, Shield, QrCode, Loader2 } from "lucide-react";
// import { useEvent } from "@/hooks/useGuests";
import Link from "next/link";
import AccessCard from "@/components/AccessCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";

const Index = () => {
  // const { data: event, isLoading } = useEvent();

  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth();
  console.log({ user })

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('events')
        .select('*')

      if (error) console.log('Error:', error)
      else console.log(data)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <FloralCorner position="top-left" size="lg" className="opacity-30 -translate-x-4 -translate-y-4" />
      <FloralCorner position="top-right" size="lg" className="opacity-30 translate-x-4 -translate-y-4" />
      <FloralCorner position="bottom-left" size="lg" className="opacity-30 -translate-x-4 translate-y-4" />
      <FloralCorner position="bottom-right" size="lg" className="opacity-30 translate-x-4 translate-y-4" />

      <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-10">
          <p className="text-sm tracking-elegant uppercase text-[hsl(30_15%_50%)] mb-2">
            Event Access Management
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[hsl(30_25%_20%)] mb-3">
            {"Welcome"}
          </h1>
          {/* <p className="font-display text-xl sm:text-2xl text-gold-dark italic">
            {event?.name || "80th Birthday Celebration"}
          </p> */}
          {/* {event && ( */}
          <p className="text-sm text-[hsl(30_15%_50%)] mt-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })} • {"event.venue".split(",")[0]}
          </p>
          {/* )} */}
        </header>

        {/* Sample Access Card */}
        <div className="mb-12">
          <p className="text-center text-sm text-[hsl(30_15%_50%)] mb-4">
            Sample Access Card Preview
          </p>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            <AccessCard
              guestName="Sample Guest"
              guestCategory="VIP"
              qrCodeValue="https://example.com/guest/sample-token"
            />
          )}
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
          <Link href="/admin" className="group">
            <div className="p-6 rounded-lg border border-[hsl(40_35%_82%)] bg-card hover:border-gold hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(43_45%_88%)] flex items-center justify-center group-hover:bg-[hsl(35_45%_45%)]/20 transition-colors">
                <Shield className="w-6 h-6 text-[hsl(35_40%_35%)]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[hsl(30_25%_20%)] mb-1">
                Admin Dashboard
              </h3>
              <p className="text-xs text-[hsl(30_15%_50%)]">
                Manage guests & check-ins
              </p>
            </div>
          </Link>

          <Link href="/scanner" className="group">
            <div className="p-6 rounded-lg border border-[hsl(40_35%_82%)] bg-card hover:border-gold hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(43_45%_88%)] flex items-center justify-center group-hover:bg-[hsl(35_40%_35%)]/20 transition-colors">
                <QrCode className="w-6 h-6 text-[hsl(35_40%_35%)]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[hsl(30_25%_20%)] mb-1">
                Scanner
              </h3>
              <p className="text-xs text-[hsl(30_15%_50%)]">
                Scan guest QR codes
              </p>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="p-6 rounded-lg border border-[hsl(40_35%_82%)] bg-card hover:border-gold hover:shadow-lg transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(43_45%_88%)] flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <UserCheck className="w-6 h-6 text-[hsl(35_40%_35%)]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[hsl(30_25%_20%)] mb-1">
                Guest Cards
              </h3>
              <p className="text-xs text-[hsl(30_15%_50%)]">
                View guest access cards
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-[hsl(30_15%_50%)]">
            &copy; {new Date().getFullYear()} Event Access Management System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
