'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Generic hook factory for admin data
export function useAdminData<T>(
    key: string[],
    fetcher: () => Promise<T>,
    options = {}
) {
    return useQuery({
        queryKey: key,
        queryFn: fetcher,
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    })
}

// Generic mutation hook
export function useAdminMutation<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: {
        onSuccess?: (data: TData) => void
        invalidateKeys?: string[][]
    } = {}
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,
        onSuccess: (data) => {
            // Invalidate related queries
            if (options.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key })
                })
            }
            options.onSuccess?.(data)
        },
    })
}
