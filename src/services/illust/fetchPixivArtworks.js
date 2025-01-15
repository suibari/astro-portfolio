import PixivApi from 'pixiv-api-client';
import axios from 'axios';
const pixiv = new PixivApi();

const userId = "251033";

const fetchPixivArtworks = async () => {
  try {
    await pixiv.refreshAccessToken(import.meta.env.PIXIV_REFRESH_TOKEN);
    const illustrations = await pixiv.userIllusts(userId);

    // 必要な情報を整形
    const artworks = await Promise.all(
      illustrations.illusts.map(async (artwork) => ({
        title: artwork.title,
        image: await fetchPixivImage(artwork.image_urls.medium),
        link: `https://www.pixiv.net/artworks/${artwork.id}`,
        date: artwork.create_date,
      }))
    );

    return artworks;
  } catch (error) {
    console.error('Pixivのデータ取得に失敗しました:', error);
    return [];
  }
};

// refererを偽装しfetchし、バイナリを返す
const fetchPixivImage = async (imageUrl) => {
  const response = await axios.get(imageUrl, {
    headers: {
      Referer: 'https://www.pixiv.net/',
    },
    responseType: 'arraybuffer',
  });
  return `data:${response.headers['content-type']};base64,${Buffer.from(response.data).toString('base64')}`;
};

export default fetchPixivArtworks;
