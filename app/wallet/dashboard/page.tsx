// app/wallet/dashboard/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Wallet as WalletIcon,
  LogOut
} from "lucide-react"
import { useWallet } from "@/providers/wallet-provider"
import { useRouter } from "next/navigation"
import type { BlockchainType } from "@/types"

function WalletDashboardContent() {
  const searchParams = useSearchParams()
  const blockchain = searchParams.get("blockchain") as BlockchainType | null
  const router = useRouter()
  const { 
    wallets, 
    mnemonic,
    currentBlockchain,
    addWalletToSeed,
    clearWallets,
    setCurrentBlockchain 
  } = useWallet()

  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (blockchain && (blockchain === 'solana' || blockchain === 'ethereum')) {
      setCurrentBlockchain(blockchain)
    }
  }, [blockchain, setCurrentBlockchain])

  const currentBlockchainWallets = wallets.filter(w => w.blockchain === currentBlockchain)

  const togglePrivateKeyVisibility = (walletId: string) => {
    const newVisible = new Set(visiblePrivateKeys)
    if (newVisible.has(walletId)) {
      newVisible.delete(walletId)
    } else {
      newVisible.add(walletId)
    }
    setVisiblePrivateKeys(newVisible)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const handleAddWallet = () => {
    addWalletToSeed()
  }

  const handleLogout = () => {
    clearWallets()
    router.push('/')
  }

  if (!mnemonic) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="py-16">
              <WalletIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Wallet Found</h2>
              <p className="text-muted-foreground mb-4">
                Please create or import a wallet to get started.
              </p>
              <Link href="/onboarding">
                <Button>Get Started</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">
                {currentBlockchain?.charAt(0).toUpperCase()}{currentBlockchain?.slice(1)} Wallets
              </h1>
              <p className="text-muted-foreground">
                {currentBlockchainWallets.length} wallet{currentBlockchainWallets.length !== 1 ? 's' : ''} generated
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddWallet} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Wallet
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentBlockchainWallets.map((wallet) => (
            <Card key={wallet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <WalletIcon className="h-5 w-5 mr-2" />
                    {wallet.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    #{wallet.index + 1}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Public Key */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Public Key</label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-muted rounded text-xs font-mono break-all">
                      {wallet.publicKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.publicKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Private Key */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-red-600 dark:text-red-400">
                    Private Key (Keep Secret!)
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-muted rounded text-xs font-mono break-all">
                      {visiblePrivateKeys.has(wallet.id) 
                        ? wallet.privateKey 
                        : '•'.repeat(20) + '...'
                      }
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePrivateKeyVisibility(wallet.id)}
                    >
                      {visiblePrivateKeys.has(wallet.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    {visiblePrivateKeys.has(wallet.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.privateKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Derivation Path */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Derivation Path</label>
                  <code className="block p-2 bg-muted rounded text-xs font-mono">
                    {wallet.derivationPath}
                  </code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {currentBlockchainWallets.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <WalletIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Wallets Yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first {currentBlockchain} wallet to get started.
              </p>
              <Button onClick={handleAddWallet}>
                <Plus className="h-4 w-4 mr-2" />
                Generate First Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="mt-8 border-yellow-200 dark:border-yellow-800">
          <CardContent className="py-4">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-600 dark:text-yellow-400">⚠️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Security Reminder
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Never share your private keys or recovery phrase with anyone. Store them securely offline. 
                  This demo wallet is for educational purposes only - do not use with real funds.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function WalletDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WalletDashboardContent />
    </Suspense>
  )
}