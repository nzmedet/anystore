export function isAssetStale(input: {
  sourceChanged: boolean;
  templateChanged: boolean;
  localeChanged: boolean;
}): boolean {
  return input.sourceChanged || input.templateChanged || input.localeChanged;
}
