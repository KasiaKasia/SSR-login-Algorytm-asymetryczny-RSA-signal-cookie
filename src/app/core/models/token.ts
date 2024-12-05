export interface Token {
    readonly access_token?: string | null;
    readonly refresh_token?: string | null;
}

export interface TokenValidityDetails {
    //  iat? Kiedy token został utworzony (czas rozpoczęcia jego ważności).
    readonly iat?: number | null;
    // exp?: Kiedy token wygasa (czas zakończenia jego ważności).
    readonly exp?: number | null;
    isTokenExpired(): boolean;
    getTimeLeft(): number;
}


export class TokenManager implements TokenValidityDetails {
    readonly iat: number | null;
    readonly exp: number | null;

    constructor(iat?: number | null, exp?: number | null) {
        this.iat = iat || null;
        this.exp = exp || null;
    }


    /**
     * Sprawdza, czy token jest wygasły.
     * @returns `true` jeśli token wygasł, `false` w przeciwnym razie.
     */
    isTokenExpired(): boolean {
        if (!this.exp) {
            console.error("Expiration time (exp) is not available.");
            return true; // Jeśli brak `exp`, traktuj token jako wygasły.
        }

        const currentTime = Math.floor(Date.now() / 1000); // Aktualny czas w sekundach
        return currentTime >= this.exp;
    }

    /**
     * Oblicza czas pozostały do wygaśnięcia tokena.
     * @returns Liczba sekund do wygaśnięcia tokena lub `-1`, jeśli brak danych.
     */
    getTimeLeft(): number {
        if (!this.exp) {
            console.error("Expiration time (exp) is not available.");
            return -1; // Zwróć -1, jeśli brak danych.
        }

        const currentTime = Math.floor(Date.now() / 1000);
        return this.exp - currentTime;
    }
}