// types/index.ts
export type BlockchainType = 'solana' | 'ethereum'

export interface Wallet {
  id: string
  name: string
  publicKey: string
  privateKey: string
  blockchain: BlockchainType
  derivationPath: string
  index: number
}

export interface WalletContextType {
  mnemonic: string | null
  wallets: Wallet[]
  currentBlockchain: BlockchainType | null
  setMnemonic: (mnemonic: string) => void
  setCurrentBlockchain: (blockchain: BlockchainType) => void
  generateNewWallet: () => string
  importWalletFromMnemonic: (mnemonic: string) => Promise<boolean>
  addWalletToSeed: () => void
  clearWallets: () => void
}