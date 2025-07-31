// app/wallet/create/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useWallet } from "@/providers/wallet-provider"
import { useRouter } from "next/navigation"
import { generateWalletFromMnemonic } from "@/lib/crypto"
import type { BlockchainType } from "@/types"

function CreateWalletContent() {
  const searchParams = useSearchParams()
  const blockchain = searchParams.get("blockchain") as BlockchainType | null
  const router = useRouter()
  const { 
    generateNewWallet, 
    mnemonic, 
    setCurrentBlockchain, 
    currentBlockchain,
    wallets,
    setMnemonic 
  } = useWallet()

  const [step, setStep] = useState<'generate' | 'reveal' | 'confirm' | 'complete'>('generate')
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [confirmWords, setConfirmWords] = useState<string[]>([])
  const [selectedConfirmWords, setSelectedConfirmWords] = useState<number[]>([])

  useEffect(() => {
    if (blockchain && (blockchain === 'solana' || blockchain === 'ethereum')) {
      setCurrentBlockchain(blockchain)
    }
  }, [blockchain, setCurrentBlockchain])

  const handleGenerate = () => {
    const newMnemonic = generateNewWallet()
    setStep('reveal')
    // Generate first wallet automatically
    if (currentBlockchain) {
      const firstWallet = generateWalletFromMnemonic(newMnemonic, currentBlockchain, 0)
      // This would normally be handled by the context, but for demo we'll proceed
    }
  }

  const handleCopyMnemonic = async () => {
    if (mnemonic) {
      await navigator.clipboard.writeText(mnemonic)
    }
  }

  const handleContinueToConfirm = () => {
    if (mnemonic) {
      const words = mnemonic.split(' ')
      // Pick 3 random words to confirm (simplified for demo)
      const randomIndices = [2, 5, 8].sort((a, b) => a - b)
      setSelectedConfirmWords(randomIndices)
      setConfirmWords(new Array(randomIndices.length).fill(''))
      setStep('confirm')
    }
  }

  const handleConfirmComplete = () => {
    setStep('complete')
    // In a real app, you'd verify the words match
    setTimeout(() => {
      router.push(`/wallet/dashboard?blockchain=${currentBlockchain}`)
    }, 2000)
  }

  if (step === 'generate') {
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
              <CardTitle>Create New {currentBlockchain?.charAt(0).toUpperCase()}{currentBlockchain?.slice(1)} Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-xl font-semibold">Generate Recovery Phrase</h3>
                <p className="text-muted-foreground">
                  Your recovery phrase is a 12-word phrase that is the &quot;master key&quot; to your wallet and funds.
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Important Security Notice</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Never share your recovery phrase with anyone</li>
                  <li>• Store it securely offline</li>
                  <li>• Anyone with this phrase can access your funds</li>
                </ul>
              </div>

              <Button onClick={handleGenerate} className="w-full" size="lg">
                Generate Recovery Phrase
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'reveal') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Recovery Phrase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Write down these 12 words in order:
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMnemonic(!showMnemonic)}
                  >
                    {showMnemonic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 relative">
                  {showMnemonic ? (
                    <div className="grid grid-cols-3 gap-4">
                      {mnemonic?.split(' ').map((word, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                          <span className="font-mono">{word}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Click the eye icon to reveal your recovery phrase</p>
                    </div>
                  )}
                </div>

                {showMnemonic && (
                  <Button
                    variant="outline"
                    onClick={handleCopyMnemonic}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('generate')}
                  className="flex-1"
                >
                  Generate New
                </Button>
                <Button
                  onClick={handleContinueToConfirm}
                  disabled={!showMnemonic}
                  className="flex-1"
                >
                  I&apos;ve Saved It
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Recovery Phrase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Please enter the following words from your recovery phrase:
              </p>

              <div className="space-y-4">
                {selectedConfirmWords.map((wordIndex, confirmIndex) => (
                  <div key={confirmIndex} className="space-y-2">
                    <label className="text-sm font-medium">
                      Word #{wordIndex + 1}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder={`Enter word #${wordIndex + 1}`}
                      value={confirmWords[confirmIndex] || ''}
                      onChange={(e) => {
                        const newConfirmWords = [...confirmWords]
                        newConfirmWords[confirmIndex] = e.target.value
                        setConfirmWords(newConfirmWords)
                      }}
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handleConfirmComplete}
                disabled={confirmWords.some(word => !word.trim())}
                className="w-full"
              >
                Confirm & Create Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-16">
              <div className="text-center space-y-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Wallet Created Successfully!</h2>
                <p className="text-muted-foreground">
                  Your {currentBlockchain} wallet has been created. Redirecting to dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}

export default function CreateWalletPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateWalletContent />
    </Suspense>
  )
}