# Access Topology Tree

An Angular 19 example that recreates a left-to-right network topology with ECharts.

The example demonstrates:

- a semantic status legend;
- per-node colors for online, offline, power outage, impaired, and unknown states;
- a persistent active-node state selected by clicking an end node;
- expandable and collapsible branches;
- responsive chart sizing with horizontal scrolling on smaller screens.

## Run locally

```bash
npm install
npm start
```

Then open the URL printed by the Angular development server.

## Production build

```bash
npm run build
```

## Key dependencies

- `@angular/core`: `~19.0.0`
- `ngx-echarts`: `^15.0.1`
- `echarts`: `^5.4.1`

The legend is rendered as accessible Angular markup because an ECharts legend represents
series, while this chart uses a single tree series and colors individual nodes by status.

# TopologyTree

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.27.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
