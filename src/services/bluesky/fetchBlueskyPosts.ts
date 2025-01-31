import { AtpAgent } from '@atproto/api';
import type { QueryParams } from '@atproto/api/dist/client/types/app/bsky/feed/getAuthorFeed';
const agent = new AtpAgent({service: 'https://bsky.social'});

const THRD_LIKE = 10;
const identifier = "suibari.com";
const did = "did:plc:uixgxpiqf4i63p6rgpu7ytmx";

export const fetchBlueskyPosts = async () => {
  // const {data: data_token} = await agent.login({
  //   identifier: identifier,
  //   password: import.meta.env.BSKY_PASSWORD,
  // });
  // console.log(data_token);

  if (import.meta.env.BSKY_REFRESH_TOKEN) {
    // development
    await agent.resumeSession({
      accessJwt: import.meta.env.BSKY_ACCESS_TOKEN,
      refreshJwt: import.meta.env.BSKY_REFRESH_TOKEN,
      handle: identifier,
      did: did,
      active: false
    });
  } else {
    // production
    const {data: data_token} = await agent.login({
      identifier: identifier,
      password: import.meta.env.BSKY_PASSWORD,
    });
    console.log(data_token);
  }

  const params: QueryParams = {
    actor: identifier,
    limit: 100
  };
  const {data: data_feed} = await agent.getAuthorFeed(params);
  
  // いいねが規定値以上を抽出
  const feedBuzz = data_feed.feed.filter(f => Number(f.post.likeCount) >= THRD_LIKE);

  return feedBuzz;
}