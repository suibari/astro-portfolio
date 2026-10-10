import { resolveNagiRepo, listRecords, blobURL } from './records';

interface NagiPost { text: string; createdAt: string }
interface NagiProfile { avatar?: { ref?: { $link?: string } } }

export async function fetchNagiPosts() {
  const repo = await resolveNagiRepo();
  const [posts, profiles] = await Promise.all([
    listRecords<NagiPost>(repo, 'com.suibari.nagi.post', 3),
    listRecords<NagiProfile>(repo, 'com.suibari.nagi.profile'),
  ]);
  const profile = profiles.find(record => record.uri.endsWith('/self'));
  return posts.sort((a, b) => Date.parse(b.value.createdAt) - Date.parse(a.value.createdAt)).map(record => ({
    text: record.value.text,
    date: record.value.createdAt,
    image: blobURL(repo, profile?.value.avatar),
    link: `https://nagi.suibari.com/thread/${repo.did}/${record.uri.split('/').pop()}`,
  }));
}
