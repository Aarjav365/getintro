export type AvatarColor = 'blue' | 'green' | 'purple' | 'pink' | 'teal' | 'amber' | 'slate';

export interface AvatarData {
  color: AvatarColor;
  initials: string;
}

export interface Persona {
  id: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatar: AvatarData;
  stats: { sent: string; replies: string; turnaround: string };
  verified: boolean;
}

export type RequestStatus = 'pending' | 'accepted' | 'declined';
export type RequestType = 'call' | 'invest' | 'mentor' | 'collab' | 'apply' | 'intro';

export interface SenderInfo {
  name: string;
  role: string;
  company?: string;
  avatar: AvatarData;
  location?: string;
  links?: Array<{ k: string; v: string }>;
}

export interface AIReason {
  k: string;
  v: string;
}

export interface AIAnalysis {
  fit: number;
  reasons: AIReason[];
  draftReply?: string;
}

export interface Request {
  id: string;
  unread: boolean;
  status: RequestStatus;
  sender: SenderInfo;
  type: RequestType;
  typeLabel: string;
  subject: string;
  preview?: string;
  time: string;
  date: string;
  message?: string[];
  fields?: Record<string, string>;
  ai?: AIAnalysis;
  createdAt?: string;
}

export interface RequestTypeConfig {
  id: RequestType;
  icon: string;
  name: string;
  desc: string;
  price: string;
  free?: boolean;
  fields: string[];
}

export interface NetworkNode {
  id: string;
  name: string;
  x: number;
  y: number;
  you?: boolean;
  score?: number | null;
  color?: string;
  initials?: string;
  role?: string;
  active?: boolean;
  why?: string;
  overlap?: string[];
  tags?: string[];
}

export interface KpiData {
  label: string;
  value: string;
  delta: string;
  spark: number[];
}

export interface FunnelItem {
  label: string;
  sub: string;
  count: number;
  pct: number;
}

export interface LeaderItem {
  name: string;
  role: string;
  val: number;
  rank: number;
}

export interface CommunityData {
  name: string;
  members: number;
  kpis: KpiData[];
  funnel: FunnelItem[];
  leaders: LeaderItem[];
}

export type SSEEvent =
  | { type: 'connected'; timestamp: number }
  | { type: 'new_request'; request: Request }
  | { type: 'update_request'; request: Partial<Request> & { id: string } }
  | { type: 'delete_request'; id: string }
  | { type: 'heartbeat'; timestamp: number };

export type RealtimeEvent =
  | { eventType: 'INSERT'; new: Request }
  | { eventType: 'UPDATE'; new: Request; old: { id: string } }
  | { eventType: 'DELETE'; old: { id: string } };
