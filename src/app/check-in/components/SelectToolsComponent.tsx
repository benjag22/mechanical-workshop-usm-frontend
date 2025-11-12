import { cn } from "@/app/cn";
import { useState, useEffect } from "react";
import api, {SingleToolResponse} from "@/api";
import { Check, Plus, X, Wrench, AlertCircle } from 'lucide-react';

type SelectedTool = {
  id?: number;
  name: string;
  isCustom: boolean;
}

type Props = {
  onToolsChange: (toolIds: number[], newTools: string[]) => void;
  selectedToolIds: number[];
  selectedNewTools: string[];
}

export default function SelectToolsComponent({ onToolsChange, selectedToolIds, selectedNewTools }: Props) {
  const [selectedTools, setSelectedTools] = useState<SelectedTool[]>([]);
  const [customTool, setCustomTool] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [apiTools, setApiTools] = useState<SingleToolResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTools() {
      try {
        setLoading(true);
        const response = await api.getAllTools();
        setApiTools(response.data || []);
      } catch (error) {
        console.error("Error loading tools:", error);
        setApiTools([]);
      } finally {
        setLoading(false);
      }
    }

    loadTools();
  }, []);

  useEffect(() => {
    const toolIds = selectedTools
      .filter(tool => !tool.isCustom && tool.id)
      .map(tool => tool.id!);

    const newTools = selectedTools
      .filter(tool => tool.isCustom)
      .map(tool => tool.name);

    onToolsChange(toolIds, newTools);
  }, [selectedTools, onToolsChange]);

  const handleToolToggle = (tool: SingleToolResponse | { name: string }, isCustom: boolean = false) => {
    const toolName = tool.name;
    const toolId = 'id' in tool ? tool.id : undefined;

    setSelectedTools(prev => {
      const exists = prev.find(t => t.name === toolName);
      if (exists) {
        return prev.filter(t => t.name !== toolName);
      } else {
        return [...prev, {
          id: toolId,
          name: toolName,
          isCustom
        }];
      }
    });
  };

  const handleAddCustomTool = () => {
    if (customTool.trim() && !selectedTools.find(tool => tool.name.toLowerCase() === customTool.trim().toLowerCase())) {
      handleToolToggle({ name: customTool.trim() }, true);
      setCustomTool("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustomTool = (toolName: string) => {
    setSelectedTools(prev => prev.filter(tool => tool.name !== toolName));
  };

  const isToolSelected = (toolName: string): boolean => {
    return selectedTools.some(tool => tool.name === toolName);
  };

  const getToolIcon = () => <Wrench size={18} className="text-slate-400" />;

  const customTools = selectedTools.filter(tool => tool.isCustom);
  const standardTools = selectedTools.filter(tool => !tool.isCustom);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Cargando herramientas...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-200 mb-2 flex items-center gap-2">
          {getToolIcon()}
          Herramientas y Equipos
        </h2>
        <p className="text-slate-400 text-sm">
          Selecciona las herramientas disponibles en el vehículo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-6">
        {apiTools.map((tool) => {
          const selected = isToolSelected(tool.name);
          return (
            <button
              key={tool.id}
              onClick={() => handleToolToggle(tool)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-200 text-left group",
                "hover:scale-[1.02] hover:shadow-lg",
                selected
                  ? "bg-slate-700/70 border-blue-500/50 shadow-md ring-1 ring-blue-500/30"
                  : "bg-slate-800/50 border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/50"
              )}
            >
              <div className="absolute top-3 right-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  selected
                    ? "bg-blue-500 border-blue-500"
                    : "border-slate-500 group-hover:border-slate-400"
                )}>
                  {selected && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
              <div className="pr-8">
                <h3 className={cn(
                  "font-medium text-sm transition-colors duration-200",
                  selected ? "text-slate-100" : "text-slate-300 group-hover:text-slate-200"
                )}>
                  {tool.name}
                </h3>
                <div className="mt-2">
                  <div className={cn(
                    "w-full h-1 rounded-full transition-all duration-200",
                    selected ? "bg-blue-500/60" : "bg-slate-600/40"
                  )} />
                </div>
              </div>
              <div className={cn(
                "absolute inset-0 rounded-lg transition-opacity duration-200 pointer-events-none",
                "bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100"
              )} />
            </button>
          );
        })}

        <button
          onClick={() => setShowCustomInput(true)}
          className={cn(
            "relative p-4 rounded-lg border-2 border-dashed transition-all duration-200",
            "border-slate-600/50 bg-slate-800/30 hover:border-blue-500/50 hover:bg-slate-700/30",
            "flex flex-col items-center justify-center text-center group min-h-[88px]"
          )}
        >
          <Plus size={20} className="text-slate-400 group-hover:text-blue-400 mb-1" />
          <span className="text-sm text-slate-400 group-hover:text-blue-400 font-medium">
                        Agregar otra
                    </span>
        </button>
      </div>

      {showCustomInput && (
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-200 mb-3">Agregar herramienta personalizada</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              placeholder="Nombre de la herramienta..."
              className={cn(
                "flex-1 px-3 py-2 rounded-md border text-sm",
                "bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              )}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTool()}
              autoFocus
            />
            <button
              onClick={handleAddCustomTool}
              disabled={!customTool.trim()}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Agregar
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomTool("");
              }}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                "bg-slate-600 text-slate-200 hover:bg-slate-700"
              )}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {customTools.length > 0 && (
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 mb-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Plus size={18} />
            Herramientas Adicionales
            <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                            {customTools.length}
                        </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customTools.map((tool, index) => (
              <div
                key={`${tool.name}-${index}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                  "bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Check size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm font-medium truncate">
                                        {tool.name}
                                    </span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full flex-shrink-0">
                                        Nueva
                                    </span>
                </div>

                <button
                  onClick={() => handleRemoveCustomTool(tool.name)}
                  className={cn(
                    "ml-2 p-1 rounded-md transition-all duration-200 flex-shrink-0",
                    "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  )}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTools.length > 0 && (
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            Resumen de Herramientas
            <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                            {selectedTools.length} total
                        </span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Herramientas estándar:</span>
              <span className="text-slate-200 font-medium">{standardTools.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Herramientas personalizadas:</span>
              <span className="text-slate-200 font-medium">{customTools.length}</span>
            </div>
          </div>
        </div>
      )}

      {selectedTools.length === 0 && (
        <div className="text-center py-8 bg-slate-800/30 rounded-lg border border-slate-700/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Wrench size={24} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">
            No hay herramientas seleccionadas
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Selecciona las herramientas disponibles en el vehículo
          </p>
        </div>
      )}
    </div>
  );
}
