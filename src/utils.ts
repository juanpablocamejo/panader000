import { derived, Readable } from "svelte/store";

export const selectStore = (
  store: Readable<any[]>,
  textField: string
): Readable<any[]> => {
  return derived(store, (ls) =>
    ls.map((i) => ({ name: i[textField], value: i }))
  );
};
