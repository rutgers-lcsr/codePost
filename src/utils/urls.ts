export function getUrl(baseurl: string, path: string): URL | null {
    try {
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (!path.endsWith("/")) {
            path += "/";
        }
        if (!baseurl.endsWith("/")) {
            baseurl += "/";
        }
        const url = new URL(baseurl + path);

        return url;
    } catch (error) {
        return null;
    }
}
