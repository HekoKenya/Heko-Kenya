import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <main className="w-full max-w-xl px-6 py-12 flex flex-col items-center gap-8">
        <Image
          src="/logo.png"
          alt="Heko logo"
          width={300}
          height={300}
          priority
        />

        <div className="w-full flex flex-col items-center gap-2">
          <Link href="/hekoDashboard" className="w-full text-center font-geist uppercase px-6 py-3 rounded-sm bg-primary text-white font-medium transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40">
            heko dashboard
          </Link>
          <Link href="/lendersDashboard" className="w-full text-center font-geist uppercase px-6 py-3 rounded-sm bg-primary text-white font-medium transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40">
            lenders dashboard
          </Link>
          <Link href="/farmersDashboard" className="w-full text-center font-geist uppercase px-6 py-3 rounded-sm bg-primary text-white font-medium transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40">
            farmer dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
