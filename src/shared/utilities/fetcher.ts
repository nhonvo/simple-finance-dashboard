export async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    console.log(url)
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'API error');
    }

    return res.json();
}
