import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Users, Trophy, Plus, Minus } from 'lucide-react';

export default function GolfScorecard() {
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [numHoles, setNumHoles] = useState(18);
  const [players, setPlayers] = useState([]);
  const [currentHole, setCurrentHole] = useState(1);
  const [scores, setScores] = useState({});
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('golfScorecard');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGameStarted(data.gameStarted);
        setNumPlayers(data.numPlayers);
        setNumHoles(data.numHoles);
        setPlayers(data.players);
        setCurrentHole(data.currentHole);
        setScores(data.scores);
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const data = { gameStarted, numPlayers, numHoles, players, currentHole, scores };
      localStorage.setItem('golfScorecard', JSON.stringify(data));
    }
  }, [gameStarted, numPlayers, numHoles, players, currentHole, scores]);

  useEffect(() => {
    let wakeLock = null;
    if (gameStarted && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(lock => {
        wakeLock = lock;
      }).catch(() => {});
    }
    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, [gameStarted]);

  const startGame = () => {
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`
    }));
    setPlayers(newPlayers);
    setScores({});
    setCurrentHole(1);
    setGameStarted(true);
    setLastAction(null);
  };

  const updateScore = (playerId, hole, strokes) => {
    const value = parseInt(strokes) || 0;
    if (value < 0) return;
    
    setLastAction({ playerId, hole, previousValue: scores[`${playerId}-${hole}`] });
    setScores(prev => ({ ...prev, [`${playerId}-${hole}`]: value }));
  };

  const undo = () => {
    if (!lastAction) return;
    const { playerId, hole, previousValue } = lastAction;
    setScores(prev => {
      const newScores = { ...prev };
      if (previousValue === undefined) {
        delete newScores[`${playerId}-${hole}`];
      } else {
        newScores[`${playerId}-${hole}`] = previousValue;
      }
      return newScores;
    });
    setLastAction(null);
  };

  const getPlayerTotal = (playerId) => {
    let total = 0;
    for (let h = 1; h <= numHoles; h++) {
      total += scores[`${playerId}-${h}`] || 0;
    }
    return total;
  };

  const getPlayerThrough = (playerId) => {
    let lastHole = 0;
    for (let h = 1; h <= numHoles; h++) {
      if (scores[`${playerId}-${h}`]) lastHole = h;
    }
    return lastHole;
  };

  const resetGame = () => {
    if (window.confirm('Reset entire game? This cannot be undone.')) {
      setGameStarted(false);
      setScores({});
      setCurrentHole(1);
      setLastAction(null);
      localStorage.removeItem('golfScorecard');
    }
  };

  const styles = {
    setupContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    setupCard: {
      background: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      maxWidth: '28rem',
      width: '100%'
    },
    iconCircle: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '5rem',
      height: '5rem',
      background: '#059669',
      borderRadius: '50%',
      marginBottom: '1rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem',
      textAlign: 'center'
    },
    subtitle: {
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem'
    },
    counterContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    counterBtn: {
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      background: '#e5e7eb',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    counterNum: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      width: '4rem',
      textAlign: 'center'
    },
    holeGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    holeBtn: {
      padding: '1rem',
      borderRadius: '0.75rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    holeBtnActive: {
      background: '#059669',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    },
    holeBtnInactive: {
      background: '#f3f4f6',
      color: '#374151'
    },
    startBtn: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(to right, #059669, #047857)',
      color: 'white',
      borderRadius: '0.75rem',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s'
    },
    gameContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
      paddingBottom: '6rem'
    },
    header: {
      background: 'linear-gradient(to right, #059669, #047857)',
      color: 'white',
      padding: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    headerBtns: {
      display: 'flex',
      gap: '0.5rem'
    },
    headerBtn: {
      padding: '0.5rem',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '0.5rem',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    },
    content: {
      padding: '1rem'
    },
    leaderboard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      marginBottom: '1.5rem'
    },
    leaderboardHeader: {
      background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    leaderboardTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    playerRow: {
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb',
      transition: 'all 0.2s'
    },
    playerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    rankBadge: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    rankFirst: {
      background: '#fbbf24',
      color: '#78350f'
    },
    rankOther: {
      background: '#e5e7eb',
      color: '#374151'
    },
    playerName: {
      fontWeight: '600',
      color: '#1f2937'
    },
    playerThrough: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    playerTotal: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    holeCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      marginBottom: '1rem'
    },
    holeHeader: {
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: 'white',
      padding: '1rem'
    },
    holeTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    holeContent: {
      padding: '1rem'
    },
    scoreRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.75rem'
    },
    scoreLabel: {
      flex: 1,
      fontWeight: '500',
      color: '#374151'
    },
    scoreInput: {
      width: '5rem',
      padding: '0.75rem 1rem',
      textAlign: 'center',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      border: '2px solid #d1d5db',
      borderRadius: '0.75rem',
      outline: 'none',
      transition: 'all 0.2s'
    }
  };

  if (!gameStarted) {
    return (
      <div style={styles.setupContainer}>
        <div style={styles.setupCard}>
          <div style={{ textAlign: 'center' }}>
            <div style={styles.iconCircle}>
              <Trophy size={40} color="white" />
            </div>
            <h1 style={styles.title}>Golf Scorecard</h1>
            <p style={styles.subtitle}>Track your round with ease</p>
          </div>

          <div>
            <label style={styles.label}>
              <Users size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Number of Players
            </label>
            <div style={styles.counterContainer}>
              <button
                onClick={() => setNumPlayers(Math.max(1, numPlayers - 1))}
                style={styles.counterBtn}
                onMouseOver={(e) => e.target.style.background = '#d1d5db'}
                onMouseOut={(e) => e.target.style.background = '#e5e7eb'}
              >
                <Minus size={20} />
              </button>
              <span style={styles.counterNum}>{numPlayers}</span>
              <button
                onClick={() => setNumPlayers(Math.min(4, numPlayers + 1))}
                style={styles.counterBtn}
                onMouseOver={(e) => e.target.style.background = '#d1d5db'}
                onMouseOut={(e) => e.target.style.background = '#e5e7eb'}
              >
                <Plus size={20} />
              </button>
            </div>

            <label style={styles.label}>Number of Holes</label>
            <div style={styles.holeGrid}>
              <button
                onClick={() => setNumHoles(9)}
                style={{
                  ...styles.holeBtn,
                  ...(numHoles === 9 ? styles.holeBtnActive : styles.holeBtnInactive)
                }}
              >
                9 Holes
              </button>
              <button
                onClick={() => setNumHoles(18)}
                style={{
                  ...styles.holeBtn,
                  ...(numHoles === 18 ? styles.holeBtnActive : styles.holeBtnInactive)
                }}
              >
                18 Holes
              </button>
            </div>

            <button
              onClick={startGame}
              style={styles.startBtn}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              Start Round
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gameContainer}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={styles.headerTitle}>Golf Scorecard</h1>
          <div style={styles.headerBtns}>
            <button
              onClick={undo}
              disabled={!lastAction}
              style={{
                ...styles.headerBtn,
                opacity: lastAction ? 1 : 0.5,
                cursor: lastAction ? 'pointer' : 'not-allowed'
              }}
              onMouseOver={(e) => lastAction && (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
              onMouseOut={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={resetGame}
              style={styles.headerBtn}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          {numHoles} Holes • {numPlayers} Player{numPlayers > 1 ? 's' : ''}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.leaderboard}>
          <div style={styles.leaderboardHeader}>
            <h2 style={styles.leaderboardTitle}>Leaderboard</h2>
          </div>
          <div>
            {players
              .map(player => ({
                ...player,
                total: getPlayerTotal(player.id),
                through: getPlayerThrough(player.id)
              }))
              .sort((a, b) => {
                if (a.through === 0) return 1;
                if (b.through === 0) return -1;
                return a.total - b.total;
              })
              .map((player, index) => (
                <div
                  key={player.id}
                  style={styles.playerRow}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={styles.playerLeft}>
                    <div style={{
                      ...styles.rankBadge,
                      ...(index === 0 && player.through > 0 ? styles.rankFirst : styles.rankOther)
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={styles.playerName}>{player.name}</div>
                      <div style={styles.playerThrough}>
                        {player.through > 0 ? `Through ${player.through}` : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <div style={styles.playerTotal}>{player.total || 0}</div>
                </div>
              ))}
          </div>
        </div>

        <div>
          {Array.from({ length: numHoles }, (_, i) => i + 1).map(hole => (
            <div key={hole} style={styles.holeCard}>
              <div style={styles.holeHeader}>
                <h3 style={styles.holeTitle}>Hole {hole}</h3>
              </div>
              <div style={styles.holeContent}>
                {players.map(player => (
                  <div key={player.id} style={styles.scoreRow}>
                    <label style={styles.scoreLabel}>{player.name}</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      value={scores[`${player.id}-${hole}`] || ''}
                      onChange={(e) => updateScore(player.id, hole, e.target.value)}
                      placeholder="0"
                      style={styles.scoreInput}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}