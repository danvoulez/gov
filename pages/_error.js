function Error({ statusCode }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>
        {statusCode
          ? `Erro ${statusCode}`
          : 'Erro no Cliente'}
      </h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        {statusCode === 500
          ? 'Ocorreu um erro no servidor. Nossa equipe foi notificada.'
          : statusCode === 404
          ? 'Página não encontrada.'
          : 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
      </p>

      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          ← Voltar para Página Inicial
        </a>
      </div>

      {statusCode === 500 && (
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          <p><strong>Informação Técnica:</strong></p>
          <p>Se o problema persistir, por favor inclua o código de erro <code>{statusCode}</code> ao entrar em <a href="/contato">contato</a>.</p>
        </div>
      )}

      <style jsx>{`
        code {
          background-color: #f5f5f5;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        a {
          transition: opacity 0.2s;
        }
        a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
