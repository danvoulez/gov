export default function HeroManifesto(){
  return (
    <div className="card" style={{padding:'28px', display:'grid', gap: '12px'}}>
      <div className="badge">Manifesto</div>
      <h1 style={{margin:'4px 0'}}>Governança verificável, parceria humano–IA e uso pacífico</h1>
      <p style={{margin:'0 0 8px 0', color:'var(--muted)'}}>Contratos computáveis. Ritos auditáveis. Provas por padrão.</p>
      <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
        <a className="button primary" href="/manifesto">Ler Manifesto</a>
        <a className="button" href="/transparencia/ledger">Abrir Ledger Público</a>
        <a className="button" href="/engenharia/logline-101">Ver LogLine 101</a>
      </div>
    </div>
  )
}
