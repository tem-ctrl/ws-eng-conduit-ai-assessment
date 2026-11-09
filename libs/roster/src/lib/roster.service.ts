import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@realworld/core/http-client';
import { RosterResponse } from '@realworld/core/api-types';

@Injectable({ providedIn: 'root' })
export class RosterApiService {
  constructor(private readonly api: ApiService) {}

  getRoster(): Observable<RosterResponse> {
    return this.api.get<RosterResponse>('/roster');
  }
}
