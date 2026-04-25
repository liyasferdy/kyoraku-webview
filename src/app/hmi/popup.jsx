"use client";

import { useState } from "react";
import { Button, Card, CardContent, CloseButton } from "@heroui/react";

export default function PopupVisual({ onClose, ngvisualId }) {
  const [loading, setLoading] = useState(false);

  const categories = [
    "Thickness Welding NG Tebal",
    "Lelehan Undercut",
    "NG Nabrak",
    "Weld Line",
    "Zure / Step",
    "Bubble",
    "Hakka",
    "Gosong",
    "Ibutsu",
    "Burry Welding / Lelehan Tinggi",
    "Silver Mark",
    "Short Mold",
  ];

  const handleClick = async (category) => {
    if (!ngvisualId) {
      alert("No ngvisual_id provided");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/ngvisual", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ngvisual_id: ngvisualId,
          ng_visual_remarks: category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update");
      }

      console.log("Saved:", data);

      // close popup after success
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save remark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <Card className="relative w-11/12 max-w-180 md:w-1/2">
        <CardContent>
          {/* HEADER */}
          <div className="relative flex items-center justify-center mb-6">
            <CloseButton
              onPress={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 scale-125"
            />

            <h3 className="text-2xl md:text-3xl mt-5 font-bold text-center">
              <span className="px-6 py-2 rounded-lg bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)]">
                NG Visual Categorize
              </span>
            </h3>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-5 mt-8 mb-10 justify-center">
            {categories.map((item, i) => (
              <button
                key={i}
                onClick={() => handleClick(item)}
                disabled={loading}
                className="
                  min-w-60
                  px-8 py-5
                  text-lg md:text-xl
                  font-bold
                  rounded-xl
                  bg-yellow-400
                  text-black
                  shadow-lg
                  hover:bg-yellow-500
                  active:scale-95
                  transition
                  disabled:opacity-50
                "
              >
                {loading ? "Saving..." : item}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
