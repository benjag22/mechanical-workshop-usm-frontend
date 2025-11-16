'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/app/cn'
import api, { Mechanic } from "@/api"

// Tipo extendido para uso interno del componente
type MechanicSelection = Mechanic & {
  isLeader: boolean
  isExisting: boolean
}

type Props = {
  onMechanicsChange?: (mechanics: {
    existingIds: number[],
    newMechanics: { name: string, rut: string }[],
    leaderId?: number
  }) => void;
}

export default function SelectMechanics({ onMechanicsChange }: Props) {
  const [availableMechanics, setAvailableMechanics] = useState<Mechanic[]>([])
  const [selectedMechanics, setSelectedMechanics] = useState<MechanicSelection[]>([])
  const [newMechanic, setNewMechanic] = useState({ name: '', rut: '' })
  const [errors, setErrors] = useState({ name: '', rut: '' })
  const [isLoadingMechanics, setIsLoadingMechanics] = useState(true)
  const [showExistingList, setShowExistingList] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadMechanics() {
      try {
        setIsLoadingMechanics(true)
        const response = await api.getAllMechanics()
        if (response && response.data) {
          setAvailableMechanics(response.data)
        } else {
          setAvailableMechanics([])
        }
      } catch (error) {
        console.error('Error loading mechanics:', error)
        setAvailableMechanics([])
      } finally {
        setIsLoadingMechanics(false)
      }
    }
    loadMechanics()
  }, [])

  useEffect(() => {
    if (onMechanicsChange) {
      const existingIds = selectedMechanics
        .filter(m => m.isExisting)
        .map(m => m.id)

      const newMechanics = selectedMechanics
        .filter(m => !m.isExisting)
        .map(m => ({ name: m.name, rut: m.rut }))

      const leader = selectedMechanics.find(m => m.isLeader)

      onMechanicsChange({
        existingIds,
        newMechanics,
        leaderId: leader?.isExisting ? leader.id : undefined
      })
    }
  }, [selectedMechanics, onMechanicsChange])

  const validateRut = (rut: string): boolean => {
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '')
    const rutRegex = /^[0-9]{7,8}[0-9Kk]$/
    return rutRegex.test(cleanRut)
  }

  const formatRut = (rut: string): string => {
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '')
    if (cleanRut.length <= 1) return cleanRut

    const body = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1)

    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${formattedBody}-${dv}`
  }

  const isRutAlreadySelected = (rut: string): boolean => {
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '')
    return selectedMechanics.some(m =>
      m.rut.replace(/\./g, '').replace(/-/g, '') === cleanRut
    )
  }

  const handleSelectExistingMechanic = (mechanic: Mechanic) => {
    if (isRutAlreadySelected(mechanic.rut)) {
      alert('Este mecánico ya está seleccionado')
      return
    }

    const newSelectedMechanic: MechanicSelection = {
      ...mechanic,
      rut: formatRut(mechanic.rut),
      isLeader: selectedMechanics.length === 0,
      isExisting: true
    }

    setSelectedMechanics([...selectedMechanics, newSelectedMechanic])
    setShowExistingList(false)
    setSearchTerm('')
  }

  const handleAddNewMechanic = () => {
    const newErrors = { name: '', rut: '' }

    if (!newMechanic.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!newMechanic.rut.trim()) {
      newErrors.rut = 'El RUT es requerido'
    } else if (!validateRut(newMechanic.rut)) {
      newErrors.rut = 'RUT inválido'
    }

    if (isRutAlreadySelected(newMechanic.rut)) {
      newErrors.rut = 'Este RUT ya está registrado'
    }

    if (newErrors.name || newErrors.rut) {
      setErrors(newErrors)
      return
    }

    const mechanic: MechanicSelection = {
      id: Date.now(),
      name: newMechanic.name.trim(),
      rut: formatRut(newMechanic.rut),
      isLeader: selectedMechanics.length === 0,
      isExisting: false
    }

    setSelectedMechanics([...selectedMechanics, mechanic])
    setNewMechanic({ name: '', rut: '' })
    setErrors({ name: '', rut: '' })
  }

  const handleSetLeader = (id: number) => {
    setSelectedMechanics(selectedMechanics.map(mechanic => ({
      ...mechanic,
      isLeader: mechanic.id === id
    })))
  }

  const handleRemoveMechanic = (id: number) => {
    const updatedMechanics = selectedMechanics.filter(m => m.id !== id)
    if (updatedMechanics.length > 0 && !updatedMechanics.some(m => m.isLeader)) {
      updatedMechanics[0].isLeader = true
    }
    setSelectedMechanics(updatedMechanics)
  }

  const handleRutChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9Kk.-]/g, '')
    setNewMechanic({ ...newMechanic, rut: cleanValue })
  }

  const filteredAvailableMechanics = availableMechanics.filter(mechanic => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.rut.includes(searchTerm)
    const notSelected = !isRutAlreadySelected(mechanic.rut)
    return matchesSearch && notSelected
  })

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Seleccionar Mecánicos Existentes
          </h2>
          <button
            onClick={() => setShowExistingList(!showExistingList)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              showExistingList
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            {showExistingList ? 'Cerrar lista' : 'Ver mecánicos'}
          </button>
        </div>

        {showExistingList && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o RUT..."
                className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <svg className="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {isLoadingMechanics ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-400">Cargando mecánicos...</span>
              </div>
            ) : filteredAvailableMechanics.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No se encontraron mecánicos disponibles</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredAvailableMechanics.map((mechanic) => (
                  <div
                    key={mechanic.id}
                    onClick={() => handleSelectExistingMechanic(mechanic)}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:border-blue-500/50 hover:bg-slate-700/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-semibold text-blue-400">
                        {mechanic.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{mechanic.name}</p>
                        <p className="text-slate-400 text-sm">{formatRut(mechanic.rut)}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 shadow-lg">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Agregar Nuevo Mecánico
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={newMechanic.name}
              onChange={(e) => {
                setNewMechanic({ ...newMechanic, name: e.target.value })
                setErrors({ ...errors, name: '' })
              }}
              placeholder="Ej: Juan Pérez"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-slate-800/50 border text-white placeholder-slate-400",
                "focus:outline-none focus:ring-2 transition-all",
                errors.name
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
              )}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              RUT
            </label>
            <input
              type="text"
              value={newMechanic.rut}
              onChange={(e) => {
                handleRutChange(e.target.value)
                setErrors({ ...errors, rut: '' })
              }}
              placeholder="12.345.678-9"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-slate-800/50 border text-white placeholder-slate-400",
                "focus:outline-none focus:ring-2 transition-all",
                errors.rut
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
              )}
            />
            {errors.rut && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.rut}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleAddNewMechanic}
          className={cn(
            "w-full px-6 py-3 rounded-lg font-medium",
            "bg-blue-600 hover:bg-blue-700 text-white",
            "transition-all duration-200 transform hover:scale-[1.01]",
            "shadow-lg hover:shadow-xl",
            "flex items-center justify-center gap-2"
          )}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Mecánico Nuevo
        </button>
      </div>

      {selectedMechanics.length > 0 && (
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-600/50">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mecánicos Seleccionados ({selectedMechanics.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Líder
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/30">
              {selectedMechanics.map((mechanic) => (
                <tr
                  key={mechanic.id}
                  className={cn(
                    "transition-colors duration-150",
                    mechanic.isLeader
                      ? "bg-emerald-500/10 hover:bg-emerald-500/20"
                      : "hover:bg-slate-700/30"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm",
                        mechanic.isLeader
                          ? "bg-emerald-500 text-white"
                          : mechanic.isExisting
                            ? "bg-blue-500 text-white"
                            : "bg-slate-600 text-slate-200"
                      )}>
                        {mechanic.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{mechanic.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                    {mechanic.rut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      mechanic.isExisting
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}>
                      {mechanic.isExisting ? 'Existente' : 'Nuevo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {mechanic.isLeader ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-md">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Líder
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetLeader(mechanic.id)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          "bg-slate-600 hover:bg-blue-600 text-slate-200 hover:text-white",
                          "transition-all duration-200 transform hover:scale-105"
                        )}
                      >
                        Designar Líder
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleRemoveMechanic(mechanic.id)}
                      className={cn(
                        "p-2 rounded-lg",
                        "bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white",
                        "transition-all duration-200 transform hover:scale-110"
                      )}
                      title="Eliminar mecánico"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-600/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">
                Total: <span className="font-semibold text-white">{selectedMechanics.length}</span>
                {' '}(<span className="text-blue-400">{selectedMechanics.filter(m => m.isExisting).length} existentes</span>,{' '}
                <span className="text-amber-400">{selectedMechanics.filter(m => !m.isExisting).length} nuevos</span>)
              </span>
              <span className="text-slate-300">
                Líder: <span className="font-semibold text-emerald-400">
                  {selectedMechanics.find(m => m.isLeader)?.name || 'Ninguno'}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedMechanics.length === 0 && (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-12 border border-slate-600/30 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-slate-400 text-lg">No hay mecánicos seleccionados</p>
          <p className="text-slate-500 text-sm mt-2">Selecciona mecánicos existentes o agrega nuevos</p>
        </div>
      )}
    </div>
  )
}
