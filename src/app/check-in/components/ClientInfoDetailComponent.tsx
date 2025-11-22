"use client";

import { cn } from "@/app/cn";
import { useState, useEffect } from "react";
import { User, Mail, MapPin, Phone, IdCard } from "lucide-react";
import { CreateClientRequest } from "@/api";

type ClientInfoDetailComponentProps = {
  onClientDataChange: (clientData: CreateClientRequest) => void;
};

export default function ClientInfoDetailComponent({
                                                    onClientDataChange,
                                                  }: ClientInfoDetailComponentProps) {
  const [clientInfo, setClientInfo] = useState<CreateClientRequest>({
    firstName: "",
    lastName: "",
    rut: "",
    emailAddress: "",
    address: "",
    cellphoneNumber: "",
  });

  useEffect(() => {
    onClientDataChange(clientInfo);
  }, [clientInfo, onClientDataChange]);

  const handleInputChange = (field: keyof CreateClientRequest, value: string) => {
    setClientInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatRut = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();

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
    } else if (!cleaned.startsWith("+569")) {
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">
          Información del Cliente
        </h2>
        <p className="text-gray-400 text-sm lg:text-base">
          Complete los datos del cliente para continuar
        </p>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <InputField
              label="Nombre"
              icon={<User className="w-3 h-3 lg:w-4 lg:h-4" />}
              value={clientInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Ingrese el nombre"
            />
            <InputField
              label="Apellido"
              icon={<User className="w-3 h-3 lg:w-4 lg:h-4" />}
              value={clientInfo.lastName ?? ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Ingrese el apellido"
            />
          </div>

          <InputField
            label="RUT"
            icon={<IdCard className="w-3 h-3 lg:w-4 lg:h-4" />}
            value={clientInfo.rut}
            onChange={(e) => handleRutChange(e.target.value)}
            placeholder="12345678-9"
            maxLength={10}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <InputField
              label="Correo Electrónico"
              icon={<Mail className="w-3 h-3 lg:w-4 lg:h-4" />}
              type="email"
              value={clientInfo.emailAddress}
              onChange={(e) => handleInputChange("emailAddress", e.target.value)}
              placeholder="cliente@email.com"
            />
            <InputField
              label="Número de Teléfono"
              icon={<Phone className="w-3 h-3 lg:w-4 lg:h-4" />}
              type="tel"
              value={clientInfo.cellphoneNumber}
              onChange={(e) => handleCellphoneChange(e.target.value)}
              placeholder="+56912345678"
              maxLength={12}
            />
          </div>

          <div className="space-y-1 lg:space-y-2">
            <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
              Dirección
            </label>
            <textarea
              value={clientInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={cn(
                "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
                "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                "transition-all duration-200 hover:border-gray-600/50",
                "resize-none h-16 lg:h-24"
              )}
              placeholder="Ingrese la dirección completa"
            />
          </div>
        </div>
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
    <div className="space-y-1 lg:space-y-2">
      <label className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
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
          "w-full px-3 lg:px-4 py-2 lg:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg",
          "text-white placeholder-gray-500 backdrop-blur-sm text-sm lg:text-base",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
          "transition-all duration-200 hover:border-gray-600/50"
        )}
      />
    </div>
  );
}
