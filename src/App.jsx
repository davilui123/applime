import { useState, useEffect } from 'react';
// Importando os ícones da Lucide para modernizar o visual
import { User, Settings, HelpCircle, ChevronRight, LogOut, LayoutGrid } from 'lucide-react';
import Vision from './apps/vision';
import IBRead from './apps/ibread';
import Treinuu from './apps/treinuu';
import Greena from './apps/greena';
import IntelMe from './apps/intelme';
import Intergo from './apps/intergo';

function App() {
  const [currentApp, setCurrentApp] = useState('hub');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const appsList = [
    { id: 'intelme', label: 'IntelMe', icon: '🧠', category: 'Educação / Gamificação', desc: 'Astrofísica, Mandarim e concursos com o cão Intel.' },
    { id: 'vision', label: 'Vision', icon: '👁️', category: 'Produtividade', desc: 'O painel central de controle da sua rotina diária.' },
    { id: 'ibread', label: 'IBRead', icon: '📚', category: 'Leitura', desc: 'Leitor de EPUBs otimizado com Turbo Mode.' },
    { id: 'treinuu', label: 'Treinuu', icon: '🏐', category: 'Saúde & Esporte', desc: 'Calistenia, corrida e recuperação para vôlei.' },
    { id: 'greena', label: 'Greena', icon: '💰', category: 'Finanças', desc: 'Controle de gastos, quitação de dívidas e investimentos.' },
    { id: 'intergo', label: 'Intergo', icon: '✈️', category: 'Viagens', desc: 'Planejador completo focado no seu intercâmbio.' },
  ];

  const carouselItems = [
    { id: 'intelme', icon: '🧠', tag: 'EM DESTAQUE', title: 'IntelMe — Aprenda de verdade', desc: 'Astrofísica, Mandarim, Dev e Geopolítica em microlições gamificadas com o Intel.' },
    { id: 'intergo', icon: '✈️', tag: 'NOVO', title: 'Intergo — Seu intercâmbio', desc: 'Roteiros, checklists e controle financeiro para você não se perder antes de embarcar.' },
    { id: 'vision', icon: '👁️', tag: 'PRODUTIVIDADE', title: 'Vision — Painel da sua rotina', desc: 'Tarefas, hábitos e metas em um único painel limpo e focado.' }
  ];

  useEffect(() => {
    if (currentApp !== 'hub') return;
    const timer = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentApp, carouselItems.length]);

  const renderContent = () => {
    switch (currentApp) {
      case 'vision': return <Vision onBack={() => setCurrentApp('hub')} />;
      case 'ibread': return <IBRead onBack={() => setCurrentApp('hub')} />;
      case 'treinuu': return <Treinuu onBack={() => setCurrentApp('hub')} />;
      case 'greena': return <Greena onBack={() => setCurrentApp('hub')} />;
      case 'intelme': return <IntelMe onBack={() => setCurrentApp('hub')} />;
      case 'intergo': return <Intergo onBack={() => setCurrentApp('hub')} />;
      default: return renderStoreHub();
    }
  };

  const renderStoreHub = () => (
    <div style={{ animation: 'fadeIn 0.3s ease', paddingBottom: '40px' }}>
      
      {/* 🎠 CARROSSEL ENCAPSULADO (Correção do estouro de tela) */}
      <div style={{ 
        position: 'relative', 
        margin: '12px 0 0', 
        overflow: 'hidden',
        borderRadius: '24px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(-${carouselIndex * 100}%)`,
          width: '100%'
        }}>
          {carouselItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentApp(item.id)}
              style={{
                width: '100%',
                flexMinus: '100%',
                flexShrink: 0,
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #E6ECEB 0%, #FFFFFF 100%)',
                padding: '24px',
                border: '1px solid var(--border-light)',
                minHeight: '165px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--accent)', letterSpacing: '1.2px', display: 'block', marginBottom: '4px' }}>{item.tag}</span>
                <h2 style={{ color: 'var(--applime-dark-purple)', fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', lineHeight: '1.25', letterSpacing: '-0.3px' }}>{item.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.4', fontWeight: '400' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎯 CARROSSEL DOTS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', margin: '12px 0 24px' }}>
        {carouselItems.map((_, i) => (
          <div
            key={i}
            onClick={() => setCarouselIndex(i)}
            style={{
              width: carouselIndex === i ? '16px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'var(--applime-ocean)',
              opacity: carouselIndex === i ? 1 : 0.25,
              transition: 'all 0.25s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <h3 style={{ color: 'var(--applime-dark-purple)', fontSize: '1.05rem', marginBottom: '14px', fontWeight: '700', letterSpacing: '-0.2px' }}>Seus Aplicativos</h3>
      
      {/* LISTA DE APLICATIVOS STYLE STORE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {appsList.map((app) => (
          <div
            key={app.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.005)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ fontSize: '1.6rem', backgroundColor: 'var(--bg-main)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(61,123,128,0.08)' }}>
                {app.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{app.category}</span>
                <span style={{ color: 'var(--applime-dark-purple)', fontWeight: '700', fontSize: '0.95rem', display: 'block', letterSpacing: '-0.2px' }}>{app.label}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1px', display: 'block', lineHeight: '1.3' }}>{app.desc}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentApp(app.id)}
              style={{
                backgroundColor: 'rgba(61, 123, 128, 0.06)',
                color: 'var(--applime-ocean)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                letterSpacing: '0.2px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--applime-ocean)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(61, 123, 128, 0.06)'; e.currentTarget.style.color = 'var(--applime-ocean)'; }}
            >
              ABRIR
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', position: 'relative', overflowX: 'hidden' }}>
      
      {currentApp === 'hub' && (
        <div style={{ maxWidth: '450px', margin: '0 auto', padding: '20px 16px 0' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h1 style={{ color: 'var(--applime-dark-purple)', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.8px' }}>
              applime<span style={{ color: 'var(--applime-sage)', fontWeight: '400' }}>store</span>
            </h1>
            <div 
              onClick={() => setIsDrawerOpen(true)}
              style={{ 
                width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--applime-mint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem',
                color: 'var(--applime-dark-purple)', border: '2px solid var(--applime-sage)', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(119,177,169,0.2)'
              }}
            >
              DS
            </div>
          </header>
        </div>
      )}

      {/* 👤 DRAWER REFORMULADO COM LUCIDE ICONS */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(39, 10, 51, 0.25)', zIndex: 100,
            display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(2px)', animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)', width: '270px', height: '100vh',
              display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(39, 10, 51, 0.06)'
            }}
          >
            {/* Header do Drawer */}
            <div style={{ padding: '32px 24px 24px', background: 'linear-gradient(135deg, #F0F5F4 0%, #FFFFFF 100%)', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--applime-mint)', border: '2px solid var(--applime-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', color: 'var(--applime-dark-purple)', marginBottom: '12px' }}>DS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--applime-dark-purple)', letterSpacing: '-0.2px' }}>David Luiz da Silva</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px', fontWeight: '500' }}>david.silva02@cps.sp.gov.br</div>
            </div>
            
            {/* Itens do Menu com Ícones Reais e Alinhamento Preciso */}
            <div style={{ padding: '16px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', color: 'var(--applime-dark-purple)', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='#F4F6F6'} onMouseLeave={(e)=>e.currentTarget.style.background='none'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LayoutGrid size={18} strokeWidth={2.2} style={{ color: 'var(--applime-ocean)' }} />
                  <span>Meus Aplicativos</span>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', color: 'var(--applime-dark-purple)', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='#F4F6F6'} onMouseLeave={(e)=>e.currentTarget.style.background='none'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Settings size={18} strokeWidth={2.2} style={{ color: 'var(--applime-ocean)' }} />
                  <span>Configurações</span>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', color: 'var(--applime-dark-purple)', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='#F4F6F6'} onMouseLeave={(e)=>e.currentTarget.style.background='none'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HelpCircle size={18} strokeWidth={2.2} style={{ color: 'var(--applime-ocean)' }} />
                  <span>Ajuda & Suporte</span>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Footer do Drawer com Logout */}
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)' }}>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                style={{ 
                  width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid rgba(226, 75, 74, 0.15)', 
                  background: 'rgba(226, 75, 74, 0.04)', color: '#E24B4A', cursor: 'pointer', fontSize: '0.82rem', 
                  fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <LogOut size={14} strokeWidth={2.5} />
                <span>Fechar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ width: '100%' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;