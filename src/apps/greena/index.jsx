import { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, ArrowLeftRight, Target, ShieldAlert, Wallet2, Trophy, User } from 'lucide-react';
import '@fontsource/ranchers';

import Dashboard from './components/Dashboard';
import Transacoes from './components/Transacoes';
import Metas from './components/Metas';
import Dividas from './components/Dividas';
import Contas from './components/Contas';
import Missoes from './components/Missoes';
import Perfil from './components/Perfil';
import { useStreak, usePerfil } from './hooks/useGreenaData';
import { infoDeNivel, avatarDoNivel } from './lib/missionEngine';
import { greena } from './lib/theme';

const ABAS = [
  { id: 'dashboard', label: 'Painel', icone: LayoutDashboard, Componente: Dashboard },
  { id: 'transacoes', label: 'Lançamentos', icone: ArrowLeftRight, Componente: Transacoes },
  { id: 'metas', label: 'Metas', icone: Target, Componente: Metas },
  { id: 'dividas', label: 'Dívidas', icone: ShieldAlert, Componente: Dividas },
  { id: 'missoes', label: 'Missões', icone: Trophy, Componente: Missoes },
  { id: 'contas', label: 'Contas', icone: Wallet2, Componente: Contas },
  { id: 'perfil', label: 'Perfil', icone: User, Componente: Perfil },
];

export default function Greena({ onBack }) {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const AbaAtual = ABAS.find((a) => a.id === abaAtiva)?.Componente || Dashboard;
  const { perfil } = usePerfil();
  const { registrarHoje } = useStreak('abertura_diaria');

  useEffect(() => {
    registrarHoje();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nivelInfo = perfil ? infoDeNivel(perfil.xp_total) : null;
  const avatar = nivelInfo ? avatarDoNivel(nivelInfo.nivel) : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #8052fe 0%, #241458 100%)',
      paddingBottom: '80px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '20px 16px 0' }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '18px',
          backgroundColor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          padding: '10px 16px',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.20)',
        }}>
          <div
            onClick={onBack}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.20)'}
          >
            <ArrowLeft size={18} style={{ color: '#ffffff' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Logo com fundo branco e arredondado */}
              <img
                src="/greena-logo.png"
                alt="Greena"
                style={{
                  height: '36px',
                  width: 'auto',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
              />
              <span style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 500,
                letterSpacing: '0.2px',
                whiteSpace: 'nowrap',
              }}>
                Sua relação honesta com o dinheiro
              </span>
            </div>
          </div>

          {avatar && (
            <div
              onClick={() => setAbaAtiva('missoes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.20)',
                padding: '5px 12px 5px 8px',
                borderRadius: '30px',
                cursor: 'pointer',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{avatar.emoji}</span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.2px',
              }}>
                Nv.{nivelInfo.nivel}
              </span>
            </div>
          )}
        </header>

        <main style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '28px',
          padding: '20px 16px',
          border: '1px solid rgba(255,255,255,0.30)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}>
          <AbaAtual />
        </main>
      </div>

      {/* Navbar ajustada – fundo mais escuro e ícones menores */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(37, 20, 88, 0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '6px 2px calc(6px + env(safe-area-inset-bottom))',
        zIndex: 50,
      }}>
        {ABAS.map((aba) => {
          const Icone = aba.icone;
          const ativa = aba.id === abaAtiva;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px',
                color: ativa ? '#fdfc30' : 'rgba(255,255,255,0.60)',
                transition: 'color 0.2s, transform 0.1s',
                position: 'relative',
                minWidth: '48px',
              }}
              onMouseEnter={(e) => {
                if (!ativa) e.currentTarget.style.color = 'rgba(255,255,255,0.90)';
              }}
              onMouseLeave={(e) => {
                if (!ativa) e.currentTarget.style.color = 'rgba(255,255,255,0.60)';
              }}
            >
              {ativa && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#fdfc30',
                }} />
              )}
              <Icone size={18} strokeWidth={ativa ? 2.6 : 2} stroke={ativa ? '#fdfc30' : 'currentColor'} />
              <span style={{
                fontSize: '0.55rem',
                fontWeight: ativa ? 800 : 600,
                letterSpacing: '0.1px',
                textTransform: 'uppercase',
              }}>
                {aba.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}