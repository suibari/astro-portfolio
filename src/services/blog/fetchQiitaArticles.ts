export async function fetchQiitaArticles(username: String, token: String) {
  const apiUrl = `https://qiita.com/api/v2/authenticated_user/items`;

  const params = {
    per_page: String(100),
  };
  const query_params = new URLSearchParams(params);

  // HTTPリクエスト
  const response = await fetch(apiUrl + `?${query_params}`, {
    headers: {
      Authorization: `Bearer ${token}`, // トークンを付与
    },
  });

  if (!response.ok) {
    throw new Error(`Qiita APIリクエスト失敗: ${response.status}`);
  }

  const data = await response.json();

  // 必要な形式に整形
  return data.map((item: { title: any; url: any; created_at: string | number | Date; user: { profile_image_url: any; }; }) => ({
    title: item.title,
    link: item.url,
    date: new Date(item.created_at).toLocaleDateString(),
    image: null, // プロフィール画像を使用
  }));
}
