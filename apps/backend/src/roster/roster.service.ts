import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../user/user.entity';
import { IRosterRO } from './roster.interface';

@Injectable()
export class RosterService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async getRoster(): Promise<IRosterRO> {
    const rows = (await this.em.getConnection().execute(
      `
      select u.username as username,
             count(a.id) as articlesCount,
             coalesce(sum(a.favorites_count), 0) as favoritesCount,
             min(a.created_at) as firstArticleDate
      from \`user\` u
      left join article a on a.author_id = u.id
      group by u.id
      order by coalesce(sum(a.favorites_count), 0) desc
      `,
    )) as Array<{
      username: string;
      articlesCount: number | string | null;
      favoritesCount: number | string | null;
      firstArticleDate: string | Date | null;
    }>;

    return {
      roster: rows.map((r) => ({
        username: r.username,
        articlesCount: Number(r.articlesCount ?? 0),
        favoritesCount: Number(r.favoritesCount ?? 0),
        firstArticleDate: r.firstArticleDate ? new Date(r.firstArticleDate as any).toISOString() : null,
      })),
    };
  }
}
