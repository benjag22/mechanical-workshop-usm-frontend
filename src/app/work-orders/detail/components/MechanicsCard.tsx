import {cn} from "@/app/cn";
import {Users, Crown} from "lucide-react";
import {GetMechanicWorkOrder} from "@/api";

export default function MechanicsCard({mechanics}: { mechanics: GetMechanicWorkOrder[] }) {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700"
  ];

  const sortedMechanics = [...mechanics].sort((a, b) => {
    if (a.isLeader && !b.isLeader) return -1;
    if (!a.isLeader && b.isLeader) return 1;
    return 0;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Users className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Mecánicos Asignados
        </h3>
        <span className="ml-auto text-sm font-medium text-slate-500">
          {mechanics.length}
        </span>
      </div>

      {mechanics.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay mecánicos asignados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedMechanics.map((mechanic, index) => (
            <div
              key={mechanic.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                mechanic.isLeader
                  ? "bg-amber-50 border-amber-200 ring-2 ring-amber-100"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm relative",
                mechanic.isLeader
                  ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                  : colors[index % colors.length]
              )}>
                {getInitials(mechanic.name)}
                {mechanic.isLeader && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-medium">
                    {mechanic.name}
                  </span>
                  {mechanic.isLeader && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                      Líder
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  RUT: {mechanic.rut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
