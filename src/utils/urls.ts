export function getUrl(path: string): string | null {
    try {
        const url = new URL(path);
        return url.toString();
    } catch (error) {
        return null;
    }
}
