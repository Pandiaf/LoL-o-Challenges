<script setup lang="ts">
const { data: champions, pending: pC, error: eC } = useChampions();
const { data: classes, pending: pCl, error: eCl } = useClasses();
const { data: types, pending: pT, error: eT } = useTypes();
const { data: regions, pending: pR, error: eR } = useRegions();

const pending = computed(() => pC.value || pCl.value || pT.value || pR.value);
const error = computed(() => eC.value || eCl.value || eT.value || eR.value);

const search = ref("");
const selectedClasses = ref<number[]>([]);
const selectedTypes = ref<number[]>([]);
const selectedRegions = ref<number[]>([]);

function toggle(list: number[], id: number) {
  const i = list.indexOf(id);
  if (i === -1) list.push(id);
  else list.splice(i, 1);
}

function reset() {
  selectedClasses.value = [];
  selectedTypes.value = [];
  selectedRegions.value = [];
  search.value = "";
}

const hasFilters = computed(
  () =>
    selectedClasses.value.length > 0 ||
    selectedTypes.value.length > 0 ||
    selectedRegions.value.length > 0 ||
    search.value.trim() !== ""
);

const classById = computed(
  () => new Map((classes.value ?? []).map((c) => [c.id, c]))
);
const typeById = computed(
  () => new Map((types.value ?? []).map((t) => [t.id, t]))
);
const regionById = computed(
  () => new Map((regions.value ?? []).map((r) => [r.id, r]))
);

// Types scindés en deux colonnes selon le nombre de joueurs requis
const typesThreePlus = computed(() =>
  (types.value ?? []).filter((t) => t.players_number === "3+")
);
const typesFive = computed(() =>
  (types.value ?? []).filter((t) => t.players_number !== "3+")
);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return (champions.value ?? [])
    .filter((champ) => {
      const matchName = !q || champ.name.toLowerCase().includes(q);
      const matchClass =
        selectedClasses.value.length === 0 ||
        selectedClasses.value.every((c) => champ.classes.includes(c));
      const matchType =
        selectedTypes.value.length === 0 ||
        selectedTypes.value.every((t) => champ.types.includes(t));
      const matchRegion =
        selectedRegions.value.length === 0 ||
        selectedRegions.value.every((r) => (champ.regions ?? []).includes(r));
      return matchName && matchClass && matchType && matchRegion;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
});

// --- Dark mode ---
const isDark = ref(false);

function applyTheme(dark: boolean) {
  isDark.value = dark;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("lolo-theme", dark ? "dark" : "light");
  }
}

function toggleTheme() {
  applyTheme(!isDark.value);
}

onMounted(() => {
  const stored =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("lolo-theme")
      : null;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored ? stored === "dark" : prefersDark);
});
</script>

<template>
  <div
    class="min-h-screen bg-white font-sans text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100"
  >
    <div class="mx-auto max-w-screen-2xl px-6 py-8 md:py-14">
      <header
        class="mb-8 flex items-center justify-between border-b border-slate-200 pb-6 dark:border-slate-800"
      >
        <h1 class="text-4xl font-extrabold tracking-tight md:text-5xl">
          LoLo Challenges
        </h1>

        <button
          type="button"
          class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-100 dark:hover:text-slate-100"
          :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
          @click="toggleTheme"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
            />
          </svg>
        </button>
      </header>

      <div
        v-if="error"
        class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 leading-relaxed text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
      >
        <strong class="font-semibold">Impossible de charger le roster.</strong>
        Vérifie que l'API répond sur
        <code
          class="rounded bg-red-100 px-1.5 py-0.5 font-mono text-sm dark:bg-red-900/60"
          >/api/champions</code
        >, puis recharge.
      </div>

      <div
        v-else
        class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)_220px]"
      >
        <aside class="flex flex-col gap-6 lg:sticky lg:top-6">
          <div>
            <label
              for="q"
              class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Recherche
            </label>
            <input
              id="q"
              v-model="search"
              type="search"
              placeholder="Nom d'un champion…"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-100 dark:focus:ring-slate-100/10"
            />
          </div>

          <section class="flex min-h-0 flex-col">
            <div class="mb-3 flex items-center gap-2">
              <h2
                class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Classes (5 joueurs)
              </h2>
              <span
                v-if="selectedClasses.length"
                class="grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-blue-600 px-1.5 text-[0.68rem] font-bold text-white dark:bg-blue-500"
              >
                {{ selectedClasses.length }}
              </span>
            </div>
            <div class="flex max-h-[40vh] flex-wrap gap-1.5 overflow-y-auto pr-1">
              <button
                v-for="c in classes"
                :key="c.id"
                type="button"
                :aria-pressed="selectedClasses.includes(c.id)"
                class="h-fit cursor-pointer rounded-full border px-3 py-1.5 text-[0.82rem] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                :class="
                  selectedClasses.includes(c.id)
                    ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-100'
                "
                @click="toggle(selectedClasses, c.id)"
              >
                {{ c.class_fr }}
              </button>
            </div>
          </section>

          <section class="flex min-h-0 flex-col">
            <div class="mb-3 flex items-center gap-2">
              <h2
                class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Régions (5 joueurs)
              </h2>
              <span
                v-if="selectedRegions.length"
                class="grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-emerald-600 px-1.5 text-[0.68rem] font-bold text-white dark:bg-emerald-500"
              >
                {{ selectedRegions.length }}
              </span>
            </div>
            <div class="flex max-h-[40vh] flex-wrap gap-1.5 overflow-y-auto pr-1">
              <button
                v-for="r in regions"
                :key="r.id"
                type="button"
                :aria-pressed="selectedRegions.includes(r.id)"
                class="h-fit cursor-pointer rounded-full border px-3 py-1.5 text-[0.82rem] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                :class="
                  selectedRegions.includes(r.id)
                    ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-100'
                "
                @click="toggle(selectedRegions, r.id)"
              >
                {{ r.region }}
              </button>
            </div>
          </section>
        </aside>

        <main class="order-first lg:order-none">
          <div class="mb-5">
            <p v-if="pending" class="text-sm text-slate-500 dark:text-slate-400">
              Chargement…
            </p>
            <p v-else class="text-sm text-slate-500 dark:text-slate-400">
              <strong class="text-base text-slate-900 dark:text-slate-100">{{
                filtered.length
              }}</strong>
              champion{{ filtered.length > 1 ? "s" : "" }}
              <span v-if="hasFilters">· filtré</span>
            </p>
          </div>

          <ul
            v-if="!pending"
            class="grid list-none grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3"
          >
            <li
              v-for="champ in filtered"
              :key="champ.id"
              class="rounded-xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-black/30"
            >
              <div class="mb-2.5 flex items-start justify-between gap-2">
                <span class="min-w-0 break-words text-base font-bold leading-tight">
                  {{ champ.name }}
                </span>
                <div class="flex shrink-0 flex-col items-end gap-1">
                  <div class="flex flex-wrap justify-end gap-1">
                    <span
                      v-for="c in champ.classes"
                      :key="'c' + c"
                      class="rounded-full bg-blue-50 px-2 py-0.5 text-[0.68rem] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                    >
                      {{ classById.get(c)?.class_fr ?? c }}
                    </span>
                  </div>
                  <div
                    v-if="(champ.regions ?? []).length"
                    class="flex flex-wrap justify-end gap-1"
                  >
                    <span
                      v-for="r in (champ.regions ?? [])"
                      :key="'r' + r"
                      class="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    >
                      {{ regionById.get(r)?.region ?? r }}
                    </span>
                  </div>
                  <span
                    v-if="!champ.classes.length && !(champ.regions ?? []).length"
                    class="text-[0.68rem] text-slate-400 dark:text-slate-600"
                  >
                    —
                  </span>
                </div>
              </div>

              <div
                class="flex flex-wrap gap-1 border-t border-slate-100 pt-2.5 dark:border-slate-800"
              >
                <span
                  v-for="t in champ.types"
                  :key="'t' + t"
                  class="whitespace-nowrap rounded-full bg-orange-100 px-1.5 py-px text-[0.6rem] font-semibold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
                >
                  {{ typeById.get(t)?.label_fr ?? t }}
                </span>
              </div>
            </li>
          </ul>

          <p
            v-if="!pending && filtered.length === 0"
            class="py-10 text-center text-slate-500 dark:text-slate-400"
          >
            Aucun champion ne correspond. Retire un filtre pour élargir.
          </p>
        </main>

        <aside class="flex flex-col gap-6 lg:sticky lg:top-6">
          <section class="flex min-h-0 flex-col">
            <div class="mb-3 flex items-center gap-2">
              <h2
                class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Types
              </h2>
              <span
                v-if="selectedTypes.length"
                class="grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-orange-600 px-1.5 text-[0.68rem] font-bold text-white dark:bg-orange-500"
              >
                {{ selectedTypes.length }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="flex min-w-0 flex-col gap-1.5">
                <span
                  class="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
                >
                  3+ joueurs
                </span>
                <button
                  v-for="t in typesThreePlus"
                  :key="t.id"
                  type="button"
                  :aria-pressed="selectedTypes.includes(t.id)"
                  class="cursor-pointer rounded-full border px-2.5 py-1.5 text-left text-[0.78rem] leading-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                  :class="
                    selectedTypes.includes(t.id)
                      ? 'border-orange-600 bg-orange-600 text-white dark:border-orange-500 dark:bg-orange-500'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-100'
                  "
                  @click="toggle(selectedTypes, t.id)"
                >
                  {{ t.label_fr }}
                </button>
              </div>

              <div class="flex min-w-0 flex-col gap-1.5">
                <span
                  class="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
                >
                  5 joueurs
                </span>
                <button
                  v-for="t in typesFive"
                  :key="t.id"
                  type="button"
                  :aria-pressed="selectedTypes.includes(t.id)"
                  class="cursor-pointer rounded-full border px-2.5 py-1.5 text-left text-[0.78rem] leading-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                  :class="
                    selectedTypes.includes(t.id)
                      ? 'border-orange-600 bg-orange-600 text-white dark:border-orange-500 dark:bg-orange-500'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-100'
                  "
                  @click="toggle(selectedTypes, t.id)"
                >
                  {{ t.label_fr }}
                </button>
              </div>
            </div>
          </section>

          <button
            type="button"
            :disabled="!hasFilters"
            class="text-left text-sm underline underline-offset-2 transition disabled:no-underline disabled:opacity-40"
            :class="
              hasFilters
                ? 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                : 'text-slate-500 dark:text-slate-500'
            "
            @click="reset"
          >
            Réinitialiser les filtres
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>