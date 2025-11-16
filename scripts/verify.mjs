#!/usr/bin/env node
// Verify NDJSON with BLAKE3 + Ed25519
import fs from 'node:fs'
import { createHash } from 'blake3'
import * as ed from '@noble/ed25519'

function canonicalize(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalize(obj[k])).join(',') + '}'
}

const file = process.argv[2]
if(!file){ console.error('Usage: npm run verify <path-to-ndjson>'); process.exit(1) }
const src = fs.readFileSync(file, 'utf8').trim().split('\n')

let okAll = true
src.forEach((line, idx)=>{
  try{
    const obj = JSON.parse(line)
    const { payload, hash_b3, signature_ed25519, public_key } = obj
    const canon = canonicalize(payload)
    const digest = createHash().update(Buffer.from(canon)).digest('hex')
    const hashOk = digest.toLowerCase() === String(hash_b3).toLowerCase()
    const sigOk = ed.verify(Buffer.from(signature_ed25519,'hex'), Buffer.from(canon), Buffer.from(public_key,'hex'))
    const ok = hashOk && sigOk
    okAll = okAll && ok
    console.log(`#%d %s — hash:%s sig:%s`, idx+1, ok ? 'OK' : 'FAIL', hashOk ? 'OK' : 'FAIL', sigOk ? 'OK' : 'FAIL')
  }catch(e){
    okAll = false
    console.log(`#%d ERROR %s`, idx+1, e.message)
  }
})

process.exit(okAll ? 0 : 2)
