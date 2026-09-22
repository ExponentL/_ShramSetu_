import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Maximize2, Minimize2, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: 'worker' | 'customer';
  photoUrl?: string;
  speed?: number;
  heading?: number; // Heading in degrees (0-360)
}

export type MapTileLayer = 'streets' | 'satellite' | 'terrain';

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers: MapMarker[];
  routePath?: [number, number][];
  completedPath?: [number, number][];
  heightClass?: string;
  onRecenter?: () => void;
  onSelectMarker?: (markerId: string) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 14,
  markers,
  routePath,
  completedPath,
  heightClass = 'h-80 sm:h-96',
  onSelectMarker,
}) => {
  const { language } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [currentLayer, setCurrentLayer] = useState<MapTileLayer>('streets');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const tileLayerUrls: Record<MapTileLayer, { url: string; attribution: string; maxZoom: number }> = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
      maxZoom: 18,
    },
    terrain: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    },
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
      try {
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: true,
        }).setView(center, zoom);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const config = tileLayerUrls[currentLayer];
        const initialTile = L.tileLayer(config.url, {
          attribution: config.attribution,
          maxZoom: config.maxZoom,
        }).addTo(map);

        tileLayerRef.current = initialTile;
        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;
        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('[LeafletMap] Map initialization caught error:', err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_) {}
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, []);

  // Switch Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = tileLayerUrls[currentLayer];
    const newTile = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [currentLayer]);

  // Recenter Map Handler
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePath && routePath.length > 1) {
      const polyline = L.polyline(routePath);
      map.fitBounds(polyline.getBounds(), { padding: [50, 50], animate: true });
    } else if (markers.length > 0) {
      map.setView([markers[0].lat, markers[0].lng], zoom, { animate: true });
    } else {
      map.setView(center, zoom, { animate: true });
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Update Markers, Heading and Route Paths
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Add Markers
    markers.forEach((m) => {
      const isWorker = m.type === 'worker';
      const heading = m.heading || 0;

      const customHtml = isWorker
        ? `
          <div class="relative flex items-center justify-center pointer-events-auto">
            <!-- Pulsing outer signal aura -->
            <div class="absolute -inset-3 rounded-full bg-emerald-500/35 animate-ping"></div>
            <div class="absolute -inset-1.5 rounded-full bg-emerald-400/50 animate-pulse"></div>

            <!-- Direction arrow pointer (rotates based on heading) -->
            <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease-out;" class="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-emerald-600 filter drop-shadow"></div>
            </div>

            <!-- Avatar badge -->
            <div class="w-11 h-11 rounded-full border-2 border-white shadow-xl overflow-hidden bg-neutral-900 flex items-center justify-center relative z-10 text-white font-bold">
              ${
                m.photoUrl
                  ? `<img src="${m.photoUrl}" alt="${m.title}" class="w-full h-full object-cover"/>`
                  : `<svg class="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>`
              }
            </div>

            <!-- Live GPS Active Indicator Pin -->
            <div class="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 border-2 border-white shadow">
              <svg class="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
          </div>
        `
        : `
          <div class="relative flex items-center justify-center pointer-events-auto">
            <div class="absolute -inset-2 rounded-full bg-blue-500/25 animate-ping"></div>
            <div class="w-10 h-10 rounded-full bg-blue-900 border-2 border-white shadow-xl flex items-center justify-center text-white relative z-10">
              <svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            </div>
            <div class="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border border-white">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            </div>
          </div>
        `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-map-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(layerGroup);
      if (onSelectMarker) {
        marker.on('click', () => {
          onSelectMarker(m.id);
        });
      }

      const popupContent = `
        <div class="p-2 text-slate-900 font-sans min-w-[160px]">
          <div class="flex items-center gap-1.5 font-bold text-xs ${isWorker ? 'text-emerald-800' : 'text-blue-900'}">
            <span>${isWorker ? '🛠️' : '🏠'}</span>
            <span>${m.title}</span>
          </div>
          ${m.subtitle ? `<div class="text-[11px] text-slate-600 mt-1 leading-snug">${m.subtitle}</div>` : ''}
          ${
            m.speed !== undefined
              ? `<div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px]">
                  <span class="text-slate-500">${language === 'hi' ? 'लाइव गति:' : 'Live Speed:'}</span>
                  <span class="font-bold text-emerald-700">${m.speed} km/h</span>
                </div>`
              : ''
          }
        </div>
      `;
      marker.bindPopup(popupContent);
    });

    // 1. Draw Full/Remaining Route (Dashed emerald line with glow)
    if (routePath && routePath.length > 1) {
      L.polyline(routePath, {
        color: '#10b981',
        weight: 8,
        opacity: 0.3,
        lineCap: 'round',
      }).addTo(layerGroup);

      L.polyline(routePath, {
        color: '#059669',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(layerGroup);
    }

    // 2. Draw Traveled/Completed Path (Solid thick emerald line)
    if (completedPath && completedPath.length > 1) {
      L.polyline(completedPath, {
        color: '#047857',
        weight: 5,
        opacity: 1,
        lineCap: 'round',
      }).addTo(layerGroup);
    }
  }, [markers, routePath, completedPath, language]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md ${
        isFullscreen ? 'h-screen w-screen rounded-none' : ''
      }`}
    >
      <div ref={mapContainerRef} className={`w-full ${isFullscreen ? 'h-full' : heightClass} z-10`} />

      {/* Top Left: Layer Status & GPS Encryption Badge */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg shadow-lg text-[10px] font-bold border border-slate-700/60 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            {language === 'hi' ? 'लाइव जीपीएस सैटेलाइट लिंक' : 'Live GPS Satellite Uplink'}
          </span>
        </div>
      </div>

      {/* Top Right: Layer Switcher & Map Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        {/* Layer Selector */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1 text-[11px] font-semibold text-slate-700">
          <button
            onClick={() => setCurrentLayer('streets')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              currentLayer === 'streets'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title={language === 'hi' ? 'सड़क मानचित्र' : 'Street Map'}
          >
            {language === 'hi' ? 'सड़क' : 'Streets'}
          </button>
          <button
            onClick={() => setCurrentLayer('satellite')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              currentLayer === 'satellite'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title={language === 'hi' ? 'सैटेलाइट दृश्य' : 'Satellite Imagery'}
          >
            {language === 'hi' ? 'सैटेलाइट' : 'Satellite'}
          </button>
          <button
            onClick={() => setCurrentLayer('terrain')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              currentLayer === 'terrain'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title={language === 'hi' ? 'भूभाग मानचित्र' : 'Terrain Map'}
          >
            {language === 'hi' ? 'भूभाग' : 'Terrain'}
          </button>
        </div>

        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-lg cursor-pointer transition-colors"
          title={language === 'hi' ? 'रूट पर केंद्रित करें' : 'Fit Route to View'}
        >
          <Compass className="w-4 h-4 text-blue-900" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-lg cursor-pointer transition-colors"
          title={
            isFullscreen
              ? language === 'hi'
                ? 'फुलस्क्रीन से बाहर निकलें'
                : 'Exit Fullscreen'
              : language === 'hi'
              ? 'फुलस्क्रीन मानचित्र'
              : 'Fullscreen Map'
          }
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-800" /> : <Maximize2 className="w-4 h-4 text-slate-800" />}
        </button>
      </div>
    </div>
  );
};
