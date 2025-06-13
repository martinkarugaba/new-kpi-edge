"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  getCountries,
  getCountryById,
  addCountry,
  deleteCountry,
} from "../actions/countries";
import {
  getDistricts,
  addDistrict,
  deleteDistrict,
} from "../actions/districts";
import { getCounties, addCounty, deleteCounty } from "../actions/counties";
import {
  getSubCounties,
  addSubCounty,
  deleteSubCounty,
} from "../actions/subcounties";
import {
  getCities,
  createCity as addCity,
  deleteCity,
} from "../actions/cities";
import {
  getMunicipalities,
  createMunicipality,
  deleteMunicipality,
} from "../actions/municipalities";
import { getParishes, addParish, deleteParish } from "../actions/parishes";
import { getVillages, addVillage, deleteVillage } from "../actions/villages";
import { toast } from "sonner";

// Query keys for proper cache management
export const locationKeys = {
  all: ["locations"] as const,
  countries: () => [...locationKeys.all, "countries"] as const,
  country: (id: string) => [...locationKeys.countries(), id] as const,
  districts: (params?: { countryId?: string }) =>
    [...locationKeys.all, "districts", params] as const,
  counties: (params?: { districtId?: string }) =>
    [...locationKeys.all, "counties", params] as const,
  subCounties: (params?: { countyId?: string; districtId?: string }) =>
    [...locationKeys.all, "subcounties", params] as const,
  municipalities: (params?: {
    countryId?: string;
    districtId?: string;
    countyId?: string;
    subCountyId?: string;
  }) => [...locationKeys.all, "municipalities", params] as const,
  cities: (params?: { countryId?: string }) =>
    [...locationKeys.all, "cities", params] as const,
  parishes: (params?: { subCountyId?: string }) =>
    [...locationKeys.all, "parishes", params] as const,
  villages: (params?: { parishId?: string }) =>
    [...locationKeys.all, "villages", params] as const,
};

// Countries
// Static method to fetch country data directly
useCountries.fetchData = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const queryParams = params ? { ...params } : {};
    const result = await getCountries(queryParams);
    if (!result) {
      throw new Error("Failed to fetch countries - no response received");
    }
    return result;
  } catch (error) {
    console.error("Error fetching countries directly:", error);
    // Return a valid response with empty data to prevent undefined errors
    return {
      success: true,
      data: {
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
    };
  }
};

export function useCountries(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [
      ...locationKeys.countries(),
      {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || "",
      },
    ],
    queryFn: async () => {
      try {
        const queryParams = {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || "",
        };

        const result = await getCountries(queryParams);
        if (!result) {
          throw new Error("Failed to fetch countries - no response received");
        }

        // Prefetch next page if available
        if (result.success && result.data.pagination.hasNext) {
          const nextPage = (params?.page || 1) + 1;
          queryClient.prefetchQuery({
            queryKey: [
              ...locationKeys.countries(),
              {
                page: nextPage,
                limit: params?.limit || 10,
                search: params?.search || "",
              },
            ],
            queryFn: () => getCountries({ ...queryParams, page: nextPage }),
            staleTime: 60 * 1000, // 1 minute
          });
        }

        return result;
      } catch (error) {
        console.error("Error fetching countries:", error);
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || 10,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }
    },
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData, // Use keepPreviousData from TanStack Query v5
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

export function useCountry(id: string) {
  return useQuery({
    queryKey: locationKeys.country(id),
    queryFn: () => getCountryById(id),
    enabled: !!id,
  });
}

export function useAddCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCountry,
    onSuccess: () => {
      toast.success("Country added successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.countries() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add country: ${error.message}`);
    },
  });
}

// TODO: Implement when updateCountry action is available
// export function useUpdateCountry() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateCountry,
//     onSuccess: (_, variables) => {
//       toast.success("Country updated successfully");
//       queryClient.invalidateQueries({ queryKey: locationKeys.countries() });
//       queryClient.invalidateQueries({
//         queryKey: locationKeys.country(variables.id),
//       });
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to update country: ${error.message}`);
//     },
//   });
// }

export function useDeleteCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => {
      toast.success("Country deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.countries() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete country: ${error.message}`);
    },
  });
}

// Districts
export function useDistricts(params?: {
  countryId?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { countryId, page, limit, search } = params || {};

  return useQuery({
    queryKey: locationKeys.districts({ countryId }),
    queryFn: () =>
      getDistricts({
        countryId,
        pagination: { page, limit, search },
      }),
    // Always enable the query but provide fallback data
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAddDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDistrict,
    onSuccess: (_, variables) => {
      toast.success("District added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.districts({ countryId: variables.countryId }),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add district: ${error.message}`);
    },
  });
}

export function useDeleteDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDistrict,
    onSuccess: () => {
      toast.success("District deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.districts() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete district: ${error.message}`);
    },
  });
}

// Counties
export function useCounties(params?: { districtId?: string }) {
  return useQuery({
    queryKey: locationKeys.counties(params),
    queryFn: () => getCounties(params || {}),
    enabled: params?.districtId ? true : false,
  });
}

export function useAddCounty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCounty,
    onSuccess: (_, variables) => {
      toast.success("County added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.counties({ districtId: variables.district_id }),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add county: ${error.message}`);
    },
  });
}

export function useDeleteCounty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCounty,
    onSuccess: () => {
      toast.success("County deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.counties() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete county: ${error.message}`);
    },
  });
}

// Sub-Counties
export function useSubCounties(params?: {
  countyId?: string;
  districtId?: string;
}) {
  return useQuery({
    queryKey: locationKeys.subCounties(params),
    queryFn: () => getSubCounties(params || {}),
    enabled: params?.countyId || params?.districtId ? true : false,
  });
}

export function useAddSubCounty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSubCounty,
    onSuccess: (_, variables) => {
      toast.success("Sub-County added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.subCounties({
          districtId: variables.districtId,
        }),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add sub-county: ${error.message}`);
    },
  });
}

export function useDeleteSubCounty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubCounty,
    onSuccess: () => {
      toast.success("Sub-County deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.subCounties() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sub-county: ${error.message}`);
    },
  });
}

// Municipalities
export function useMunicipalities(params?: {
  countryId?: string;
  districtId?: string;
  countyId?: string;
  subCountyId?: string;
}) {
  return useQuery({
    queryKey: locationKeys.municipalities(params),
    queryFn: () => getMunicipalities(params || {}),
    enabled:
      params?.countryId ||
      params?.districtId ||
      params?.countyId ||
      params?.subCountyId
        ? true
        : false,
  });
}

export function useAddMunicipality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMunicipality,
    onSuccess: (_, variables) => {
      toast.success("Municipality added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.municipalities({
          subCountyId: variables.subCountyId,
        }),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add municipality: ${error.message}`);
    },
  });
}

export function useDeleteMunicipality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMunicipality,
    onSuccess: () => {
      toast.success("Municipality deleted successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.municipalities(),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete municipality: ${error.message}`);
    },
  });
}

// Cities
export function useCities(params?: { countryId?: string }) {
  return useQuery({
    queryKey: locationKeys.cities(params),
    queryFn: () => getCities(params?.countryId),
    enabled: !!params?.countryId,
  });
}

export function useAddCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      toast.success("City added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.cities(),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add city: ${error.message}`);
    },
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      toast.success("City deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.cities() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete city: ${error.message}`);
    },
  });
}

// Parishes
export function useParishes(params?: { subCountyId?: string }) {
  return useQuery({
    queryKey: locationKeys.parishes(params),
    queryFn: () => getParishes(params || {}),
    enabled: params?.subCountyId ? true : false,
  });
}

export function useAddParish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addParish,
    onSuccess: (_, variables) => {
      toast.success("Parish added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.parishes({
          subCountyId: variables.subCountyId,
        }),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add parish: ${error.message}`);
    },
  });
}

export function useDeleteParish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParish,
    onSuccess: () => {
      toast.success("Parish deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.parishes() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete parish: ${error.message}`);
    },
  });
}

// Villages
export function useVillages(params?: { parishId?: string }) {
  return useQuery({
    queryKey: locationKeys.villages(params),
    queryFn: () => getVillages(params || {}),
    enabled: params?.parishId ? true : false,
  });
}

export function useAddVillage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVillage,
    onSuccess: (_, variables) => {
      toast.success("Village added successfully");
      queryClient.invalidateQueries({
        queryKey: locationKeys.villages({ parishId: variables.parishId }),
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add village: ${error.message}`);
    },
  });
}

export function useDeleteVillage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVillage,
    onSuccess: () => {
      toast.success("Village deleted successfully");
      queryClient.invalidateQueries({ queryKey: locationKeys.villages() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete village: ${error.message}`);
    },
  });
}

// Search hooks for each location type with basic search functionality
export function useLocationSearch(searchTerm?: string) {
  return useQuery({
    queryKey: [...locationKeys.countries(), { search: searchTerm }],
    queryFn: async () => {
      try {
        const result = await getCountries({
          search: searchTerm,
          limit: 20, // Reasonable limit for search results
        });
        if (!result) {
          throw new Error("Failed to search countries");
        }
        return result;
      } catch (error) {
        console.error("Error searching countries:", error);
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }
    },
    enabled: searchTerm ? true : false,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useDistrictSearch(params?: {
  countryId?: string;
  searchTerm?: string;
}) {
  return useQuery({
    queryKey: [
      ...locationKeys.districts({ countryId: params?.countryId }),
      { search: params?.searchTerm },
    ],
    queryFn: async () => {
      try {
        const result = await getDistricts({
          countryId: params?.countryId,
          pagination: {
            search: params?.searchTerm,
            limit: 20,
          },
        });
        if (!result) {
          throw new Error("Failed to search districts");
        }
        return result;
      } catch (error) {
        console.error("Error searching districts:", error);
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }
    },
    enabled: params?.countryId && params?.searchTerm ? true : false,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useSubCountySearch(params?: {
  districtId?: string;
  searchTerm?: string;
}) {
  return useQuery({
    queryKey: [
      ...locationKeys.subCounties({ districtId: params?.districtId }),
      { search: params?.searchTerm },
    ],
    queryFn: async () => {
      try {
        const result = await getSubCounties({
          districtId: params?.districtId,
          pagination: {
            search: params?.searchTerm,
            limit: 20,
          },
        });
        if (!result) {
          throw new Error("Failed to search sub-counties");
        }
        return result;
      } catch (error) {
        console.error("Error searching sub-counties:", error);
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }
    },
    enabled: params?.districtId && params?.searchTerm ? true : false,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useParishSearch(params?: {
  subCountyId?: string;
  searchTerm?: string;
}) {
  return useQuery({
    queryKey: [
      ...locationKeys.parishes({ subCountyId: params?.subCountyId }),
      { search: params?.searchTerm },
    ],
    queryFn: async () => {
      try {
        const result = await getParishes({
          subCountyId: params?.subCountyId,
          pagination: {
            search: params?.searchTerm,
            limit: 20,
          },
        });
        if (!result) {
          throw new Error("Failed to search parishes");
        }
        return result;
      } catch (error) {
        console.error("Error searching parishes:", error);
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }
    },
    enabled: params?.subCountyId && params?.searchTerm ? true : false,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useVillageSearch(params?: {
  parishId?: string;
  searchTerm?: string;
}) {
  return useQuery({
    queryKey: [
      ...locationKeys.villages({ parishId: params?.parishId }),
      { search: params?.searchTerm },
    ],
    queryFn: async () => {
      try {
        const result = await getVillages({
          parishId: params?.parishId,
          pagination: {
            search: params?.searchTerm,
            limit: 20,
          },
        });
        if (!result) {
          throw new Error("Failed to search villages");
        }
        return result;
      } catch (error) {
        console.error("Error searching villages:", error);
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }
    },
    enabled: params?.parishId && params?.searchTerm ? true : false,
    staleTime: 30 * 1000, // 30 seconds
  });
}
