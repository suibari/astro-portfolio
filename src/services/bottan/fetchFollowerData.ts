export async function fetchFollowerData() {
  try {
    const response = await fetch('https://bottan-measurement-worker.404-not-found-address.workers.dev/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching follower data:", error);
    return [];
  }
}
