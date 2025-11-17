import { useEffect, useState } from 'react'

export default function ProofBox({ src='/files/constituicao-curta.hash.json', title='Caixa de Prova' }){
  const [proof, setProof] = useState(null)
  const [err, setErr] = useState(null)
  useEffect(()=>{
    fetch(src).then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json() })
              .then(setProof).catch(e => setErr(e.message))
  }, [src])
  return (
    <div className="card">
      <strong>{title}</strong>
      {!proof && !err && <p>Carregando prova…</p>}
      {err && <p style={{color:'#f66'}}>Erro ao carregar: {String(err)}</p>}
      {proof && (
        <ul>
          <li><strong>Arquivo:</strong> <code>{proof.file}</code></li>
          <li><strong>Hash:</strong> <code>{proof.hash_algo}:{' '}{proof.hash_hex}</code></li>
          <li><strong>Gerado em:</strong> {proof.computed_at}</li>
        </ul>
      )}
    </div>
  )
}
