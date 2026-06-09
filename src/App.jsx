function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: '20px'
    }}>
      <h1 style={{ color: 'var(--accent)' }}>Applime</h1>
      <p style={{ color: 'var(--text-muted)' }}>O ecossistema para a sua rotina.</p>
      <div style={{ 
        backgroundColor: 'var(--bg-surface)', 
        padding: '20px', 
        borderRadius: '12px',
        border: '1px solid var(--applime-ocean)'
      }}>
        Ambiente configurado com sucesso! 🚀
      </div>
    </div>
  )
}

export default App