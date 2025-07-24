// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/user/profile");
      setNotifications(res.data?.user?.notifications || []);
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) =>
    filter === "all" ? true : n.type === filter
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "account", "order", "system"].map((t) => (
          <Button
            key={t}
            variant={filter === t ? "default" : "outline"}
            onClick={() => setFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((note, idx) => {
            let icon = "🔔";
            let style = "text-gray-700";

            switch (note.type) {
              case "account":
                icon = "👤";
                style = "text-blue-600";
                break;
              case "order":
                icon = "📦";
                style = "text-green-600";
                break;
              case "system":
                icon = "⚠️";
                style = "text-yellow-600";
                break;
              default:
                break;
            }

            return (
              <div
                key={idx}
                className={`border p-4 rounded-md flex gap-3 items-start ${style}`}
              >
                <div className="text-2xl">{icon}</div>
                <div>
                  <p className="font-medium">{note.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(note.date).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
