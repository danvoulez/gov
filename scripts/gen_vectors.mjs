// Node.js script to generate LogLine test vectors (DS hashing, Ed25519, tie-break, merkle).
// Usage: `npm i blake3 @noble/ed25519` then `node scripts/gen_vectors.mjs`.
import { createHash } from 'blake3'
import * as ed from '@noble/ed25519'
import fs from 'node:fs'
import path from 'node:path'

const PACK_ROOT = path.resolve(process.cwd())
const VECTORS_IN = path.join(PACK_ROOT, 'vectors', 'test_vectors_input.json')
const VECTORS_OUT = path.join(PACK_ROOT, 'vectors', 'logline_test_vectors.ndjson')

function canonicalize(v){
  if(v === null) return 'null'
  const t = typeof v
  if(t === 'number'){
    if(!Number.isFinite(v)) throw new Error('non-finite number')
    return (Number.isInteger(v) ? String(v) : String(v))
  }
  if(t === 'boolean') return v ? 'true' : 'false'
  if(t === 'string') return JSON.stringify(v)
  if(Array.isArray(v)) return '[' + v.map(canonicalize).join(',') + ']'
  if(t === 'object'){
    const keys = Object.keys(v).sort((a,b) => Buffer.from(a).compare(Buffer.from(b)))
    return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalize(v[k])).join(',') + '}'
  }
  throw new Error('unsupported type')
}

const SEAL_HDR = 'LL/Seal/v1|algo=Ed25519|proto=LogLine/1.0|ct=application/json;profile=json-atomic'
function signableBytes(payload){
  const canon = canonicalize(payload)
  return Buffer.concat([Buffer.from(SEAL_HDR,'utf8'), Buffer.from([0x00]), Buffer.from(canon,'utf8')])
}
function b3hex(data){ const h = createHash(); h.update(data); return h.digest('hex') }

function tieDigest({canonicalInput, grammarId, ruleId, grammarSemVer}){
  const pre = Buffer.from('LL/Tie/v1','utf8')
  const parts = [pre, Buffer.from(canonicalInput,'utf8'), Buffer.from(String(grammarId),'utf8'), Buffer.from(String(ruleId),'utf8'), Buffer.from(String(grammarSemVer),'utf8')]
  const buf = Buffer.concat(parts)
  return b3hex(buf)
}
function orderTuple({priority,specificity,grammarSemVer,grammarIdHash,ruleId,H}){
  function pad10(n){ return String(n).padStart(10,'0') }
  return [pad10(priority), pad10(specificity), String(grammarSemVer), String(grammarIdHash), String(ruleId), String(H)]
}
function merkleRootHex(leavesHex){
  if(leavesHex.length===0) return b3hex(Buffer.alloc(0))
  let layer = leavesHex.map(h => Buffer.from(h,'hex'))
  while(layer.length>1){
    const next=[]
    for(let i=0;i<layer.length;i+=2){
      if(i+1<layer.length) next.push(Buffer.from(b3hex(Buffer.concat([layer[i],layer[i+1]])),'hex'))
      else next.push(layer[i])
    }
    layer=next
  }
  return layer[0].toString('hex')
}

// Deterministic test key (DO NOT USE IN PRODUCTION)
const TEST_PRIV_HEX = '3c9a1f8a30f2b5c0b8f3af4a2b8a0a2087a1d7d2b7e2d9e5f1a0b2c4d6e8f001'
const TEST_PUB_HEX = Buffer.from(await ed.getPublicKey(Buffer.from(TEST_PRIV_HEX,'hex'))).toString('hex')

const input = JSON.parse(fs.readFileSync(VECTORS_IN,'utf8'))
const out = fs.createWriteStream(VECTORS_OUT,{flags:'w'})

for(const item of input.dsVectors){
  const msg = signableBytes(item.payload)
  const hash_b3 = b3hex(msg)
  const sig = Buffer.from(await ed.sign(msg, Buffer.from(TEST_PRIV_HEX,'hex'))).toString('hex')
  out.write(JSON.stringify({ type:'seal', id:item.id, payload:item.payload, hash_b3, signature_ed25519:sig, signature_context:'LL/Seal/v1', public_key:TEST_PUB_HEX })+'\n')
}
for(const tb of input.tieBreakVectors){
  const canonicalInput = canonicalize(tb.canonicalInput)
  const rows = tb.candidates.map(c => {
    const H = tieDigest({canonicalInput, grammarId:c.grammarId, ruleId:c.ruleId, grammarSemVer:c.grammarSemVer})
    const tuple = orderTuple({priority:c.priority, specificity:c.specificity, grammarSemVer:c.grammarSemVer, grammarIdHash:c.grammarIdHash, ruleId:c.ruleId, H})
    return { ...c, H, orderTuple: tuple }
  }).sort((a,b)=>{
    for(let i=0;i<a.orderTuple.length;i++){
      const d = Buffer.from(a.orderTuple[i]).compare(Buffer.from(b.orderTuple[i]))
      if(d!==0) return d
    }
    return 0
  })
  out.write(JSON.stringify({ type:'tie-break', id:tb.id, canonicalInput, ordered:rows })+'\n')
}
for(const m of input.merkleVectors){
  const merkleRoot = merkleRootHex(m.leavesHex)
  out.write(JSON.stringify({ type:'merkle', id:m.id, leavesHex:m.leavesHex, merkleRoot })+'\n')
}
out.end()
console.log('Wrote', VECTORS_OUT)