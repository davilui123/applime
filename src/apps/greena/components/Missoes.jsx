import { useMemo, useState } from 'react';
import { Flame, Sparkles, Check, X } from 'lucide-react';
import {
  usePerfil, useStreak, useMissoes, useMissoesUsuario,
  useTransacoes, useCategorias, useMetas,
} from '../hooks/useGreenaData';
import { infoDeNivel, avatarDoNivel, gerarSugestoesMissoes } from '../lib/missionEngine';
import { greena, cardStyle, pillButtonStyle } from '../lib/theme';

const DIFICULDADE_COR = { facil: greena.jade, media: greena.gold, dificil: greena.terracotta };

function CabecalhoPerfil({ perfil, streak }) {
  if (!perfil) return null;
  const { nivel, xpAtual, xpNecessario, percentual } = infoDeNivel(perfil.xp_total);
  const avatar = avatarDoNivel(nivel);

  return (
    <div style={{ ...cardStyle, padding: '18px', background: `linear-gradient(135deg, ${greena.jadeSoft} 0%, #FFFFFF 100%)`, marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>{avatar.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.98rem', fontWeight: 900, color: greena.jadeDeep }}>Nível {nivel} · {avatar.nome}</div>
          <div style={{ fontSize: '0.74rem', color: greena.jadeDeep, opacity: 0.75 }}>{xpAtual} / {xpNecessario} XP</div>
        </div>
        {streak?.streak_atual > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff', padding: '5px 10px', borderRadius: '14px', border: `1px solid ${greena.gold}55` }}>
            <Flame size={15} color={greena.gold} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: greena.jadeDeep }}>{streak.streak_atual}</span>
          </div>
        )}
      </div>
      <div style={{ height: '8px', borderRadius: '5px', backgroundColor: '#ffffff88', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percentual}%`, backgroundColor: greena.jade, borderRadius: '5px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}

export default function Missoes() {
  const { perfil, adicionarXP } = usePerfil();
  const { streak } = useStreak('abertura_diaria');
  const { dados: catalogo, criarMissaoPersonalizada } = useMissoes();
  const { dados: instancias, aceitarMissao, registrarProgresso, abandonarMissao } = useMissoesUsuario();
  const { dados: transacoes } = useTransacoes();
  const { dados: categorias } = useCategorias();
  const { dados: metas } = useMetas();
  const [aceitando, setAceitando] = useState(null);

  const emAndamento = instancias
    .filter((i) => i.status === 'em_andamento')
    .map((i) => ({ ...i, missao: catalogo.find((m) => m.id === i.missao_id) }))
    .filter((i) => i.missao);

  const concluidas = instancias
    .filter((i) => i.status === 'concluida')
    .map((i) => ({ ...i, missao: catalogo.find((m) => m.id === i.missao_id) }))
    .filter((i) => i.missao)
    .sort((a, b) => new Date(b.concluida_em) - new Date(a.concluida_em))
    .slice(0, 5);

  const titulosAtivos = emAndamento.map((i) => i.missao.titulo);

  const sugestoes = useMemo(
    () => gerarSugestoesMissoes({ transacoes, categorias, metas, titulosJaAtivos: titulosAtivos }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transacoes, categorias, metas, emAndamento.length]
  );

  async function handleAceitar(sugestao) {
    setAceitando(sugestao.titulo);
    const { data: missaoCriada } = await criarMissaoPersonalizada(sugestao);
    if (missaoCriada) await aceitarMissao(missaoCriada.id);
    setAceitando(null);
  }

  async function handleGanharXP(quantidade) {
    if (!perfil) return;
    const { nivel } = infoDeNivel(perfil.xp_total + quantidade);
    await adicionarXP(quantidade, nivel);
  }

  async function handleAvançarProgresso(instancia) {
    const meta = Number(instancia.missao.meta_valor);
    const proximo = Number(instancia.progresso_atual) + 1;
    await registrarProgresso(instancia.id, proximo, meta, instancia.missao.xp_recompensa, handleGanharXP);
  }

  return (
    <div>
      <CabecalhoPerfil perfil={perfil} streak={streak} />

      {sugestoes.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sparkles size={15} color={greena.gold} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Missões pra você</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sugestoes.map((s) => (
              <div key={s.titulo} style={{ ...cardStyle, padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>{s.titulo}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>{s.descricao}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fff', backgroundColor: DIFICULDADE_COR[s.dificuldade], padding: '2px 9px', borderRadius: '10px' }}>
                        +{s.xp_recompensa} XP
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={aceitando === s.titulo}
                    onClick={() => handleAceitar(s)}
                    style={{ ...pillButtonStyle(true, greena.jade), padding: '6px 14px', flexShrink: 0 }}
                  >
                    {aceitando === s.titulo ? '…' : 'Aceitar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {emAndamento.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--applime-dark-purple)', marginBottom: '10px' }}>Em andamento</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {emAndamento.map((i) => {
              const progresso = Math.min((Number(i.progresso_atual) / Number(i.missao.meta_valor)) * 100, 100);
              return (
                <div key={i.id} style={{ ...cardStyle, padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>{i.missao.titulo}</div>
                    <X size={14} onClick={() => abandonarMissao(i.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }} />
                  </div>
                  <div style={{ height: '8px', borderRadius: '5px', backgroundColor: 'var(--bg-main)', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${progresso}%`, backgroundColor: greena.jade, borderRadius: '5px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {i.progresso_atual} / {i.missao.meta_valor} {i.missao.unidade}
                    </span>
                    <button onClick={() => handleAvançarProgresso(i)} style={{ ...pillButtonStyle(false, greena.jade), padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} /> Avancei hoje
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {concluidas.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--applime-dark-purple)', marginBottom: '10px' }}>Conquistas recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {concluidas.map((i) => (
              <div key={i.id} style={{ ...cardStyle, padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--applime-dark-purple)' }}>🏆 {i.missao.titulo}</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: greena.gold }}>+{i.xp_ganho} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sugestoes.length === 0 && emAndamento.length === 0 && concluidas.length === 0 && (
        <div style={{ ...cardStyle, padding: '30px 16px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Lance algumas transações pra eu conseguir sugerir missões com base nos seus hábitos.</p>
        </div>
      )}
    </div>
  );
}