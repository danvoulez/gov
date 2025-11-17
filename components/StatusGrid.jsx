import { useEffect, useState } from 'react'

export default function StatusGrid({ indexSrc='/status/index.json' }){
  const [index, setIndex] = useState(null)
  const [err, setErr] = useState(null)
  useEffect(()=>{
    fetch(indexSrc).then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json() })
              .then(setIndex).catch(e => setErr(e.message))
  }, [indexSrc])
  return (
    <div className="card">
      <strong>Provas ao vivo — Ledger</strong>
      {!index && !err && <p>Carregando…</p>}
      {err && <p style={{color:'#f66'}}>Erro: {String(err)}</p>}
      {index && (
        <table>
          <thead><tr><th>Arquivo</th><th>Entradas OK</th><th>Falhas</th></tr></thead>
          <tbody>
            {index.files?.map(item => (
              <tr key={item.file}>
                <td><code>{item.file}</code></td>
                <td>{item.ok_count}</td>
                <td style={{color: item.fail_count ? '#f66' : 'var(--muted)'}}>{item.fail_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
