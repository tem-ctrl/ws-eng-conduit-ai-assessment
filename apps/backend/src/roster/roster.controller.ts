import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IRosterRO } from './roster.interface';
import { RosterService } from './roster.service';

@ApiTags('roster')
@Controller('roster')
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}

  @Get()
  async getRoster(@Query() query: Record<string, string>): Promise<IRosterRO> {
    return this.rosterService.getRoster(query);
  }
}
