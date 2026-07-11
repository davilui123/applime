import { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, ArrowLeftRight, Target, ShieldAlert, Wallet2, Trophy, User } from 'lucide-react';

// Importa a fonte Ranchers
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
      background: 'linear-gradient(145deg, #00875A 0%, #003366 100%)',
      paddingBottom: '90px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '20px 16px 0' }}>
        {/* Header com fundo semi-transparente para contraste */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '18px',
          backgroundColor: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
          padding: '10px 16px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.15)',
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
            <ArrowLeft size={18} style={{ color: '#FFFFFF' }} />
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 900,
              fontFamily: "'Ranchers', cursive",
              letterSpacing: '1px',
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #FFB800 0%, #FFFFFF 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              Greena
            </h1>
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
            }}>
              Sua relação honesta com o dinheiro
            </span>
          </div>

          {avatar && (
            <div
              onClick={() => setAbaAtiva('missoes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.20)',
                padding: '6px 14px 6px 10px',
                borderRadius: '30px',
                cursor: 'pointer',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{avatar.emoji}</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.3px',
              }}>
                Nv.{nivelInfo.nivel}
              </span>
            </div>
          )}
        </header>

        {/* Conteúdo com fundo branco semi-transparente para legibilidade */}
        <main style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderRadius: '28px',
          padding: '20px 16px',
          border: '1px solid rgba(255,255,255,0.30)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          <AbaAtual />
        </main>
      </div>

      {/* Navegação inferior – ajustada para o fundo escuro */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 4px calc(10px + env(safe-area-inset-bottom))',
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
                gap: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                color: ativa ? '#FFB800' : 'rgba(255,255,255,0.60)',
                transition: 'color 0.2s, transform 0.1s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!ativa) e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
              }}
              onMouseLeave={(e) => {
                if (!ativa) e.currentTarget.style.color = 'rgba(255,255,255,0.60)';
              }}
            >
              {ativa && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#FFB800',
                }} />
              )}
              <Icone size={22} strokeWidth={ativa ? 2.6 : 2} stroke={ativa ? '#FFB800' : 'currentColor'} />
              <span style={{
                fontSize: '0.6rem',
                fontWeight: ativa ? 800 : 600,
                letterSpacing: '0.2px',
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