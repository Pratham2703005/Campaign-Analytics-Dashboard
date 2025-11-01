import { useEffect, useState } from "react";

type Campaign = {
  id: number;
  name: string;
  status: string;
  clicks: number;
  cost: number;
  impressions: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://campaign-analytics-dashboard-production-36f4.up.railway.app" || "http://localhost:8000";

export default function CampaignsClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/campaigns`);
      if (filter === "Active" || filter === "Paused") url.searchParams.set("status", filter);
      const res = await fetch(url.toString());
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Campaign Analytics</h2>
          <div>
            <label className="mr-2 text-sm">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded border bg-gray-950 px-2 py-1"
            >
              <option>All</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full table-auto">
            <thead className="bg-zinc-800 text-center">
              <tr>
                <th className="px-4 py-3 !text-left">Campaign Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Impressions</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900 text-center">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3  !text-left">{c.name}</td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3">{c.clicks}</td>
                    <td className="px-4 py-3">${c.cost.toFixed(2)}</td>
                    <td className="px-4 py-3">{c.impressions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
