export default function ProofTag({ ok, text }){
  const cls = ok ? 'badge verified' : 'badge'
  return <span className={cls}>{text || (ok ? 'Assinatura verificada' : 'Pendente')}</span>
}
