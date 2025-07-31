// providers/wallet-provider.tsx
"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { 
  generateNewMnemonic, 
  validateMnemonicPhrase, 
  generateWalletFromMnemonic,
  discoverWalletsFromMnemonic 
} from '@/lib/crypto'
import type { WalletContextType, Wallet, BlockchainType } from '@/types'

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mnemonic, setMnemonicState] = useState<string | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [currentBlockchain, setCurrentBlockchain] = useState<BlockchainType | null>(null)

  const setMnemonic = useCallback((newMnemonic: string) => {
    setMnemonicState(newMnemonic)
  }, [])

  const generateNewWallet = useCallback((): string => {
    const newMnemonic = generateNewMnemonic()
    setMnemonicState(newMnemonic)
    return newMnemonic
  }, [])

  const importWalletFromMnemonic = useCallback(async (importMnemonic: string): Promise<boolean> => {
    if (!validateMnemonicPhrase(importMnemonic)) {
      return false
    }

    if (!currentBlockchain) {
      return false
    }

    try {
      setMnemonicState(importMnemonic)
      const discoveredWallets = discoverWalletsFromMnemonic(importMnemonic, currentBlockchain)
      setWallets(discoveredWallets)
      return true
    } catch (error) {
      console.error('Error importing wallet:', error)
      return false
    }
  }, [currentBlockchain])

  const addWalletToSeed = useCallback(() => {
    if (!mnemonic || !currentBlockchain) return

    const nextIndex = wallets.filter(w => w.blockchain === currentBlockchain).length
    const newWallet = generateWalletFromMnemonic(mnemonic, currentBlockchain, nextIndex)
    setWallets(prev => [...prev, newWallet])
  }, [mnemonic, currentBlockchain, wallets])

  const clearWallets = useCallback(() => {
    setMnemonicState(null)
    setWallets([])
    setCurrentBlockchain(null)
  }, [])

  const value: WalletContextType = {
    mnemonic,
    wallets,
    currentBlockchain,
    setMnemonic,
    setCurrentBlockchain,
    generateNewWallet,
    importWalletFromMnemonic,
    addWalletToSeed,
    clearWallets
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}