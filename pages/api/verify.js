export const config = { runtime: 'nodejs' }

function canonicalize(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalize(obj[k])).join(',') + '}'
}

export default async function handler(req,res){
  if(req.method !== 'POST'){
    return res.status(405).json({error:'Use POST'})
  }
  const { entries } = req.body || {}
  if(!Array.isArray(entries)){
    return res.status(400).json({error:'entries[] required'})
  }

  // Lazy import to avoid bundling on client
  let blake3, ed25519
  try{
    blake3 = await import('blake3')
    ed25519 = await import('@noble/ed25519')
  }catch(e){
    return res.json({
      results: entries.map((_e,i)=>({ index:i, ok:false, reason:'Dependências ausentes. Rode: npm install blake3 @noble/ed25519' }))
    })
  }

  const results = []
  for(let i=0;i<entries.length;i++){
    const entry = entries[i]
    try{
      if(entry.parse_error){ results.push({index:i, ok:false, reason:'JSON inválido'}); continue }
      const { payload, hash_b3, signature_ed25519, public_key } = entry
      if(!payload || !hash_b3 || !signature_ed25519 || !public_key){
        results.push({index:i, ok:false, reason:'Campos obrigatórios ausentes'}); continue
      }
      const canon = canonicalize(payload)
      const digest = blake3.createHash().update(Buffer.from(canon)).digest('hex')
      const hashOk = (digest.toLowerCase() === String(hash_b3).toLowerCase() ? digest.toLowerCase() : digest.toLowerCase() === String(hash_b3).toLowerCase())
      const msg = Buffer.from(canon)
      const sig = Buffer.from(signature_ed25519, 'hex')
      const pub = Buffer.from(public_key, 'hex')
      const sigOk = await ed25519.verify(sig, msg, pub)
      if ((entry.type||'') === 'RIT' && (entry.subtype||'') === 'publicacao_bilingue'){
        const p = entry.payload || {}
        const langOk = Array.isArray(p.lang) && p.lang.includes('pt-PT-cplp') && p.lang.includes('en')
        const ptOk = p.pt && p.pt.hash_b3
        const enOk = p.en && p.en.hash_b3
        const crossOk = p.crosslink_proof && p.crosslink_proof.pt_points_to_en && p.crosslink_proof.en_points_to_pt
        if(!(langOk && ptOk && enOk && crossOk)){
          results.push({ index:i, ok:false, hashOk, sigOk, reason:'publicacao_bilingue inválido (lang/PT/EN/crosslink)' })
          continue
        }
      }

      if ((entry.type||'') === 'POL'){
        const langOk = Array.isArray(entry.lang) && entry.lang.includes('pt-PT-cplp') && entry.lang.includes('en')
        const peacefulOk = entry.usage_decl && entry.usage_decl.peaceful_only === true
        if(!langOk || !peacefulOk){
          results.push({ index:i, ok:false, hashOk, sigOk, reason: !langOk ? 'lang tags missing (pt-PT-cplp & en)' : 'usage_decl.peaceful_only must be true' })
          continue
        }
      }

      const mg = entry.machine_gate
      const gateOk = (mg === 'PASSED')
      if(['RIT','POL','DIR'].includes(entry.type || '')){
        if(!gateOk){
          results.push({ index:i, ok:false, hashOk, sigOk, reason:'machine_gate required (PASSED)' })
          continue
        }
      }

      results.push({ index:i, ok: hashOk && sigOk, hashOk, sigOk })
    }catch(e){
      results.push({ index:i, ok:false, reason: e?.message || 'erro' })
    }
  }

  res.json({ results })
}
