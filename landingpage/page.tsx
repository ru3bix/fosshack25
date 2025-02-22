import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4a1c1c] via-[#cc3300] to-[#ff9900] relative overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-medium">
          ManimBooks
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/products" className="text-white/90 hover:text-white transition">
            Products
          </Link>
          <Link href="/developers" className="text-white/90 hover:text-white transition">
            Developers
          </Link>
          <Button asChild className="bg-white/90 hover:bg-white text-[#0a2540] rounded-full px-6" variant="secondary">
            <Link href="/signin">Sign in →</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 mt-24 flex items-center justify-between">
        <div className="max-w-2xl">
          <h1 className="text-white text-6xl font-medium leading-tight mb-8">Everything in a book but more.</h1>
          <Button asChild className="bg-[#11253e] hover:bg-[#0a2540] text-white rounded-full px-8 py-6 text-lg">
            <Link href="/start">Start now →</Link>
          </Button>
        </div>

        {/* Logo Card */}
        <div className="bg-[#1a1a1a] p-12 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
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

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New_Stripe_Website__Community_-QCoNbxvvs9vjhXovptONU2a7itI580.png')] opacity-20 pointer-events-none"></div>
    </div>
  )
}

