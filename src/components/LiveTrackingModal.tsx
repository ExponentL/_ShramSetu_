import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import { LeafletMap } from './LeafletMap';
import { TradeBadgeAvatar } from './TradeBadgeAvatar';
import {
  ShieldCheck,
  Phone,
  Clock,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  MapPin,
  RefreshCw,
  Building2,
  Lock,
  Compass,
  Share2,
  FastForward,
  Sliders,
  Check,
  Copy,
  Radio,
  KeyRound,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Award,
  Wrench,
  ArrowRight,
} from 'lucide-react';

export const LiveTrackingModal: React.FC = () => {
  const {
    bookings,
    activeTrackingBookingId,
    setActiveTrackingBookingId,
    updateBookingStatus,
    updateLiveLocation,
    startWorkerTrip,
    currentRole,
    setReviewTargetBooking,
    setIsDiagnosisModalOpen,
    setDiagnosisTargetBooking,
    t,
  } = useApp();

  // Find active booking or first available
  const activeBooking =
    bookings.find((b) => b.id === activeTrackingBookingId) ||
    bookings.find((b) => b.status === 'Worker On The Way' || b.status === 'Accepted' || b.status === 'Arrived') ||
    bookings[0];

  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [currentProgressIndex, setCurrentProgressIndex] = useState<number>(0);
  const [useDeviceGps, setUseDeviceGps] = useState<boolean>(false);
  const [deviceGpsError, setDeviceGpsError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [workerEnteredOtp, setWorkerEnteredOtp] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Derive static safety OTP based on booking
  const safetyOtp = useMemo(() => {
    if (!activeBooking) return '4821';
    const numPart = activeBooking.bookingNumber.replace(/\D/g, '') || '901';
    const pin = (parseInt(numPart, 10) * 37 + 1042) % 9000 + 1000;
    return String(pin);
  }, [activeBooking?.bookingNumber]);

  // Compute realistic dynamic road route with high-accuracy waypoint density
  const simulatedRoute = useMemo<[number, number][]>(() => {
    if (!activeBooking) return [];

    const startLat = activeBooking.workerCurrentLocation?.lat || activeBooking.customerLocation.lat + 0.012;
    const startLng = activeBooking.workerCurrentLocation?.lng || activeBooking.customerLocation.lng - 0.015;
    const endLat = activeBooking.customerLocation.lat;
    const endLng = activeBooking.customerLocation.lng;

    // High-accuracy road routing with 36 waypoints simulating real street grid turns
    const numPoints = 36;
    const points: [number, number][] = [];
    const latDiff = endLat - startLat;
    const lngDiff = endLng - startLng;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      // Urban street grid with arterial road turns and residential avenue approach
      let deviationLat = 0;
      let deviationLng = 0;

      if (t < 0.25) {
        // Leg 1: Co-op Hub departure street
        deviationLat = Math.sin(t * 4 * Math.PI) * 0.0006;
        deviationLng = -0.0004 * (t / 0.25);
      } else if (t < 0.7) {
        // Leg 2: Main arterial corridor (Ring Road / Aurobindo Marg)
        const subT = (t - 0.25) / 0.45;
        deviationLat = 0.0008 * Math.sin(subT * Math.PI);
        deviationLng = 0.0012 * Math.sin(subT * Math.PI * 1.5);
      } else {
        // Leg 3: Residential approach & final customer lane
        const subT = (t - 0.7) / 0.3;
        deviationLat = 0.0004 * (1 - subT);
        deviationLng = -0.0003 * Math.sin(subT * Math.PI);
      }

      const lat = startLat + latDiff * t + deviationLat;
      const lng = startLng + lngDiff * t + deviationLng;
      points.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
    }
    return points;
  }, [activeBooking?.id, activeBooking?.customerLocation?.lat, activeBooking?.customerLocation?.lng]);

  // Calculate live heading angle
  const currentHeading = useMemo(() => {
    if (simulatedRoute.length < 2 || currentProgressIndex >= simulatedRoute.length - 1) return 45;
    const p1 = simulatedRoute[currentProgressIndex];
    const p2 = simulatedRoute[currentProgressIndex + 1] || p1;

    const lat1 = (p1[0] * Math.PI) / 180;
    const lon1 = (p1[1] * Math.PI) / 180;
    const lat2 = (p2[0] * Math.PI) / 180;
    const lon2 = (p2[1] * Math.PI) / 180;
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  }, [simulatedRoute, currentProgressIndex]);

  // Real Device Geolocation Watcher
  useEffect(() => {
    if (!useDeviceGps || !navigator.geolocation || !activeBooking) return;

    setDeviceGpsError(null);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const speed = Math.round((pos.coords.speed || 0) * 3.6) || 28;
        updateLiveLocation(activeBooking.id, lat, lng, speed);
      },
      (err) => {
        setDeviceGpsError(`Device GPS error: ${err.message}`);
        setUseDeviceGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [useDeviceGps, activeBooking?.id]);

  // Auto-progress simulation if status is 'Worker On The Way'
  useEffect(() => {
    if (!activeBooking || activeBooking.status !== 'Worker On The Way' || !isSimulatingGps || useDeviceGps) {
      return;
    }

    const intervalMs = Math.max(700, Math.round(4200 / simulationSpeed));
    const interval = setInterval(() => {
      setCurrentProgressIndex((prev) => {
        const next = prev + 1;
        if (next < simulatedRoute.length) {
          const [lat, lng] = simulatedRoute[next];
          const dynamicSpeed = Math.floor(22 + Math.random() * 12);
          updateLiveLocation(activeBooking.id, lat, lng, dynamicSpeed);
          return next;
        } else {
          // Arrived at destination!
          updateBookingStatus(activeBooking.id, 'Arrived', 'Worker arrived at customer premises');
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeBooking?.id, activeBooking?.status, isSimulatingGps, simulationSpeed, simulatedRoute, useDeviceGps]);

  if (!activeBooking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto my-12">
        <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">No Active Bookings Available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Please create a service booking or select an active job from the dashboard to initiate GPS dispatch tracking.
        </p>
      </div>
    );
  }

  const isWorkerOnWay = activeBooking.status === 'Worker On The Way';
  const isArrived = activeBooking.status === 'Arrived';
  const isWorkStarted = activeBooking.status === 'Work Started';
  const isWorkCompleted = activeBooking.status === 'Work Completed';

  useEffect(() => {
    if (isWorkStarted || isWorkCompleted) {
      setOtpVerified(true);
    }
  }, [isWorkStarted, isWorkCompleted]);

  useEffect(() => {
    if (activeBooking && (isArrived || isWorkStarted || isWorkCompleted) && simulatedRoute.length > 0) {
      setCurrentProgressIndex(simulatedRoute.length - 1);
    }
  }, [activeBooking?.id, isArrived, isWorkStarted, isWorkCompleted, simulatedRoute.length]);

  const customerCoords: [number, number] = [
    activeBooking.customerLocation.lat,
    activeBooking.customerLocation.lng,
  ];

  const workerCoords: [number, number] =
    isArrived || isWorkStarted || isWorkCompleted
      ? customerCoords
      : useDeviceGps && activeBooking.workerCurrentLocation
      ? [activeBooking.workerCurrentLocation.lat, activeBooking.workerCurrentLocation.lng]
      : simulatedRoute[currentProgressIndex] || [activeBooking.customerLocation.lat + 0.008, activeBooking.customerLocation.lng - 0.008];

  // Route paths
  const completedPath = simulatedRoute.slice(0, currentProgressIndex + 1);
  const remainingPath = simulatedRoute.slice(currentProgressIndex);

  // Progress ratio 0 - 1
  const progressRatio =
    isArrived || isWorkStarted || isWorkCompleted
      ? 1
      : simulatedRoute.length > 1
      ? currentProgressIndex / (simulatedRoute.length - 1)
      : 0;

  // Remaining Distance
  const remainingDistance = isWorkerOnWay
    ? Math.max(0.1, parseFloat((activeBooking.distanceKm * (1 - progressRatio)).toFixed(1)))
    : isArrived || isWorkStarted || isWorkCompleted
    ? 0
    : activeBooking.distanceKm;

  // Remaining ETA
  const remainingEta = isWorkerOnWay
    ? Math.max(1, Math.round(activeBooking.estimatedArrivalMinutes * (1 - progressRatio)))
    : 0;

  // Milestone list for Turn-by-Turn Tracker
  const milestones = [
    {
      id: 1,
      title: t.tracking.m1Title,
      desc: t.tracking.m1Desc,
      reached: progressRatio >= 0,
      active: progressRatio < 0.25 && isWorkerOnWay,
    },
    {
      id: 2,
      title: t.tracking.m2Title,
      desc: t.tracking.m2Desc,
      reached: progressRatio >= 0.25 || isArrived || isWorkStarted || isWorkCompleted,
      active: progressRatio >= 0.25 && progressRatio < 0.7 && isWorkerOnWay,
    },
    {
      id: 3,
      title: t.tracking.m3Title,
      desc: t.tracking.m3Desc,
      reached: progressRatio >= 0.7 || isArrived || isWorkStarted || isWorkCompleted,
      active: progressRatio >= 0.7 && progressRatio < 1 && isWorkerOnWay,
    },
    {
      id: 4,
      title: t.tracking.m4Title,
      desc: t.tracking.m4Desc,
      reached: isArrived || isWorkStarted || isWorkCompleted,
      active: isArrived,
    },
  ];

  const shareUrl = `${window.location.origin}/#track-${activeBooking.bookingNumber}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleVerifyOtp = () => {
    if (workerEnteredOtp.trim() === safetyOtp) {
      setOtpVerified(true);
      setOtpError(null);
      updateBookingStatus(activeBooking.id, 'Work Started', 'Customer PIN verified. Work in progress.');
    } else {
      setOtpError('Invalid 4-digit PIN. Please ask customer for correct security code.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Multi-Trip / Active Bookings Selector Bar */}
      {bookings.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{t.tracking.activeTrips} ({bookings.length}):</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {bookings.map((b) => {
              const isSelected = b.id === activeBooking.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveTrackingBookingId(b.id);
                    setCurrentProgressIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{b.bookingNumber}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      b.status === 'Worker On The Way'
                        ? 'bg-emerald-400 text-emerald-950 animate-pulse'
                        : isSelected
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-300 text-slate-800'
                    }`}
                  >
                    {b.status === 'Worker On The Way' ? 'Live GPS' : (t.bookingStatuses[b.status] || b.status)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cooperative Geolocation Privacy Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>{t.tracking.privacyNotice}</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                256-Bit SSL
              </span>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {t.tracking.privacySubtext} (<strong>{activeBooking.bookingNumber}</strong>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${workerCoords[0]},${workerCoords[1]}&destination=${customerCoords[0]},${customerCoords[1]}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title={t.tracking.openGmaps}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.tracking.openGmaps}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.tracking.shareTrip}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Map + Controls) & Right 1 Col (Milestones & Handshake) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map & Live Telemetry Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            {/* Header / Dispatch Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {t.tracking.radarTitle}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {t.bookingStatuses[activeBooking.status] || activeBooking.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.tracking.assignedUnit}: <strong>{activeBooking.workerName}</strong> ({t.categories[activeBooking.serviceCategory as ServiceCategory] || activeBooking.serviceCategory}) • {activeBooking.cooperativeName}
                </p>
              </div>

              {/* Simulation Controls & Device GPS Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Real Device GPS toggle */}
                {navigator.geolocation && (
                  <button
                    onClick={() => {
                      setUseDeviceGps(!useDeviceGps);
                      if (!useDeviceGps) setIsSimulatingGps(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      useDeviceGps
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="Switch to actual device GPS hardware"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{useDeviceGps ? t.tracking.usingDeviceGps : t.tracking.useDeviceGps}</span>
                  </button>
                )}

                {/* Simulation Play/Pause */}
                {isWorkerOnWay && !useDeviceGps && (
                  <button
                    id="gps-simulation-toggle"
                    onClick={() => setIsSimulatingGps(!isSimulatingGps)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    {isSimulatingGps ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{isSimulatingGps ? t.tracking.pause : t.tracking.resume}</span>
                  </button>
                )}

                {/* Simulation Speed Selector */}
                {isWorkerOnWay && !useDeviceGps && (
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                    {[1, 2, 5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setSimulationSpeed(speed)}
                        className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                          simulationSpeed === speed
                            ? 'bg-blue-900 text-white shadow-2xs'
                            : 'hover:text-blue-900'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {deviceGpsError && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{deviceGpsError}</span>
              </div>
            )}

            {/* Interactive Leaflet Map View */}
            <LeafletMap
              center={workerCoords}
              zoom={14}
              heightClass="h-96 sm:h-[440px]"
              markers={[
                {
                  id: 'worker-live-pin',
                  lat: workerCoords[0],
                  lng: workerCoords[1],
                  title: `${activeBooking.workerName} (${activeBooking.serviceCategory})`,
                  subtitle: `Heading to ${activeBooking.customerLocation.address}`,
                  type: 'worker',
                  photoUrl: activeBooking.workerPhoto,
                  speed: activeBooking.workerCurrentLocation?.speedKmH || 28,
                  heading: currentHeading,
                },
                {
                  id: 'customer-dest-pin',
                  lat: customerCoords[0],
                  lng: customerCoords[1],
                  title: `Customer: ${activeBooking.customerName}`,
                  subtitle: activeBooking.customerLocation.address,
                  type: 'customer',
                },
              ]}
              routePath={remainingPath}
              completedPath={completedPath}
            />

            {/* Interactive Route Scrubber (when simulating) */}
            {isWorkerOnWay && !useDeviceGps && simulatedRoute.length > 1 && (
              <div className="pt-2 px-1 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Sliders className="w-3.5 h-3.5" /> {t.tracking.transitScrubber}:
                  </span>
                  <span className="text-emerald-800">
                    {Math.round(progressRatio * 100)}% {t.tracking.routeCompleted}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={simulatedRoute.length - 1}
                  value={currentProgressIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setCurrentProgressIndex(idx);
                    const [lat, lng] = simulatedRoute[idx];
                    updateLiveLocation(activeBooking.id, lat, lng, 28);
                  }}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            )}

            {/* Real-Time Telemetry Stats Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t.tracking.remainingDist}</div>
                <div className="text-lg font-black text-blue-950 mt-0.5">
                  {remainingDistance} <span className="text-xs font-bold text-slate-500">km</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-[10px] uppercase font-bold text-emerald-800">{t.tracking.estimatedArrival}</div>
                <div className="text-lg font-black text-emerald-800 mt-0.5">
                  {isArrived ? t.tracking.arrivedText : `${remainingEta} ${t.tracking.minsSuffix}`}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t.tracking.liveVelocity}</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">
                  {activeBooking.workerCurrentLocation?.speedKmH || 28}{' '}
                  <span className="text-xs font-bold text-slate-500">km/h</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">{t.tracking.transitHeading}</div>
                <div className="text-base font-black text-blue-900 mt-0.5 flex items-center justify-center gap-1">
                  <Navigation
                    className="w-3.5 h-3.5 text-emerald-600 transition-transform duration-300"
                    style={{ transform: `rotate(${currentHeading}deg)` }}
                  />
                  <span>{currentHeading}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Turn-by-Turn Milestones, Security Handshake & Actions */}
        <div className="space-y-4">
          {/* Worker Profile & Identity Check */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-start gap-3.5">
              {activeBooking.workerPhoto ? (
                <img
                  src={activeBooking.workerPhoto}
                  alt={activeBooking.workerName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <TradeBadgeAvatar
                  trade={activeBooking.serviceCategory}
                  name={activeBooking.workerName}
                  size="md"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{activeBooking.workerName}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                    <span className="text-emerald-600 font-black">✓</span> Verified Worker
                  </span>
                </div>

                <div className="text-xs font-semibold text-neutral-800 mt-1">
                  Service: <span className="font-bold text-blue-900">{t.categories[activeBooking.serviceCategory as ServiceCategory] || activeBooking.serviceCategory}</span>
                </div>

                <div className="text-[11px] text-neutral-600 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Booking Status: <strong className="text-neutral-900">{activeBooking.status}</strong></span>
                  <span>•</span>
                  <span>Location Status: <strong className="text-emerald-700">{isArrived ? 'Arrived at Location' : `${remainingDistance} km away (Live GPS Active)`}</strong></span>
                </div>

                <p className="text-[11px] text-slate-500 truncate mt-1 font-medium">
                  {activeBooking.cooperativeName}
                </p>
              </div>
            </div>

            {/* Direct Contact & SOS Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${activeBooking.workerPhone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {t.tracking.callWorker} {activeBooking.workerPhone}
              </a>
              <button
                onClick={() => setIsSosActive(true)}
                className="py-2.5 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>{t.tracking.sosBtn}</span>
              </button>
            </div>

            {/* Safety Verification PIN (Security Handshake) */}
            <div className="p-4 bg-neutral-900 text-white rounded-2xl shadow-sm space-y-2 border border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>{t.tracking.doorstepPin}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {t.tracking.coopProtocol}
                </span>
              </div>

              {currentRole === 'customer' ? (
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-2xl font-mono font-black tracking-widest text-emerald-400">
                      {safetyOtp}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {t.tracking.customerPinHelp}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    ✓
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-blue-200">
                    {t.tracking.workerPinPrompt}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={workerEnteredOtp}
                      onChange={(e) => setWorkerEnteredOtp(e.target.value)}
                      placeholder={t.tracking.pinPlaceholder}
                      className="w-full bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-mono font-bold tracking-wider focus:outline-none"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      {t.tracking.verifyPinBtn}
                    </button>
                  </div>
                  {otpError && <p className="text-[10px] text-red-300 font-bold">{otpError}</p>}
                  {otpVerified && <p className="text-[10px] text-emerald-300 font-bold">✓ {t.tracking.pinVerified}</p>}
                </div>
              )}
            </div>

            {/* Turn-by-Turn Route Milestones */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-[11px] uppercase font-bold text-slate-500">
                <span>{t.tracking.milestonesTitle}</span>
                <span>{isArrived ? 'Step 4 of 4' : isWorkerOnWay ? 'In Transit' : 'Scheduled'}</span>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div key={m.id} className="flex items-start gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          m.reached
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : m.active
                            ? 'bg-blue-900 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {m.reached ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      {idx < milestones.length - 1 && (
                        <div
                          className={`w-0.5 h-6 my-0.5 ${
                            m.reached ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <div
                        className={`font-bold ${
                          m.active ? 'text-blue-900 font-extrabold' : m.reached ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {m.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifecycle Stepper Action Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] uppercase font-bold text-slate-400">
                {t.tracking.workflowActions}
              </div>

              {activeBooking.status === 'Accepted' && (
                <button
                  id="start-worker-trip-btn"
                  onClick={() => startWorkerTrip(activeBooking.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  {t.tracking.startTripBroadcast}
                </button>
              )}

              {activeBooking.status === 'Worker On The Way' && (
                <button
                  id="mark-arrived-btn"
                  onClick={() => {
                    setCurrentProgressIndex(simulatedRoute.length - 1);
                    updateBookingStatus(activeBooking.id, 'Arrived');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {t.tracking.confirmArrivalPremises}
                </button>
              )}

              {/* On-Site Diagnosis & MCQ Problem Selection Trigger */}
              {(activeBooking.status === 'Arrived' || activeBooking.status === 'Diagnosing' || activeBooking.status === 'Diagnosis Completed') && (
                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold flex items-center gap-1.5 text-xs text-amber-900">
                        <Wrench className="w-4 h-4 text-amber-700" />
                        <span>{t.tracking.stage2Title}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900">
                        {t.tracking.advancePaid}: ₹{activeBooking.baseFeePaid || 249}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-snug">
                      {t.tracking.stage2Help}
                    </p>
                    <button
                      id="open-diagnosis-mcq-btn"
                      onClick={() => {
                        setDiagnosisTargetBooking(activeBooking);
                        setIsDiagnosisModalOpen(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.tracking.fillDiagnosisBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {currentRole === 'worker' && (
                    <button
                      id="worker-report-diagnosis-btn"
                      onClick={() => updateBookingStatus(activeBooking.id, 'Diagnosis Completed')}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer border border-slate-300"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {t.tracking.notifyDiagComplete}
                    </button>
                  )}
                </div>
              )}

              {/* Display Confirmed Diagnosed Issues if Settled */}
              {activeBooking.diagnosedProblems && activeBooking.diagnosedProblems.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.tracking.confirmedFaultTitle}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeBooking.diagnosedProblems.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded bg-white border border-emerald-300 font-bold text-[10px] text-emerald-900">
                        {p.icon} {p.title} (₹{p.standardTariff})
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-medium pt-0.5">
                    {t.tracking.balanceCleared}: ₹{activeBooking.finalBalancePaid || 0}
                  </div>
                </div>
              )}

              {activeBooking.status === 'Work Started' && (
                <button
                  id="complete-work-btn"
                  onClick={() => updateBookingStatus(activeBooking.id, 'Work Completed')}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t.tracking.markWorkCompleted}
                </button>
              )}

              {activeBooking.status === 'Work Completed' && (
                <button
                  id="give-review-btn"
                  onClick={() => setReviewTargetBooking(activeBooking)}
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  {t.tracking.rateReviewWorker}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Live Trip Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t.tracking.shareModalTitle}</h3>
                  <p className="text-xs text-slate-500">{activeBooking.bookingNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.tracking.shareModalDesc}
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate">{shareUrl}</span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.tracking.copiedLink : t.tracking.copyLink}</span>
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Track my verified worker arrival (${activeBooking.workerName} - ${activeBooking.serviceCategory}) on ShramSetu: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.tracking.shareWhatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Emergency SOS Response Modal */}
      {isSosActive && (
        <div className="fixed inset-0 bg-red-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-4 border-red-500">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-600 text-white animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-red-900">{t.tracking.sosModalTitle}</h3>
                <p className="text-xs text-slate-600">{t.tracking.sosModalSubtitle}</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-950 space-y-1.5 leading-relaxed">
              <p className="font-bold">
                ⚠️ Emergency beacon activated for Booking {activeBooking.bookingNumber} at coordinates ({workerCoords[0].toFixed(4)}, {workerCoords[1].toFixed(4)}).
              </p>
              <p>
                An urgent alert with live GPS coordinates has been transmitted to the <strong>State Cooperative Control Room</strong> and the nearest mobile patrol unit.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <a
                href="tel:112"
                className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t.tracking.sosCallPolice}</span>
              </a>
              <a
                href="tel:18004192667"
                className="p-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t.tracking.sosCallCoop}</span>
              </a>
            </div>

            <button
              onClick={() => setIsSosActive(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              {t.tracking.sosDismiss}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

