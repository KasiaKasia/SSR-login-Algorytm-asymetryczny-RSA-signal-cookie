# LoginSsrSignals


## Steps to run the application using SSR

1. Clone the repository:

git clone https://github.com/KasiaKasia/Angular-v18-SSR.git

2. In the project directory, run the following commands:

- `npm i`
- `npm run watch`
- `npm run serve:ssr:invoice-generator`

3. Next, open a web browser and navigate to the following address: http://localhost:5000



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# TOKEN DOSTEPU 
## Algorytm asymetryczny (np. Algorytm Rivesta-Shamira-Adlemana (RSA) )

## Jak działa?
Używa pary kluczy: publicznego (do szyfrowania) i prywatnego (do deszyfrowania).

## Klucz PUBLICZNY 
może być udostępniany, 

## Klucz PRYWATNY  
jest przechowywany w bezpiecznym miejscu na serwerze.

## Kiedy stosować?
Zastosowałam algorytm asymetryczny ponieważ jest przeznaczony dla rozproszonych systemów przekazujących token.
Przy integracjach z zewnętrznymi systemami, które muszą zaszyfrować dane bez możliwości ich odszyfrowania.

## Zalety:
Wyższe bezpieczeństwo w systemach rozproszonych.
Klucz prywatny nie musi być udostępniany innym usługom.

## Róznice Symetryczny a Asymetryczny
# Symetryczny
Używa 1 klucza Używany zarówno do szyfrowania, jak i odszyfrowywania danych
## Asymetryczny
Używa 2 kulycz prywatnego (używany do odszyfrowywania danych i powinien być przechowywany na serwerze ) i publicznego (używany do szyfrowania danych i może być udostępniany publicznie)
## Asymetryczny to:

- RSA Algorytm Rivesta-Shamira-Adlemana  
- ECC Elliptic Curve Cryptography 

## Generowanie kluczy
W katalogu: `login-ssr-signals\src\environments` należy wykonać poniższe polecenie 
```
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key

```
Powyższe polecenia wygenerują dwa pliki  `private.key` i `public.key`