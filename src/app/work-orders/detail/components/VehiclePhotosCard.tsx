"use client";

import {cn} from "@/app/cn";
import {Camera, ZoomIn} from "lucide-react";
import {useState} from "react";

type VehiclePhoto = {
  id: number;
  label: string;
  url?: string; // ✅ opcional, para imágenes reales
};

export default function VehiclePhotosCard({photos}: { photos: VehiclePhoto[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<VehiclePhoto | null>(null);

  const colors = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-green-400 to-green-600",
    "from-orange-400 to-orange-600"
  ];

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Camera className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Fotos del Vehículo
          </h3>
          <span className="ml-auto text-sm text-slate-500">
            {photos.length} fotos
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden",
                "border-2 border-slate-200 hover:border-blue-400",
                "transition-all group"
              )}
            >
              {photo.url ? (
                // ✅ Mostrar imagen real si existe
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                // ✅ Mostrar placeholder si no hay URL
                <div
                  className={cn(
                    "w-full h-full bg-gradient-to-br flex flex-col items-center justify-center",
                    colors[index % colors.length]
                  )}
                >
                  <Camera className="w-12 h-12 text-white/80 mb-2" />
                  <span className="text-white font-semibold text-sm">
                    {photo.label}
                  </span>
                </div>
              )}

              <div
                className={cn(
                  "absolute inset-0 bg-black/0 group-hover:bg-black/40",
                  "transition-all flex items-center justify-center"
                )}
              >
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden">
            {selectedPhoto.url ? (
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-24 h-24 text-white/50 mb-4" />
                <span className="text-white text-2xl font-semibold">
                  {selectedPhoto.label}
                </span>
                <span className="text-white/60 text-sm mt-2">
                  Foto #{selectedPhoto.id}
                </span>
              </div>
            )}

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
