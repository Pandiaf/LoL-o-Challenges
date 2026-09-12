import { champions, type Champion } from "~/data/champions";

export function useChampions() {
  return {
    data: ref<Champion[]>(champions),
    pending: ref(false),
    error: ref<unknown>(null),
  };
}