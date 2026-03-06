import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipService, ApproveMembershipParams, SignType } from "@/lib/services/membership";
import { useAuth } from "@/context/auth-context";

export const usePendingMemberships = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["pending-memberships"],
        queryFn: () => membershipService.getPendingMemberships(token || ""),
        enabled: !!token,
    });
};

export const useApproveMembership = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: ApproveMembershipParams }) =>
            membershipService.approveMembership(id, params, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pending-memberships"] });
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
        },
    });
};

export const useRejectMembership = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => membershipService.rejectMembership(id, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pending-memberships"] });
            queryClient.invalidateQueries({ queryKey: ["patients-list"] });
        },
    });
};

export const useLegalTexts = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["legal-texts"],
        queryFn: () => membershipService.getLegalTexts(token || ""),
        enabled: !!token,
    });
};

export const useSignDocument = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (type: SignType) => membershipService.signDocument(type, token || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
        },
    });
};
