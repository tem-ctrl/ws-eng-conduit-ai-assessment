import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RosterApiService } from './roster.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RosterEntryDTO, RosterResponse } from '@realworld/core/api-types';

@Component({
  selector: 'realworld-roster',
  templateUrl: './roster.component.html',
  styleUrls: [],
  providers: [],
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, RouterLink],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RosterComponent {
  readonly roster$: Observable<readonly RosterEntryDTO[]> = this.api.getRoster().pipe(map((r: RosterResponse) => r.roster));

  constructor(private readonly api: RosterApiService) {}
}
