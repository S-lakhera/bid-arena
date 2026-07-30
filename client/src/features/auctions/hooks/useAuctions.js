import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionApi } from '../api/auctionApi';

// Hook to fetch all auctions, optionally filtered by status ('active', 'upcoming', 'completed')
export const useAuctions = (status = '') => {
  return useQuery({
    queryKey: ['auctions', status],
    queryFn: () => auctionApi.getAuctions(status),
  });
};

// Hook to fetch a single auction by ID
export const useAuction = (id) => {
  return useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionApi.getAuctionById(id),
    enabled: !!id, // Only run if ID is provided
  });
};

// Hook to create an auction
export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auctionApi.createAuction,
    onSuccess: () => {
      // Invalidate the auctions lists so they refetch
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};

// Hook to update an auction
export const useUpdateAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auctionApi.updateAuction,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
    },
  });
};

// Hook to delete an auction
export const useDeleteAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auctionApi.deleteAuction,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', variables] });
    },
  });
};
