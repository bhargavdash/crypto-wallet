// lib/crypto.ts
import { mnemonicToSeedSync, generateMnemonic, validateMnemonic } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import { Keypair } from '@solana/web3.js'
import { HDNode } from '@ethersproject/hdnode'
import { Wallet as EthWallet } from '@ethersproject/wallet'
import type { BlockchainType, Wallet } from '@/types'

// Derivation paths
const DERIVATION_PATHS = {
  solana: "m/44'/501'/0'/0'",
  ethereum: "m/44'/60'/0'/0"
} as const

export function generateNewMnemonic(): string {
  return generateMnemonic(128) // 12 words
}

export function validateMnemonicPhrase(mnemonic: string): boolean {
  return validateMnemonic(mnemonic.trim())
}

export function generateWalletFromMnemonic(
  mnemonic: string,
  blockchain: BlockchainType,
  index: number = 0
): Wallet {
  const seed = mnemonicToSeedSync(mnemonic.trim())
  
  if (blockchain === 'solana') {
    return generateSolanaWallet(seed, index)
  } else {
    return generateEthereumWallet(seed, index)
  }
}

function generateSolanaWallet(seed: Buffer, index: number): Wallet {
  const derivationPath = `${DERIVATION_PATHS.solana}/${index}'`
  const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key
  const keypair = Keypair.fromSeed(derivedSeed)
  
  return {
    id: `solana-${index}-${Date.now()}`,
    name: `Solana Wallet ${index + 1}`,
    publicKey: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    blockchain: 'solana',
    derivationPath,
    index
  }
}

function generateEthereumWallet(seed: Buffer, index: number): Wallet {
  const derivationPath = `${DERIVATION_PATHS.ethereum}/${index}`
  const hdNode = HDNode.fromSeed(seed)
  const child = hdNode.derivePath(derivationPath)
  const wallet = new EthWallet(child.privateKey)
  
  return {
    id: `ethereum-${index}-${Date.now()}`,
    name: `Ethereum Wallet ${index + 1}`,
    publicKey: wallet.address,
    privateKey: child.privateKey,
    blockchain: 'ethereum',
    derivationPath,
    index
  }
}

export function discoverWalletsFromMnemonic(
  mnemonic: string,
  blockchain: BlockchainType,
  maxCheck: number = 10
): Wallet[] {
  // In a real app, you'd check blockchain for transaction history
  // For now, we'll just generate the first wallet
  const wallets: Wallet[] = []
  
  // Always generate at least the first wallet
  wallets.push(generateWalletFromMnemonic(mnemonic, blockchain, 0))
  
  // In production, you'd check each wallet for activity and stop when you find empty ones
  // For demo purposes, we'll just return the first wallet
  return wallets
}