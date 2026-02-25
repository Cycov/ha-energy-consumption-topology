# Energy Consumption Topology

A Home Assistant Lovelace custom card that displays your energy consumption as a **vertical tree topology** with animated power-flow bubbles.

![demo screenshot](screenshot.png)

## Features

- **Vertical tree layout** - root (Grid) at the top, up to 4 child layers below
- **Animated bubbles** flowing along Bézier connections, speed proportional to power consumption
- **Per-node configuration** - custom name, icon, colour, and HA sensor entity
- **Responsive** - card width stretches to fit the widest layer
- **Validation** - clear error messages when the YAML config is invalid (duplicate IDs, missing parent, wrong layer, etc.)
- **HACS-compatible** - one-click install from the Home Assistant Community Store

---

## Installation

### HACS (recommended)

1. Open **HACS → Frontend** in your Home Assistant instance.
2. Click the **three-dot menu** (⋮) → **Custom repositories**.
3. Add the repository URL:
   ```
   https://github.com/Cycov/energy-consumption-topology
   ```
   Category: **Lovelace**.
4. Click **Install**.
5. **Refresh your browser** (hard-refresh / `Ctrl+Shift+R`).

### Manual

1. Download `energy-consumption-topology.js` from the [latest release](https://github.com/Cycov/energy-consumption-topology/releases/latest).
2. Copy the file to your Home Assistant `config/www/` directory.
3. Add the resource in **Settings → Dashboards → Resources** (or in your `configuration.yaml`):

   ```yaml
   lovelace:
     resources:
       - url: /local/energy-consumption-topology.js
         type: module
   ```

4. Restart Home Assistant and **hard-refresh** your browser.

---

## Configuration

Add the card to a dashboard view:

```yaml
type: custom:energy-consumption-topology

bubbles:
  min-speed:
    power-equivalent: 100W
    value: 10%
  max-speed:
    power-equivalent: 5000W
    value: 100%

root:
  id: grid
  entity: sensor.shellyabcdef01_pm_0
  name: Grid
  color: red
  icon: mdi:transmission-tower

layer0:
  - entity: sensor.shellyabcdef01_pm_1
    id: primary-rail
    parent: grid
    name: Primary
    color: blue
    icon: mdi:lightning-bolt
  - entity: sensor.shellyabcdef02_pm_0
    id: kitchen
    parent: grid
    name: Kitchen
  - entity: sensor.shellyabcdef02_pm_1
    id: toilet
    parent: grid
    name: Toilet
  - entity: sensor.shellyabcdef03_pm_0
    id: basement
    parent: grid
    name: Basement
  - entity: sensor.shellyabcdef03_pm_1
    id: light-strips
    parent: grid
    name: Strips

layer1:
  - entity: sensor.helper_ligh_sum
    id: lights
    parent: primary-rail
    name: Lights

layer2:
  - entity: sensor.shellyabcdef01_prodimmer_0
    id: light1
    parent: lights
    name: Bedroom light
  - entity: sensor.shellyabcdef01_prodimmer_1
    id: light2
    parent: lights
    name: Some light 2
```

### Node options

| Option   | Required | Default                          | Description                                   |
|----------|----------|----------------------------------|-----------------------------------------------|
| `id`     | **yes**  | -                                | Unique identifier (must not be duplicated)     |
| `entity` | **yes**  | -                                | Home Assistant `sensor.*` entity ID            |
| `parent` | **yes*** | -                                | `id` of a node **in the previous layer** (or root for layer0) |
| `name`   | no       | entity name without `sensor.`    | Display label above the node circle           |
| `icon`   | no       | `mdi:lightning-bolt`             | MDI icon shown inside the circle              |
| `color`  | no       | assigned in order from palette   | Circle border & bubble colour (cycles through 12 built-in colours) |
| `type`   | no       | -                                | Set to `light` to auto-switch icon between `mdi:lightbulb-on` (power > 0) and `mdi:lightbulb` (off). A node of type `other` will not require an entity and instead get the value by substracting the sum of it's siblings from the root (WIP) |

\* `parent` is not used on the `root` node.

### Bubble speed options

| Path                              | Default | Description                                                          |
|-----------------------------------|---------|----------------------------------------------------------------------|
| `bubbles.min-speed.power-equivalent` | `100W`  | Power value that maps to the slowest bubble speed                    |
| `bubbles.min-speed.value`         | `10%`   | Minimum animation speed (percentage of fastest)                      |
| `bubbles.max-speed.power-equivalent` | `5000W` | Power value that maps to the fastest bubble speed                    |
| `bubbles.max-speed.value`         | `100%`  | Maximum animation speed                                              |

### Validation rules

The card shows an error banner if any of the following are violated:

- `id` is missing or duplicated across all layers
- `entity` is missing on any node
- `parent` is missing on any non-root node
- `parent` references an `id` that does **not** exist in the immediately preceding layer
- A maximum of **4 child layers** (`layer0` – `layer3`) is supported; extra keys are ignored
- Empty layers do not contribute to card height

---

## Layers

The topology supports up to **5 levels** total:

| Level  | Key      | Description          |
|--------|----------|----------------------|
| Root   | `root`   | Single top-level node (e.g. Grid) |
| Layer 0 | `layer0` | Direct children of root |
| Layer 1 | `layer1` | Children of layer0 nodes |
| Layer 2 | `layer2` | Children of layer1 nodes |
| Layer 3 | `layer3` | Children of layer2 nodes |

Empty layers are simply skipped in the visual output.

---

## Development

```bash
# Clone & install
git clone https://github.com/Cycov/energy-consumption-topology.git
cd energy-consumption-topology
npm install

# Dev build (watch mode)
npm run watch

# Production build
npm run build
```

The built file is placed in `dist/energy-consumption-topology.js`.

Open `demo.html` in a browser to preview the card with hard-coded fake sensor data - no Home Assistant instance required.

---

## License

MIT © 2026
