import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/userSession";

export default function LoginHistory() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const email = getStoredUser()?.email;
        const endpoint = email
          ? `/api/auth/getLoginHistory?email=${encodeURIComponent(email)}`
          : "/api/auth/getLoginHistory";
        const res = await fetch(endpoint);
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="section-card overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Login History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review browser, device, OS, IP address, and login status records.
            </p>
          </div>

          <div className="grid gap-4 p-4 md:hidden">
            {history.map((item, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900 break-all">
                  {item.email}
                </p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Browser:</span> {item.browser}</p>
                  <p><span className="font-medium text-slate-800">OS:</span> {item.os}</p>
                  <p><span className="font-medium text-slate-800">Device:</span> <span className="capitalize">{item.device}</span></p>
                  <p className="break-all"><span className="font-medium text-slate-800">IP:</span> {item.ipAddress}</p>
                  <p><span className="font-medium text-slate-800">Status:</span> {item.status}</p>
                  <p><span className="font-medium text-slate-800">Login Time:</span> {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Browser
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Device
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Login Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.browser}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.os}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-slate-700">
                      {item.device}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.ipAddress}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
