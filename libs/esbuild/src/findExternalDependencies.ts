export type DependencyAware = {
  dependencies?: Record<string, string>;
};

export const findExternalDependencies = (target: DependencyAware) => {
  const { dependencies } = target;
  const results: string[] = [];

  if (dependencies == null) {
    return results;
  }

  for (const [name, version] of Object.entries(dependencies)) {
    if (version !== "0.0.0") {
      results.push(name);
    }
  }

  return results;
};
