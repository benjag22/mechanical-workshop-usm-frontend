import {cn} from "@/app/cn";
import {Users} from "lucide-react";

export default function MechanicsCard({mechanics}: { mechanics: string[] }) {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700"
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Users className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Mecánicos Asignados
        </h3>
      </div>

      <div className="space-y-2">
        {mechanics.map((mechanic, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
              colors[index % colors.length]
            )}>
              {mechanic.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-slate-900 font-medium">{mechanic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}