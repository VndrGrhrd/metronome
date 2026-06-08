export class SampleLoader {
  private readonly buffers = new Map<string, AudioBuffer>();

  constructor(private readonly audioContext: AudioContext) {}

  async load(name: string, url: string): Promise<AudioBuffer> {
    const cachedBuffer = this.buffers.get(name);

    if (cachedBuffer) {
      return cachedBuffer;
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.buffers.set(name, audioBuffer);
    return audioBuffer;
  }

  get(name: string): AudioBuffer | undefined {
    return this.buffers.get(name);
  }
}
