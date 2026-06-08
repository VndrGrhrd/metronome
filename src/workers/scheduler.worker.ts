let timerId: number | null = null;

self.onmessage = (event: MessageEvent<{ type: 'start' | 'stop'; lookaheadMs?: number }>) => {
  if (event.data.type === 'stop' && timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    return;
  }

  if (event.data.type === 'start') {
    if (timerId !== null) {
      clearInterval(timerId);
    }

    timerId = setInterval(() => {
      self.postMessage({ type: 'tick' });
    }, event.data.lookaheadMs ?? 25);
  }
};

export {};
