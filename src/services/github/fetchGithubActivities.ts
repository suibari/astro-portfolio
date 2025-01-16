import axios from "axios";
import { developments } from "../../data/developments";

export interface Commit {
  repo: string;
  date: string;
  message: string;
  link: string;
}

const GITHUB_API_URL = "https://api.github.com";

/**
 * 特定のリポジトリの最新コミットを取得する関数
 * @param repoName リポジトリ名 (ユーザー名/リポジトリ名の形式)
 * @param repoUrl リポジトリのURL
 * @returns Commit[] コミット情報の配列
 */
async function fetchCommitsForRepo(repoName: string, repoUrl: string): Promise<Commit[]> {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${repoName}/commits`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      auth: {
        username: import.meta.env.GITHUB_CLIENT_ID,
        password: import.meta.env.GITHUB_SECRET,
      }
    });

    return response.data.map((commit: any) => ({
      repo: repoName,
      date: commit.commit.author.date,
      message: commit.commit.message,
      link: repoUrl,
    }));
  } catch (error) {
    console.error(`Failed to fetch commits for repo: ${repoName}`, error);
    return [];
  }
}

/**
 * developments.ts の repo プロパティが存在するリポジトリ全てのコミットを取得
 * @returns Promise<Commit[]> すべてのリポジトリのコミット情報
 */
export async function fetchGithubActivities(): Promise<Commit[]> {
  const repos = developments
    .filter((dev) => dev.repoName !== undefined && dev.repoUrl !== undefined)
    .map((dev) => ({ name: dev.repoName, url: dev.repoUrl }));

  const commitPromises = repos.map((repo) =>
    fetchCommitsForRepo(`suibari/${repo.name}`, repo.url)
  );

  const allCommitsNested = await Promise.all(commitPromises);
  const allCommits = allCommitsNested.flat();

  const allCommitsSorted = allCommits.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return allCommitsSorted;
}