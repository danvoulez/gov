import { useEffect, useState } from 'react'

export default function Roadmap({ src='/data/roadmap.json' }){
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  useEffect(()=>{ fetch(src).then(r=>r.json()).then(setData).catch(e=>setErr(e.message)) }, [src])
  if(err) return <div className="card"><strong>Roadmap</strong><p style={{color:'#f66'}}>Erro: {String(err)}</p></div>
  if(!data) return <div className="card"><strong>Roadmap</strong><p>Carregando…</p></div>
  return (
    <div className="card">
      <strong>Roadmap T0 → T2</strong>
      {data.phases?.map(p => (
        <div key={p.id} style={{marginBottom:16}}>
          <h3 style={{marginBottom:6}}>{p.title} <small style={{color:'var(--muted)'}}>({p.start} → {p.end})</small></h3>
          <ul>
            {p.tasks?.map(t => (
              <li key={t.id}>
                <input type="checkbox" checked={!!t.done} readOnly style={{marginRight:8}}/>
                <code>{t.id}</code> — {t.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
