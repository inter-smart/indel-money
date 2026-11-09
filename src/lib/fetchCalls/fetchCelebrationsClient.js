import axios from "axios";
import api from "@/lib/api/axios";
import { celebrationsApiPath } from "@/components/features/celebrations/celebrationConstants";

// Browser-side page/tab fetch. Resolves to the API's `data` object.
export async function fetchCelebrationsClient(path, params, signal) {
  const { data } = await api.get(`/web/${celebrationsApiPath(path)}`, { params, signal });
  return data?.data;
}

export const isCancelledRequest = (error) => axios.isCancel(error);
