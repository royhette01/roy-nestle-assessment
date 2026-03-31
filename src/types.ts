export type GenderCode = "M" | "F";

export type PetName = {
  id: string;
  title: string;
  definition: string;
  gender: GenderCode[];
  categories: string[];
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
};

export type FilterGroup = {
  id: string;
  label: string;
  categoryIds: string[];
};

export type CategoriesPayload = {
  data: Category[];
  filterGroups: FilterGroup[];
};
