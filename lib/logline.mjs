// Minimal LogLine helpers (iconic core): canonicalize, blake3 hash, ed25519 sign/verify
import { createHash } from 'blake3'
import * as ed from '@noble/ed25519'

export function canonicalize(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalize(obj[k])).join(',') + '}'
}

export function hashB3(payload){
  const canon = canonicalize(payload)
  return createHash().update(Buffer.from(canon)).digest('hex')
}

export async function signEd25519(payload, privHex){
  const canon = canonicalize(payload)
  const sig = await ed.sign(Buffer.from(canon), Buffer.from(privHex,'hex'))
  return Buffer.from(sig).toString('hex')
}

export async function verifyEd25519(payload, sigHex, pubHex){
  const canon = canonicalize(payload)
  return ed.verify(Buffer.from(sigHex,'hex'), Buffer.from(canon), Buffer.from(pubHex,'hex'))
}

export async function buildEntry({ type, id, payload, privHex, pubHex, extra={} }){
  const hash_b3 = hashB3(payload)
  const signature_ed25519 = await signEd25519(payload, privHex)
  return { type, id, payload, hash_b3, signature_ed25519, public_key: pubHex, ...extra }
}
