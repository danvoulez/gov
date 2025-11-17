export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404 — Página Não Encontrada</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        A página que você procura não existe ou foi movida.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Páginas Principais:</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          <li><a href="/">← Página Inicial</a></li>
          <li><a href="/manifesto">Manifesto</a></li>
          <li><a href="/governanca">Governança</a></li>
          <li><a href="/padroes">Padrões</a></li>
          <li><a href="/transparencia">Transparência</a></li>
        </ul>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p><strong>Nota:</strong> Se você acredita que esta página deveria existir, por favor reporte via <a href="/contato">contato</a>.</p>
      </div>

      <style jsx>{`
        a {
          color: #0070f3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        li {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  )
}
