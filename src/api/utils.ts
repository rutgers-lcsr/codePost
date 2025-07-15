export function getQueryParams(params = {}): Record<string, string> {
    const results = new Map<string, string>();
    for (const [key, value] of Object.entries<any>(params)) {
        results.set(key, value.toString());
    }
    return Object.fromEntries(results);
}
