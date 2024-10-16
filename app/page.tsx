"use client"

import Link from "next/link";

export default function Home() {


  return (
    <section
    className="relative h-screen flex items-center justify-center bg-fixed bg-center bg-cover"
    style={{
      backgroundImage: `url('/img-login.jpg')`,
    }}
  >
    
    <div className="absolute inset-0 bg-black opacity-80"></div>
    <div className="relative text-center p-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
        CodeLine<span className="text-purple-500">Hub</span>
      </h1>
      <p className="text-lg md:text-2xl mb-8 text-white">
      Lancez-vous dans une aventure de développement sans limites.
      </p>
      <Link href="/signInAndSignUp" className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold animate-pulse">
        Commencer des maintenant
      </Link>
    </div>
  </section>
  );
}
