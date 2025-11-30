"use client";

import { cn } from "@/app/cn";
import { useState, useEffect } from "react";
import { User, Mail, MapPin, Phone, IdCard, Search } from "lucide-react";
import api, { CreateClientRequest, Client } from "@/api";

type ClientInfoDetailComponentProps = {
  onClientDataChange: (clientData: CreateClientRequest) => void;
  onExistingClientSelect: (clientId: number) => void;
};

async function getExistClients(set: (client: Client[]) => void) {
  try {
    const response = await api.getAllClients();
    if (response.data) {
      set(response.data);
    } else {
      set([]);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function ClientInfoDetailComponent({
                                                    onClientDataChange,
                                                    onExistingClientSelect,
                                                  }: ClientInfoDetailComponentProps) {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [existingClients, setExistingClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const [clientInfo, setClientInfo] = useState<CreateClientRequest>({
    firstName: "",
    rut: "",
    emailAddress: "",
    address: "",
    cellphoneNumber: "",
  });

  useEffect(() => {
    getExistClients(setExistingClients);
  }, []);

  useEffect(() => {
    if (mode === "new") {
      onClientDataChange(clientInfo);
    }
  }, [clientInfo, mode, onClientDataChange]);

  const handleModeChange = (newMode: "new" | "existing") => {
    setMode(newMode);
    if (newMode === "new") {
      setSelectedClientId(undefined);
      setClientInfo({
        firstName: "",
        rut: "",
        emailAddress: "",
        address: "",
        cellphoneNumber: "",
      });
    }
  };

  const handleExistingClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
    onExistingClientSelect(clientId);
  };

  const handleInputChange = (field: keyof CreateClientRequest, value: string) => {
    setClientInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatRut = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, ""). toUpperCase();

    if (cleaned.length === 0) return "";

    const rut = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    return dv ? `${rut}-${dv}` : rut;
  };

  const handleRutChange = (value: string) => {
    const formatted = formatRut(value);
    handleInputChange("rut", formatted);
  };

  const formatCellphone = (value: string) => {
    let cleaned = value.replace(/\D/g, ""); // solo dígitos

    if (cleaned.startsWith("569")) {
      cleaned = `+${cleaned}`;
    } else if (cleaned.startsWith("9")) {
      cleaned = `+56${cleaned}`;
    } else if (! cleaned.startsWith("+569")) {
      cleaned = `+569${cleaned}`;
    }

    if (cleaned.length > 12) {
      cleaned = cleaned.slice(0, 12);
    }

    return cleaned;
  };

  const handleCellphoneChange = (value: string) => {
    const formatted = formatCellphone(value);
    handleInputChange("cellphoneNumber", formatted);
  };

  const filteredClients = existingClients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client. firstName?.toLowerCase().includes(searchLower) ||
      client.lastName?.toLowerCase().includes(searchLower) ||
      client.rut?.toLowerCase().includes(searchLower) ||
      client.emailAddress?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full h-full flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
          Información del Cliente
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          Complete los datos del cliente para continuar
        </p>
      </div>

      <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => handleModeChange("new")}
          className={cn(
            "flex-1 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200",
            mode === "new"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50 hover:scale-105"
          )}
        >
          Nuevo Cliente
        </button>
        <button
          onClick={() => handleModeChange("existing")}
          className={cn(
            "flex-1 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200",
            mode === "existing"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50 hover:scale-105"
          )}
        >
          Cliente Existente
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {mode === "new" ? (
          <div className="w-full space-y-5 sm:space-y-6 lg:space-y-7 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <InputField
                label="Nombre"
                icon={<User className="w-5 h-5" />}
                value={clientInfo.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Ingrese el nombre"
              />
              <InputField
                label="Apellido"
                icon={<User className="w-5 h-5" />}
                value={clientInfo.lastName ??  ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Ingrese el apellido"
              />
            </div>

            <InputField
              label="RUT"
              icon={<IdCard className="w-5 h-5" />}
              value={clientInfo.rut}
              onChange={(e) => handleRutChange(e.target.value)}
              placeholder="12345678-9"
              maxLength={10}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <InputField
                label="Correo Electrónico"
                icon={<Mail className="w-5 h-5" />}
                type="email"
                value={clientInfo.emailAddress}
                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                placeholder="cliente@email.com"
              />
              <InputField
                label="Número de Teléfono"
                icon={<Phone className="w-5 h-5" />}
                type="tel"
                value={clientInfo.cellphoneNumber}
                onChange={(e) => handleCellphoneChange(e.target.value)}
                placeholder="+56912345678"
                maxLength={12}
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm sm:text-base font-semibold text-gray-300 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección
              </label>
              <textarea
                value={clientInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={cn(
                  "w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl",
                  "text-white placeholder-gray-500 backdrop-blur-sm text-base sm:text-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-gray-600/50",
                  "resize-none h-28 sm:h-32"
                )}
                placeholder="Ingrese la dirección completa"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col space-y-4 sm:space-y-5">
            <div className="flex-shrink-0 space-y-2 sm:space-y-3">
              <label className="text-sm sm:text-base font-semibold text-gray-300 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Cliente
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, apellido, RUT o email..."
                className={cn(
                  "w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl",
                  "text-white placeholder-gray-500 backdrop-blur-sm text-base sm:text-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                  "transition-all duration-200 hover:border-gray-600/50"
                )}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-3 sm:space-y-4 pb-4">
              {filteredClients.length === 0 ?  (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-gray-400">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-medium">No se encontraron clientes</p>
                  <p className="text-sm sm:text-base mt-2">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                filteredClients. map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleExistingClientSelect(client.id! )}
                    className={cn(
                      "w-full p-4 sm:p-5 rounded-xl border transition-all duration-200 text-left",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      selectedClientId === client.id
                        ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50"
                        : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-base sm:text-lg mb-2">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
                            <IdCard className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">RUT: {client.rut}</span>
                          </div>
                          {client.emailAddress && (
                            <div className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{client.emailAddress}</span>
                            </div>
                          )}
                          {client.cellphoneNumber && (
                            <div className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{client.cellphoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedClientId === client.id && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({
                      label,
                      icon,
                      value,
                      onChange,
                      placeholder,
                      type = "text",
                      maxLength,
                    }: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <label className="text-sm sm:text-base font-semibold text-gray-300 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          "w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl",
          "text-white placeholder-gray-500 backdrop-blur-sm text-base sm:text-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
          "transition-all duration-200 hover:border-gray-600/50",
          "min-h-[48px] sm:min-h-[56px]"
        )}
      />
    </div>
  );
}
