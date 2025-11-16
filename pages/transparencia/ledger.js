import { useEffect, useState } from 'react'

export default function LedgerViewer(){
  const [lines, setLines] = useState([])
  const [verifying, setVerifying] = useState(false)
  const [results, setResults] = useState({})

  useEffect(()=>{
    fetch('/ledger/sample.ndjson')
      .then(r=>r.text())
      .then(txt=>{
        const rows = txt.trim().split('\n').map((ln,i)=>({ raw: ln, idx: i }))
        setLines(rows)
      })
  }, [])

  async function runVerify(){
    setVerifying(true)
    try{
      const payloads = lines.map(l => {
        try{ return JSON.parse(l.raw) }catch(e){ return { parse_error: true, raw: l.raw } }
      })
      const res = await fetch('/api/verify', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ entries: payloads })
      })
      const data = await res.json()
      setResults(data.results || {})
    }finally{
      setVerifying(false)
    }
  }

  return (
    <div>
      <h1>Ledger Viewer</h1>
      <p>Carregando <code>public/ledger/sample.ndjson</code>. Clique em “Verificar” para validar hash BLAKE3 e assinatura Ed25519 (requer dependências instaladas no servidor).</p>
      <button className="button primary" onClick={runVerify} disabled={verifying}>{verifying ? 'Verificando…' : 'Verificar'}</button>
      <table className="table" style={{marginTop:12}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>ID</th>
            <th>Hash</th>
            <th>Assinatura</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i)=>{
            let obj = {}
            try{ obj = JSON.parse(l.raw) }catch(e){}
            const r = results[i]
            const status = r ? (r.ok ? 'Assinatura verificada' : r.reason || 'Falha') : 'Pendente'
            const badgeClass = r && r.ok ? 'badge verified' : 'badge'
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{obj.type || '-'}</td>
                <td>{obj.id || '-'}</td>
                <td style={{fontFamily:'monospace'}}>{(obj.hash_b3 || '').slice(0,10)}…</td>
                <td style={{fontFamily:'monospace'}}>{(obj.signature_ed25519 || '').slice(0,10)}…</td>
                <td><span className={badgeClass}>{status}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="card">
        <strong>Como funciona</strong>
        <ol>
          <li>Fazemos o canonicalize do objeto (ordem de chaves determinística).</li>
          <li>Calculamos o BLAKE3 da string canonicalizada.</li>
          <li>Verificamos a assinatura Ed25519 contra a chave pública declarada.</li>
        </ol>
        <p>Caso as libs não estejam instaladas, o endpoint retorna instruções.</p>
      </div>
    </div>
  )
}
