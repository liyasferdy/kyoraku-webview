"use client";

import { Button } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import PopupVisual from "./popup";

export default function HmiWebview() {
  const [open, setOpen] = useState(false);
  const [latestId, setLatestId] = useState(null);
  const [productType, setProductType] = useState(null);
  const [allcountId, setAllcountId] = useState(null);

  const prevIdRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/ngvisual");
        const data = await res.json();

        if (!data || !data.id) return;

        const latestId = data.id;

        if (!initializedRef.current) {
          prevIdRef.current = latestId;
          initializedRef.current = true;
          return;
        }

        if (!open && latestId !== prevIdRef.current) {
          console.log("NEW DATA DETECTED:", data);
          setLatestId(latestId);
          setProductType(data.product_type);
          setAllcountId(data.allcount_id);
          setOpen(true);
          prevIdRef.current = latestId;
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div
        className={`w-full h-screen transition-all duration-300 ${
          open ? "blur-sm scale-[0.99]" : ""
        }`}
      >
        <iframe
          // src="https://d10e0aa11bf48c04.p16.rt3.io/webvisu.htm"
          src="https://192.168.20.52:8080/webvisu.htm" //IP static from local server
          className="w-full h-full border-0"
          title="HMI WebVisu"
        />
        {/* 
        <div className="absolute top-4 right-4">
          <Button onPress={() => setOpen(true)}>Popup</Button>
        </div> */}
      </div>

      {open && (
        <PopupVisual
          onClose={() => setOpen(false)}
          ngvisualId={latestId}
          productType={productType}
          allcountId={allcountId}
        />
      )}
    </div>
  );
}
