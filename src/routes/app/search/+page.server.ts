import { getTreesCollection, getTreeSpeciesCollection } from "$lib/server/db/colTrees";
import type { TreeDocument } from "$lib/server/db/types";

export async function load({ url }) {
  const locationQuery = url.searchParams.get("location")?.toLowerCase().trim() ?? "";
  const speciesQuery = url.searchParams.get("species")?.toLowerCase().trim() ?? "";

  const treesCol = await getTreesCollection();
  const speciesCol = await getTreeSpeciesCollection();

  const speciesList = await speciesCol.find().toArray();

  const speciesMap = new Map(speciesList.map((s) => [s._id.toString(), s.commonName]));

  const matchingSpeciesIds = speciesQuery
    ? speciesList
        .filter((s) => s.commonName.toLowerCase().includes(speciesQuery))
        .map((s) => s._id.toString())
    : [];

  const query: any = {};

  if (locationQuery) {
    query.location = { $regex: locationQuery, $options: "i" };
  }

  if (matchingSpeciesIds.length > 0) {
    query.speciesId = { $in: matchingSpeciesIds };
  }

  const trees = await treesCol.find(query).toArray();

  const enriched = trees.map((tree) => ({
    ...tree,
    speciesName: speciesMap.get(tree.speciesId.toString()) ?? "Unknown"
  }));

  return {
    trees: enriched,
    queryLocation: locationQuery,
    querySpecies: speciesQuery
  };
}
