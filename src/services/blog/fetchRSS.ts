import Parser from 'rss-parser';

export async function fetchRSS(url: string) {
  const parser = new Parser({
    customFields: {
      item: [['media:thumbnail', 'image']],
    }
  });
  const feed = await parser.parseURL(url);
  return feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    date: new Date(String(item.pubDate)).toLocaleDateString(),
    image: item.image || null, // RSSフィードの画像がある場合
  }));
}
