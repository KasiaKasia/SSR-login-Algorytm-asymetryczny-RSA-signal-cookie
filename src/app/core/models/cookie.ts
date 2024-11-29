export interface Cookie {
    getCookie(name: string): string | null;
    setCookie(name: string, value: string, options: { [key: string]: any }): void;
    deleteCookie(name: string): void;
}