export type Basis = "+" | "x";
export type Bit = 0 | 1;

export interface QubitData {
  bit: Bit;
  basis: Basis;
}

export interface ProtocolState {
  mode: "without-eve" | "with-eve";
  step: "idle" | "prepared" | "sending" | "measuring" | "comparing" | "complete";
  currentRound: number;
  totalRounds: number;
  aliceData: QubitData[];
  bobBases: Basis[];
  bobMeasurements: (Bit | null)[];
  eveInterceptions: boolean[];
  matchingIndices: number[];
  sharedKey: string;
  errorRate: number;
  speed: "slow" | "normal" | "fast";
}

export interface ChatMessage {
  id: string;
  sender: "alice" | "bob" | "eve" | "system";
  message: string;
  timestamp: number;
  round?: number;
}

export interface PhotonData {
  id: string;
  bit: Bit;
  basis: Basis;
  round: number;
  x: number;
  y: number;
  isIntercepted: boolean;
  isComplete: boolean;
}