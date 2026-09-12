import { types, type TypeItem } from "~/data/types";

export function useTypes() {
  return {
    data: ref<TypeItem[]>(types),
    pending: ref(false),
    error: ref<unknown>(null),
  };
}