export const ENUM_TRANSLATIONS: Record<string, string> = {
    // Movement Types
    INCOME: "Ingreso",
    EXPENSE: "Egreso",
    ADJUSTMENT: "Ajuste",

    // Reference Types (Cash Register)
    DISPENSATION: "Retiro de Productos",
    SUBSCRIPTION: "Suscripción",
    MEMBERSHIP: "Membresía",
    MANUAL: "Manual",
    FEE: "Cuota",

    // General Statuses
    OPEN: "Abierto",
    CLOSED: "Cerrado",
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    PENDING: "Pendiente",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
    SUSPENDED: "Suspendido",

    // Roles
    ADMIN: "Administrador",
    CULTIVATOR: "Cultivador",
    BUDTENDER: "Budtender / Dispensador",
    PATIENT: "Paciente",
    DOCTOR: "Médico / Doctor",
    APPLICANT: "Postulante",

    // Reprocann Statuses
    EXPIRED: "Vencido",
    PENDING_RENEWAL: "Renovación Pendiente",
    PENDING_VALIDATION: "Pendiente de Validación",
    REJECTED: "Rechazado",

    // Strain Types
    INDICA: "Índica",
    SATIVA: "Sativa",
    HYBRID: "Híbrida",
    OTHER: "Otro",

    // Product Presentation & Units
    FLOWER: "Flor",
    OIL: "Aceite",
    EXTRACT: "Extracto",
    GRAMS: "Gramos",
    ML: "Mililitros",
    UNIT: "Unid.",

    // Lot Types & Statuses
    CULTIVATION: "Cultivo",
    PACKAGING: "Empaquetado",
    CREATED: "Creado",
    TESTING: "En Pruebas",
    RELEASED: "Liberado",
    BLOCKED: "Bloqueado",
    DEPLETED: "Agotado",

    // Payment Methods
    CASH: "Efectivo",
    CREDIT_CARD: "Tarjeta de Créd.",
    DEBIT_CARD: "Tarjeta de Déb.",
    BANK_TRANSFER: "Transferencia Bancaria",

    // Appointment Reasons
    REPROCAN_RENEWAL: "Renovación REPROCANN",
    MEDICAL_CONSULTATION: "Consulta Médica",
};

/**
 * Translates a given English enum string from the backend into a Spanish UI string.
 * Falls back to the original string if no translation is found.
 */
export function translateEnum(value: string | undefined | null): string {
    if (!value) return "";
    return ENUM_TRANSLATIONS[value] || value;
}
