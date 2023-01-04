# Kroki uruchomienia gry lokalnie:

1. Zainstalować wszelkie zależności

```
npm install --legacy-peer-deps
```

2. Uruchomić serwer lokalny

```
npx nx run-many --target=serve --projects=hypnos,hypnos-server
```

# zbudowanie wersji produkcyjnej

```
npx nx run-many --target=build --projects=hypnos,hypnos-server
```
