import {Mail, Phone, MapPin, User} from "lucide-react";

type ClientInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export default function ClientInfoCard({client}: { client: ClientInfo }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Información del Cliente
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-slate-500 mb-1">Nombre Completo</p>
          <p className="text-slate-900 font-medium">
            {client.firstName} {client.lastName}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Mail className="w-4 h-4 text-slate-400 mt-1" />
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-slate-900">{client.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-slate-400 mt-1" />
          <div>
            <p className="text-sm text-slate-500">Teléfono</p>
            <p className="text-slate-900">{client.phoneNumber}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 mt-1" />
          <div>
            <p className="text-sm text-slate-500">Dirección</p>
            <p className="text-slate-900">{client.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
