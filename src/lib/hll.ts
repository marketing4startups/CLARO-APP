import murmur from 'murmurhash-js';

/**
 * A pure JavaScript implementation of HyperLogLog for probabilistic counting.
 * This allows for anonymous, aggregated analytics without storing personal data.
 */
export class HyperLogLog {
  private m: number;
  private p: number;
  private registers: Uint8Array;
  private alpha: number;

  constructor(p: number = 10) {
    this.p = p;
    this.m = 1 << p;
    this.registers = new Uint8Array(this.m);
    
    // Alpha constants for different register counts
    if (this.m === 16) this.alpha = 0.673;
    else if (this.m === 32) this.alpha = 0.697;
    else if (this.m === 64) this.alpha = 0.709;
    else this.alpha = 0.7213 / (1 + 1.079 / this.m);
  }

  /**
   * Inserts a value into the HLL sketch.
   */
  insert(value: string) {
    // Use murmurhash3 for high-quality hashing
    const hash = murmur(value);
    
    // Use the first p bits for register index
    const j = hash >>> (32 - this.p);
    
    // Use the remaining bits to find the position of the first 1
    const w = hash << this.p;
    const rho = this.clz(w) + 1;
    
    this.registers[j] = Math.max(this.registers[j], rho);
  }

  /**
   * Count leading zeros in a 32-bit integer.
   */
  private clz(n: number): number {
    if (n === 0) return 32 - this.p;
    let count = 0;
    // We only care about the bits after the index bits
    const bitsToCheck = 32 - this.p;
    for (let i = 31; i >= 32 - bitsToCheck; i--) {
      if ((n >>> i) & 1) break;
      count++;
    }
    return count;
  }

  /**
   * Estimates the cardinality of the set.
   */
  count(): number {
    let z = 0;
    for (let i = 0; i < this.m; i++) {
      z += Math.pow(2, -this.registers[i]);
    }
    let estimate = this.alpha * this.m * this.m * (1 / z);

    // Small range correction
    if (estimate <= 2.5 * this.m) {
      let v = 0;
      for (let i = 0; i < this.m; i++) {
        if (this.registers[i] === 0) v++;
      }
      if (v > 0) {
        estimate = this.m * Math.log(this.m / v);
      }
    } 
    // Large range correction (for 32-bit hashes)
    else if (estimate > (1 / 30) * Math.pow(2, 32)) {
      estimate = -Math.pow(2, 32) * Math.log(1 - estimate / Math.pow(2, 32));
    }

    return Math.round(estimate);
  }

  /**
   * Merges another HLL sketch into this one.
   */
  merge(other: HyperLogLog) {
    if (this.m !== other.m) {
      throw new Error("Cannot merge HLL sketches with different register counts");
    }
    for (let i = 0; i < this.m; i++) {
      this.registers[i] = Math.max(this.registers[i], other.registers[i]);
    }
  }

  /**
   * Serializes the sketch to a hex string.
   */
  toString(): string {
    return Array.from(this.registers)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Deserializes the sketch from a hex string.
   */
  fromString(s: string) {
    if (s.length !== this.m * 2) {
      throw new Error("Invalid sketch string length");
    }
    for (let i = 0; i < this.m; i++) {
      this.registers[i] = parseInt(s.substring(i * 2, i * 2 + 2), 16);
    }
  }
}
