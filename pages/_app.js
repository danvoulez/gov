import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  // Default meta tags (can be overridden by individual pages)
  const defaultTitle = 'LogLine Foundation — Governança Verificável'
  const defaultDescription = 'Padrões abertos, provas verificáveis, governança computável através de protocolos criptográficos.'

  return (
    <>
      <Head>
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
      </Head>

      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo principal
      </a>

      <header role="banner">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo" aria-label="LogLine Foundation - Página Inicial">
              <strong>LogLine Foundation</strong>
            </a>
            <Nav />
          </div>
        </div>
      </header>

      <main id="main-content" className="container" role="main">
        <Component {...pageProps} />
      </main>

      <footer role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <p>
              <strong>LogLine Foundation</strong> — Padrões abertos, provas verificáveis, governança computável.
            </p>
            <p className="footer-links">
              <a href="/manifesto">Manifesto</a>
              {' · '}
              <a href="/contato">Contato</a>
              {' · '}
              <a href="/press">Press Kit</a>
              {' · '}
              <a href="https://github.com/logline-foundation" target="_blank" rel="noopener noreferrer" aria-label="GitHub da LogLine Foundation (abre em nova aba)">
                GitHub
              </a>
            </p>
            <p className="footer-meta">
              <small>© 2025 LogLine Foundation. Conteúdo sob licença aberta.</small>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

function Nav() {
  return (
    <nav role="navigation" aria-label="Navegação principal">
      <ul>
        <li><a href="/">Institucional</a></li>
        <li><a href="/governanca">Governança</a></li>
        <li><a href="/padroes">Padrões</a></li>
        <li><a href="/transparencia">Transparência</a></li>
        <li><a href="/comites">Comitês</a></li>
        <li><a href="/publicacoes">Publicações</a></li>
        <li><a href="/engenharia/logline-101">Engenharia</a></li>
        <li><a href="/politicas">Políticas</a></li>
        <li><a href="/calendario">Calendário</a></li>
        <li><a href="/contato">Contato</a></li>
      </ul>
    </nav>
  )
}
