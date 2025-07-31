// app/wallet/import/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { useWallet } from "@/providers/wallet-provider"
import { useRouter } from "next/navigation"
import type { BlockchainType } from "@/types"

function ImportWalletContent() {
  const searchParams = useSearchParams()
  const blockchain = searchParams.get("blockchain") as BlockchainType | null
  const router = useRouter()
  const { 
    importWalletFromMnemonic, 
    setCurrentBlockchain, 
    currentBlockchain 
  } = useWallet()

  const [importMnemonic, setImportMnemonic] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (blockchain && (blockchain === 'solana' || blockchain === 'ethereum')) {
      setCurrentBlockchain(blockchain)
    }
  }, [blockchain, setCurrentBlockchain])

  const handleImport = async () => {
    if (!importMnemonic.trim()) {
      setError('Please enter your recovery phrase')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await importWalletFromMnemonic(importMnemonic.trim())
      if (success) {
        router.push(`/wallet/dashboard?blockchain=${currentBlockchain}`)
      } else {
        setError('Invalid recovery phrase. Please check and try again.')
      }
    } catch (err) {
      setError('Failed to import wallet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/onboarding">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import {currentBlockchain?.charAt(0).toUpperCase()}{currentBlockchain?.slice(1)} Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Recovery Phrase
                </label>
                <textarea
                  className="w-full p-4 border rounded-lg min-h-[120px] font-mono text-sm"
                  placeholder="Enter your 12-word recovery phrase separated by spaces"
                  value={importMnemonic}
                  onChange={(e) => setImportMnemonic(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Importing Tips</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Ensure words are separated by spaces</li>
                <li>• Double-check spelling of each word</li>
                <li>• Recovery phrases are case-insensitive</li>
              </ul>
            </div>

            <Button
              onClick={handleImport}
              disabled={!importMnemonic.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Importing...' : 'Import Wallet'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ImportWalletPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImportWalletContent />
    </Suspense>
  )
}