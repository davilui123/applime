import { useState } from 'react';
import Vision from './apps/vision';
import IBRead from './apps/ibread';
import Treinuu from './apps/treinuu';
import Greena from './apps/greena';
import IntelMe from './apps/intelme';
import Intergo from './apps/intergo';

function App() {
  const [currentApp, setCurrentApp] = useState('vision');

  // Mapeamento dos componentes
  const renderApp = () => {
    switch (currentApp) {
      case 'vision': return <Vision />;
      case 'ibread': return <IBRead />;
      case 'treinuu': return <Treinuu />;
      case 'greena': return <Greena />;
      case 'intelme': return <IntelMe />;
      case 'intergo': return <Intergo />;
      default: return <Vision />;
    }
  };

  const menuItems = [
    { id: 'vision', label: '👁️ Vision' },
    { id: 'ibread', label: '📚 IBRead' },
    { id: 'treinuu', label: '🏐 Treinuu' },
    { id: 'greena', label: '💰 Greena' },
    { id: 'intelme', label: '🧠 IntelMe' },
    { id: 'intergo', label: '✈️ Intergo' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header do Applime */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--accent)', fontSize: '2rem' }}>Applime</h1>
      </header>

      {/* Menu de Apps Internos */}
      <nav style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px', 
        marginBottom: '30px' 
      }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentApp(item.id)}
            style={{
              padding: '12px 8px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: currentApp === item.id ? 'var(--accent)' : 'var(--bg-surface)',
              color: currentApp === item.id ? 'var(--bg-main)' : 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Container onde o Sub-App ativo é renderizado */}
      <main style={{ 
        backgroundColor: 'var(--bg-surface)', 
        padding: '24px', 
        borderRadius: '16px',
        border: '1px solid var(--applime-ocean)',
        minHeight: '200px'
      }}>
        {renderApp()}
      </main>
    </div>
  );
}

export default App;