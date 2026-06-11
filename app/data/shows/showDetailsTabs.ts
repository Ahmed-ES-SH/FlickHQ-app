// //////////////////////////////////////////////////////////////////////////////
// Show details — tab definitions for the TV show detail page //////////////////
// //////////////////////////////////////////////////////////////////////////////

export interface TabDefinition {
  id: "overview" | "cast" | "seasons" | "similar" | "reviews";
  label: string;
}

export const showDetailsTabs: TabDefinition[] = [
  { id: "overview", label: "Overview" },
  { id: "cast", label: "Cast" },
  { id: "seasons", label: "Seasons" },
  { id: "similar", label: "Similar" },
  { id: "reviews", label: "Reviews" },
];
