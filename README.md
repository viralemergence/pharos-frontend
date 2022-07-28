<h1 align="center">
  Pharos Frontend
</h1>

This is the frontend repo for the PHAROS project.

This project requires you to have bit set up on your computer (one-time setup, works across projects):

1. [Make a bit.cloud account](https://bit.cloud/signup)

2. [Install Bit using these instructions](https://bit.dev/docs/getting-started/installing-bit/installing-bit)

3. Run `bit login` in your terminal

4. Make sure you have permissions as a developer on `@talus-analytics/@library` (ask Ryan)

5. Configure repository by running:

```
  npm config set '@talus-analytics:registry' https://node.bit.cloud
```

## 🚀 Quick start

1. Install packages:

```
yarn
```

2. Start dev server:

```
yarn start
```

By default, the app will try to connect to the api at `http://localhost:3000`.

However, any api url can be passed:

```
yarn start --api http://api.someplace:someport
```
