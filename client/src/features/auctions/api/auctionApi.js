import api from '@/lib/axios';

export const auctionApi = {
  // Get all auctions (optional status query parameter: active, upcoming, completed)
  getAuctions: async (status = '') => {
    const url = status ? `/auctions?status=${status}` : '/auctions';
    const response = await api.get(url);
    return response.data;
  },

  // Get a single auction by ID
  getAuctionById: async (id) => {
    const response = await api.get(`/auctions/${id}`);
    return response.data;
  },

  // Create a new auction
  createAuction: async (auctionData) => {
    const response = await api.post('/auctions', auctionData);
    return response.data;
  },

  // Update an auction
  updateAuction: async ({ id, auctionData }) => {
    const response = await api.patch(`/auctions/${id}`, auctionData);
    return response.data;
  },

  // Delete an auction
  deleteAuction: async (id) => {
    const response = await api.delete(`/auctions/${id}`);
    return response.data;
  }
};
