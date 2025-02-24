"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"


import Link from "next/link"
import DocumentationSlide from "./documentation-slide"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4a1c1c] via-[#cc3300] to-[#ff9900] relative overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-medium">
          <Image height={1024} width={1024} className="h-10 w-20" src="/logo.png" alt="logo" />
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/products" className="text-white/90 hover:text-white transition">
            Products
          </Link>
          <Link href="/developers" className="text-white/90 hover:text-white transition">
            Developers
          </Link>
          <Button asChild className="bg-white/90 hover:bg-white text-[#0a2540] rounded-full px-6" variant="secondary">
            <Link href="/ide?welcome=true">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 flex items-center relative justify-center h-screen w-full overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-4 opacity-10 z-0">
        {[...Array(72)].map((_, i) => (
          <div key={i} className="border border-gray-300"></div>
        ))}
      </div>

      {/* Existing Content */}
      <div className="max-w-2xl relative z-10">
        <h1 className="text-white text-6xl font-medium leading-tight mb-8">Everything in a book but <span className="animate-pulse">more.</span></h1>
        <Button asChild className="bg-[#11253e] hover:bg-[#0a2540] text-white rounded-full px-8 py-6 text-lg">
          <Link href="/ide?welcome=true">Get Started →</Link>
        </Button>
      </div>

      {/* Logo Card */}
      <div className="bg-[#1a1a1a] p-12 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6b6b] text-4xl">{"{"}</span>
            <div className="flex gap-1">
              <div className="w-4 h-16 bg-[#ffd700]"></div>
              <div className="w-4 h-16 bg-[#daa520]"></div>
              <div className="w-4 h-16 bg-[#ffd700]"></div>
            </div>
            <span className="text-[#ff6b6b] text-4xl">{"}"}</span>
          </div>
          <h2 className="text-white text-3xl font-medium">ManimBooks</h2>
          <p className="text-[#daa520]">e-book, redefined.</p>
        </div>
      </div>
    </main>



      <DocumentationSlide />
      
      
      
    </div>
  )
}