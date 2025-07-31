
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
export default function Home() {

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Backpack supports multiple blockchains
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a blockchain to get started with your secure wallet experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link href="/onboarding?blockchain=solana">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Solana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fast and low-cost transactions with high throughput
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/onboarding?blockchain=ethereum">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">E</span>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Ethereum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  The most popular smart contract platform
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}