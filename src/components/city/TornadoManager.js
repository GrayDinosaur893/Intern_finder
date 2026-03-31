export const TornadoState = {
  timeOffset: 0,
  cycles: 0,
  
  getTime: (clock) => {
    const rawTime = clock.elapsedTime + TornadoState.timeOffset;
    TornadoState.cycles = Math.floor(rawTime / 30);
    return rawTime;
  },

  getTornadoPosition: (t) => {
    // Continuous Lissajous figure-8 curve traversing 100x100 city seamlessly
    return {
      x: 35 * Math.sin(t * 0.4),
      y: 14, 
      z: 35 * Math.sin(t * 0.2)
    };
  },

  // Centralized arrays tracking live DOM statistics dynamically
  // 0: ALIVE, 1: SUCKED, 2: DESTROYED, 3: REBUILDING
  statuses: new Uint8Array(200),
  
  stats: {
    alive: 0,
    sucked: 0,
    destroyed: 0,
    rebuilding: 0
  }
};
