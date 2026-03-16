import { apiClient } from "./api-client";

export interface LegalTexts {
    application: { title: string; content: string };
    dataConsent: { title: string; content: string };
}

export type SignType = "application" | "consent";

export interface MembershipRequest {
    id: string;
    estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
    applicationDate: string;
    minutesBookEntry: string | null;
    memberNumber: string | null;
    organizationId: string;
    user: {
        id: string;
        fullName: string;
        documentNumber: string;
        email: string;
    };
}

export interface ApproveMembershipParams {
    minutesBookEntry: string;
    memberNumber: string;
    reprocanNumber?: string;
    reprocanExpiration?: string;
}

export interface PublicOrganization {
    id: string;
    name: string;
}

export interface MembershipApplicationParams {
    organizationId: string;
    fullName: string;
    documentNumber: string;
    email?: string;
    phone?: string;
    address?: string;
    reprocanNumber?: string;
    reprocanExpiration?: string;
    dailyDose?: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const mapStatus = (status: string): "PENDIENTE" | "APROBADO" | "RECHAZADO" => {
    switch (status) {
        case "APPROVED": return "APROBADO";
        case "REJECTED": return "RECHAZADO";
        default: return "PENDIENTE";
    }
};

const formatMembershipRequest = (r: any): MembershipRequest => ({
    ...r,
    estado: mapStatus(r.status)
});

// ── Service ─────────────────────────────────────────────────────────────────

export const membershipService = {
    async getPendingMemberships(token: string): Promise<MembershipRequest[]> {
        const data = await apiClient.get("/membership/pending", token);
        return data.map(formatMembershipRequest);
    },

    async approveMembership(id: string, params: ApproveMembershipParams, token: string): Promise<void> {
        await apiClient.post(`/membership/${id}/approve`, params, token);
    },

    async getPendingCount(token: string): Promise<{ count: number }> {
        return apiClient.get("/membership/pending-count", token);
    },

    async rejectMembership(id: string, token: string): Promise<void> {
        await apiClient.post(`/membership/${id}/reject`, undefined, token);
    },

    async downloadApplicationForm(id: string, token: string): Promise<void> {
        await apiClient.download(`/membership/application-form/${id}`, token, `solicitud-membresia-${id}.pdf`);
    },

    async downloadConsentForm(id: string, token: string): Promise<void> {
        await apiClient.download(`/membership/consent-form/${id}`, token, `consentimiento-ley-25326-${id}.pdf`);
    },

    async downloadRegisterBook(token: string): Promise<void> {
        await apiClient.download("/membership/register-book", token, "libro-registro-socios.pdf");
    },

    async downloadMyApplication(token: string): Promise<void> {
        await apiClient.download("/membership/my-application", token, "mi-solicitud-ingreso.pdf");
    },

    async downloadMyConsent(token: string): Promise<void> {
        await apiClient.download("/membership/my-consent", token, "mi-consentimiento-datos.pdf");
    },

    async getLegalTexts(token: string): Promise<LegalTexts> {
        return apiClient.get("/membership/legal-texts", token);
    },

    async signDocument(type: SignType, token: string): Promise<void> {
        await apiClient.post("/membership/sign", { type }, token);
    },

    // ── Endpoints públicos (sin auth) ────────────────────────────────────────

    async getPublicOrganizations(): Promise<PublicOrganization[]> {
        return apiClient.get("/public/organizations");
    },

    async apply(params: MembershipApplicationParams): Promise<void> {
        await apiClient.post("/public/patients/apply", params);
    },
};
