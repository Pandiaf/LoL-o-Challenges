import { classes, type ClassItem } from "~/data/classes";

export function useClasses() {
  return {
    data: ref<ClassItem[]>(classes),
    pending: ref(false),
    error: ref<unknown>(null),
  };
}