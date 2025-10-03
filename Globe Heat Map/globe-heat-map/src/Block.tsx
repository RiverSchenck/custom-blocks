import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import Globe, { type GlobeInstance } from "react-globe.gl";
import { type BlockProps } from "@frontify/guideline-blocks-settings";
import { useAssetViewer } from "@frontify/app-bridge";

type Location = { lat: number; lng: number; city: string; color: string; id: number };

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }: BlockProps) => {

    const { open } = useAssetViewer(appBridge);

    const locations: Location[] = [
    { lat: 40.7128, lng: -74.006, city: "Sample 1", color: "red", id: 744265 },
    { lat: 51.5074, lng: -0.1278, city: "Sample 2", color: "blue", id: 742282 },
    { lat: 35.6895, lng: 139.6917, city: "Sample 3", color: "green", id: 739100 },
    ];

    const getAssetInfo = async (id: number) => {
        console.log("Getting asset info for id:", id);
        const asset = await appBridge.getAssetById(id);
        console.log(asset);
        return asset;
    };

    // measure the container
    const containerRef = useRef<HTMLDivElement | null>(null);
    const globeRef = useRef<GlobeInstance | null>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    const [mode, setMode] = useState<'cluster' | 'points'>('cluster');
    const [hexRes, setHexRes] = useState(2); // coarse at first

    useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    const controls = g.controls();
    if (!controls) return;

    const onChange = () => {
        const pov = g.pointOfView(); // { lat, lng, altitude }
        const z = pov.altitude;

        // tune thresholds for your 600px block
        // higher altitude = farther away
        if (z > 1.8) {
        setMode('cluster');           // show bins
        setHexRes(2);                 // very coarse
        } else if (z > 1.3) {
        setMode('cluster');
        setHexRes(3);                 // finer bins
        } else if (z > 1.05) {
        setMode('cluster');
        setHexRes(4);                 // even finer
        } else {
        setMode('points');            // switch to individual pins
        }
    };

    controls.addEventListener('change', onChange);
    onChange(); // initialize once
    return () => controls.removeEventListener('change', onChange);
    }, []);


    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const el = containerRef.current;
        const ro = new ResizeObserver(() => {
        const { width, height } = el.getBoundingClientRect();
        setSize({ w: Math.max(0, Math.floor(width)), h: Math.max(0, Math.floor(height)) });
        });

        ro.observe(el);
        // initialize immediately
        const { width, height } = el.getBoundingClientRect();
        setSize({ w: Math.max(0, Math.floor(width)), h: Math.max(0, Math.floor(height)) });

        return () => ro.disconnect();
    }, []);

    // optional: tune controls so it feels good in a smaller box
    useEffect(() => {
        const g = globeRef.current;
        if (!g) return;

        const controls = g.controls();
        if (controls) {
        controls.enablePan = false;
        controls.minDistance = 80;   // was 180 — lower lets you zoom in closer
        controls.maxDistance = 1500; // a bit more headroom out
        controls.zoomSpeed = 0.7;    // optional: feels nicer in a small block
        }

        // set a sensible starting view (altitude controls zoom)
        g.pointOfView({ lat: 20, lng: 0, altitude: 1.2 }); // lower altitude = closer
    }, [size.w, size.h]);

    return (
        <div
        ref={containerRef}
        style={{
            position: "relative",
            width: "100%",
            height: "600px",      // <— control your block height here (or use aspectRatio)
            overflow: "hidden",   // clips anything that might spill
            borderRadius: 12,
        }}
        >
            <Globe
                ref={globeRef as any}
                width={size.w}
                height={size.h}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // --- CLUSTERS (hex bins) ---
                {...(mode === 'cluster' ? {
                    hexBinPointsData: locations,
                    hexBinPointLat: (d: any) => (d as Location).lat,
                    hexBinPointLng: (d: any) => (d as Location).lng,
                    hexBinResolution: hexRes,
                    hexTopColor: () => 'rgba(255,255,255,0.9)',
                    hexSideColor: () => 'rgba(255,255,255,0.4)',
                    hexBinMerge: true,                 // smoother look
                    hexLabel: (bin: any) => `${bin.points.length} item(s)`,
                    hexTransitionDuration: 300,
                } : {})}

                // --- INDIVIDUAL POINTS ---
                {...(mode === 'points' ? {
                    pointsData: locations,
                    pointLat: (d: any) => (d as Location).lat,
                    pointLng: (d: any) => (d as Location).lng,
                    pointColor: (d: any) => (d as Location).color,
                    pointAltitude: () => 0.06,
                    pointRadius: 0.45,
                    pointLabel: (d: any) => (d as Location).city,
                    onPointClick: async (d: any) => {
                        const loc = d as Location;
                        try {
                          const asset = await getAssetInfo(loc.id);
                          if (asset) {
                            open?.(asset);        // ✅ open with the fetched asset object
                          }
                        } catch (e) {
                          console.error("getAssetInfo failed:", e);
                        }
                      },
                    } : {})}
            />

        </div>
  );
};
