import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RosterApiService } from './roster.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { RosterEntryDTO, RosterResponse } from '@realworld/core/api-types';
import { PagerComponent } from '@realworld/ui/components';

@Component({
  selector: 'realworld-roster',
  templateUrl: './roster.component.html',
  styleUrls: [],
  providers: [],
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, RouterLink, PagerComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RosterComponent {
  readonly pageSize = 10;
  private readonly pageSubject = new BehaviorSubject<number>(1);
  readonly page$ = this.pageSubject.asObservable();

  readonly response$: Observable<RosterResponse> = this.page$.pipe(
    switchMap((page) => this.api.getRoster({ limit: this.pageSize, offset: (page - 1) * this.pageSize })),
    shareReplay(1),
  );

  readonly roster$: Observable<readonly RosterEntryDTO[]> = this.response$.pipe(
    map((r: RosterResponse) => r.roster),
  );

  readonly totalPages$: Observable<number[]> = this.response$.pipe(
    map((r) => Math.max(1, Math.ceil(r.rosterCount / this.pageSize))),
    map((n) => Array.from({ length: n }, (_, i) => i + 1)),
    shareReplay(1),
  );

  constructor(private readonly api: RosterApiService) {}

  setPage(page: number) {
    this.pageSubject.next(page);
  }
}
