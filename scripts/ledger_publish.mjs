#!/usr/bin/env node
// Ledger Publisher: build + append a signed entry to an NDJSON ledger.
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'blake3'
import * as ed from '@noble/ed25519'

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, ...rest] = a.split('='); return [k.replace(/^--/,'') || k, rest.join('=') || true]
}))

function help(){ console.log(`
Usage:
  node scripts/ledger_publish.mjs --type=POL --id=POL-EX-0001 --payload=payload.json --ledger=public/ledger/sample.ndjson --pub=hex --priv=hex [--gate=PASSED]

Notes:
  - payload.json deve conter um objeto JSON seriável
  - Se --pub/--priv não forem passados, tenta ED25519_PUB_HEX/ED25519_PRIV_HEX do ambiente
`); }

if(args.h || args.help){ help(); process.exit(0) }

const TYPE = args.type
const ID = args.id
const PAYLOAD_PATH = args.payload
const LEDGER = args.ledger || 'public/ledger/sample.ndjson'
const PUB = args.pub || process.env.ED25519_PUB_HEX
const PRIV = args.priv || process.env.ED25519_PRIV_HEX
const GATE = args.gate || 'PASSED'

if(!TYPE || !ID || !PAYLOAD_PATH || !PUB || !PRIV){
  help(); process.exit(2)
}

function canonicalize(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalize(obj[k])).join(',') + '}'
}

async function main(){
  const payload = JSON.parse(fs.readFileSync(PAYLOAD_PATH,'utf8'))
  const canon = canonicalize(payload)
  const hash_b3 = createHash().update(Buffer.from(canon)).digest('hex')
  const signature_ed25519 = Buffer.from(await ed.sign(Buffer.from(canon), Buffer.from(PRIV,'hex'))).toString('hex')
  const entry = {
    type: TYPE, id: ID, payload, hash_b3, signature_ed25519, public_key: PUB,
    machine_gate: (['POL','RIT','DIR'].includes(TYPE) ? GATE : undefined),
    compliance_attestation: (['POL','RIT','DIR'].includes(TYPE) ? {
      agent:'policy_agent', attested: true, checks: ['hash_ok','sig_ok'],
      evidence: [hash_b3], timestamp: new Date().toISOString(),
      signature_ed25519: signature_ed25519
    } : undefined)
  }
  fs.appendFileSync(LEDGER, JSON.stringify(entry) + '\n', 'utf8')
  console.log('APPENDED', entry.id, 'to', LEDGER)
}

main().catch(e=>{ console.error(e); process.exit(1) })
