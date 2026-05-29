import { EventEmitter } from 'events';
import type { Request, SSEEvent } from './types';
import { requests as seedRequests } from './data';

class RequestStore extends EventEmitter {
  private requests: Request[] = seedRequests.map(r => ({ ...r, createdAt: new Date().toISOString() }));
  private clients = new Set<(event: SSEEvent) => void>();

  getAll(): Request[] {
    return [...this.requests];
  }

  getById(id: string): Request | undefined {
    return this.requests.find(r => r.id === id);
  }

  update(id: string, updates: Partial<Request>): Request | null {
    const idx = this.requests.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.requests[idx] = { ...this.requests[idx], ...updates };
    const updated = this.requests[idx];
    this.broadcast({ type: 'update_request', request: { id, ...updates } });
    return updated;
  }

  add(request: Request): Request {
    const r = { ...request, createdAt: new Date().toISOString() };
    this.requests.unshift(r);
    this.broadcast({ type: 'new_request', request: r });
    return r;
  }

  remove(id: string): boolean {
    const idx = this.requests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.requests.splice(idx, 1);
    this.broadcast({ type: 'delete_request', id });
    return true;
  }

  subscribe(handler: (event: SSEEvent) => void): () => void {
    this.clients.add(handler);
    return () => this.clients.delete(handler);
  }

  private broadcast(event: SSEEvent) {
    this.clients.forEach(h => h(event));
  }
}

// Singleton — survives hot reload in dev via global
const globalStore = globalThis as unknown as { __giStore?: RequestStore };
if (!globalStore.__giStore) {
  globalStore.__giStore = new RequestStore();
}
export const store = globalStore.__giStore;
