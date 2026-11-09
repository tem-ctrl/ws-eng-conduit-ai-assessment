import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@realworld/core/http-client';
import { RosterResponse } from '@realworld/core/api-types';

@Injectable({ providedIn: 'root' })
export class RosterApiService {
  constructor(private readonly api: ApiService) {}

  getRoster(params?: { limit?: number; offset?: number }): Observable<RosterResponse> {
    const search = new URLSearchParams();
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    if (params?.offset !== undefined) search.set('offset', String(params.offset));
    const qs = search.toString();
    return this.api.get<RosterResponse>(`/roster${qs ? `?${qs}` : ''}`);
  }
}
