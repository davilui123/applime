import { useRef, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const LIMIAR_ACIONAMENTO = 70; // px de puxada pra disparar o refresh
const RESISTENCIA = 0.45; // torna a puxada mais "pesada" quanto mais desce

export default function PullToRefresh({ onRefresh, children }) {
  const containerRef = useRef(null);
  const [distancia, setDistancia] = useState(0);
  const [atualizando, setAtualizando] = useState(false);
  const pontoInicialY = useRef(0);
  const puxando = useRef(false);

  const podeIniciarPull = useCallback(() => {
    const el = containerRef.current;
    // só ativa o gesto se a página já está no topo — senão atrapalha o scroll normal
    return window.scrollY <= 0 && el;
  }, []);

  function handleTouchStart(e) {
    if (!podeIniciarPull() || atualizando) return;
    pontoInicialY.current = e.touches[0].clientY;
    puxando.current = true;
  }

  function handleTouchMove(e) {
    if (!puxando.current || atualizando) return;
    const deltaY = e.touches[0].clientY - pontoInicialY.current;
    if (deltaY <= 0) {
      setDistancia(0);
      return;
    }
    // só assume o gesto (bloqueia scroll nativo) quando a puxada é clara
    if (deltaY > 8) {
      e.preventDefault();
      setDistancia(Math.min(deltaY * RESISTENCIA, 110));
    }
  }

  async function handleTouchEnd() {
    if (!puxando.current) return;
    puxando.current = false;
    if (distancia >= LIMIAR_ACIONAMENTO && !atualizando) {
      setAtualizando(true);
      setDistancia(LIMIAR_ACIONAMENTO);
      try {
        await onRefresh();
      } finally {
        setAtualizando(false);
        setDistancia(0);
      }
    } else {
      setDistancia(0);
    }
  }

  const progresso = Math.min(distancia / LIMIAR_ACIONAMENTO, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${distancia}px`,
          overflow: 'hidden',
          transition: puxando.current ? 'none' : 'height 0.25s ease',
        }}
      >
        <RefreshCw
          size={22}
          color="#fff"
          style={{
            opacity: progresso,
            transform: `rotate(${progresso * 360}deg) ${atualizando ? '' : ''}`,
            animation: atualizando ? 'greena-spin 0.7s linear infinite' : 'none',
          }}
        />
      </div>
      <style>{`@keyframes greena-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {children}
    </div>
  );
}
