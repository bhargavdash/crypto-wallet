// app/onboarding/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useWallet } from "@/providers/wallet-provider"
import type { BlockchainType } from "@/types"

function OnboardingContent() {
  const searchParams = useSearchParams()
  const blockchain = searchParams.get("blockchain") as BlockchainType | null
  const { setCurrentBlockchain } = useWallet()

  useEffect(() => {
    if (blockchain && (blockchain === 'solana' || blockchain === 'ethereum')) {
      setCurrentBlockchain(blockchain)
    }
  }, [blockchain, setCurrentBlockchain])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome to Your {blockchain ? blockchain.charAt(0).toUpperCase() + blockchain.slice(1) : "Multi-Chain"} Wallet
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you want to set up your wallet
          </p>
        </div>

        <div className="grid gap-6">
          <Link href={`/wallet/create${blockchain ? `?blockchain=${blockchain}` : ""}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-xl">Create New Wallet</CardTitle>
                <CardDescription>
                  Generate a new wallet with a secure recovery phrase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Recommended for new users
                  </span>
                  <Button variant="outline">Create</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/wallet/import${blockchain ? `?blockchain=${blockchain}` : ""}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-xl">Import Existing Wallet</CardTitle>
                <CardDescription>
                  Restore your wallet using your recovery phrase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    For existing wallet users
                  </span>
                  <Button variant="outline">Import</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Security Notice</h3>
          <p className="text-sm text-muted-foreground">
            Your recovery phrase is the master key to your wallet. Keep it safe and never share it with anyone. 
            We recommend writing it down and storing it in a secure location.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}