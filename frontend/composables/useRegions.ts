import { regions, type Region } from "~/data/regions";

export function useRegions() {
  return {
    data: ref<Region[]>(regions),
    pending: ref(false),
    error: ref<unknown>(null),
  };
}