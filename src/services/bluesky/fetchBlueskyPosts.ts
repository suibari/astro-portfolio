import { AtpAgent } from '@atproto/api';
import type { QueryParams } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed';
const agent = new AtpAgent({service: 'https://bsky.social'});

const THRD_LIKE = 5;
const identifier = "suibari.com";

export const fetchBlueskyPosts = async () => {
  await agent.login({
    identifier: identifier,
    password: import.meta.env.BSKY_PASSWORD,
  });

  const params: QueryParams = {
    actor: identifier,
    limit: 100
  };
  const {data} = await agent.getAuthorFeed(params);
  
  // いいねが規定値以上を抽出
  const feedBuzz = data.feed.filter(f => Number(f.post.likeCount) >= THRD_LIKE);

  return feedBuzz;
}