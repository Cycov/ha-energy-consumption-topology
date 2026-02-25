import {
  LitElement,
  html,
  css,
  svg,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const CARD_VERSION = "1.2.0";
const MAX_LAYERS = 4; // layer0 … layer3
const SVG_CONNECTOR_HEIGHT = 80; // px - height of the bezier zone between rows

const DEFAULT_ICON = "mdi:lightning-bolt";
const COLOR_PALETTE = [
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
  "#e91e63",
  "#8bc34a",
  "#ff5722",
  "#3f51b5",
  "#009688",
  "#ffc107",
  "#795548",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/** Map a power value (W) to a speed factor 0‥1 using the bubble config. */
function powerToSpeed(power, bubbleCfg) {
  const minP = bubbleCfg.minPower;
  const maxP = bubbleCfg.maxPower;
  const minS = bubbleCfg.minSpeed;
  const maxS = bubbleCfg.maxSpeed;
  if (maxP <= minP) return maxS;
  const t = clamp((Math.abs(power) - minP) / (maxP - minP), 0, 1);
  return minS + t * (maxS - minS);
}

function parsePowerEquivalent(str) {
  if (typeof str === "number") return str;
  if (!str) return 0;
  const s = String(str).trim().toLowerCase();
  const num = parseFloat(s);
  if (s.endsWith("kw")) return num * 1000;
  return num; // assume W
}

function parsePercent(str) {
  if (typeof str === "number") return str;
  if (!str) return 0;
  return parseFloat(String(str)) / 100;
}

/** Resolve the icon for a node, supporting type:"light" dynamic icons. */
function resolveIcon(node, power) {
  if (node.type === "light") {
    const p = power !== null && !isNaN(power) ? Math.abs(Number(power)) : 0;
    return p > 0 ? "mdi:lightbulb-on" : "mdi:lightbulb";
  }
  if (node.type === "other") {
    return node.icon || "mdi:dots-horizontal";
  }
  return node.icon || DEFAULT_ICON;
}

/** Safely parse a numeric power value; returns 0 for unavailable/NaN. */
function safePower(val) {
  if (val === null || val === undefined) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/* ------------------------------------------------------------------ */
/*  Card                                                              */
/* ------------------------------------------------------------------ */

class EnergyConsumptionTopology extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _containerWidth: { state: true },
    };
  }

  constructor() {
    super();
    this._containerWidth = 0;
    this._ro = null;
  }

  /* ---------- life-cycle ---------- */

  setConfig(config) {
    if (!config.root) throw new Error("You must define a root node");
    this._config = config;
    this._errors = [];
    this._buildTree();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupResizeObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
  }

  firstUpdated() {
    this._setupResizeObserver();
  }

  _setupResizeObserver() {
    if (this._ro) return; // already set up
    const target = this.shadowRoot && this.shadowRoot.querySelector(".card-content");
    if (!target) return;
    this._ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0 && w !== this._containerWidth) {
          this._containerWidth = w;
        }
      }
    });
    this._ro.observe(target);
  }

  updated() {
    // Retry observer attachment if it wasn't ready at connectedCallback
    if (!this._ro) this._setupResizeObserver();
  }

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return {
      root: {
        id: "grid",
        entity: "sensor.grid_power",
        name: "Grid",
        color: "red",
        icon: "mdi:transmission-tower",
      },
      layer0: [
        {
          entity: "sensor.load_power",
          id: "load",
          parent: "grid",
          name: "Load",
        },
      ],
    };
  }

  /* ---------- tree building & validation ---------- */

  _buildTree() {
    this._errors = [];
    const cfg = this._config;

    /* Deterministic colour counter — resets every time config is parsed.
       The first node without an explicit colour gets COLOR_PALETTE[0],
       the second gets COLOR_PALETTE[1], etc., wrapping around. */
    let colorIndex = 0;
    const pickColor = () => {
      const c = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
      colorIndex++;
      return c;
    };

    /* --- bubble config --- */
    const bub = cfg.bubbles || {};
    const minSpd = bub["min-speed"] || {};
    const maxSpd = bub["max-speed"] || {};
    this._bubbleCfg = {
      minPower: parsePowerEquivalent(minSpd["power-equivalent"] || "100W"),
      maxPower: parsePowerEquivalent(maxSpd["power-equivalent"] || "5000W"),
      minSpeed: parsePercent(minSpd.value || "10%"),
      maxSpeed: parsePercent(maxSpd.value || "100%"),
    };

    /* --- root --- */
    const root = cfg.root;
    if (!root.id) this._errors.push("Root node is missing 'id'");
    if (!root.entity) this._errors.push("Root node is missing 'entity'");

    const ids = new Set();
    if (root.id) ids.add(root.id);

    this._root = {
      ...root,
      icon: root.icon || DEFAULT_ICON,
      color: root.color || pickColor(),
      name:
        root.name ||
        (root.entity ? root.entity.replace(/^sensor\./, "") : "Root"),
      type: root.type || null,
      layer: -1,
    };

    /* --- layers --- */
    this._layers = [];
    let previousIds = new Set([this._root.id]);

    for (let li = 0; li < MAX_LAYERS; li++) {
      const key = `layer${li}`;
      const raw = cfg[key];
      if (!raw || !Array.isArray(raw) || raw.length === 0) {
        this._layers.push([]);
        continue;
      }
      const layerNodes = [];
      const currentLayerIds = new Set();
      let otherCount = 0;
      for (const n of raw) {
        const isOther = n.type === "other";
        if (!n.id) {
          this._errors.push(`Node in ${key} is missing 'id'`);
          continue;
        }
        if (ids.has(n.id)) {
          this._errors.push(`Duplicate id '${n.id}' in ${key}`);
          continue;
        }
        if (!isOther && !n.entity) {
          this._errors.push(`Node '${n.id}' is missing 'entity'`);
          continue;
        }
        if (!n.parent) {
          this._errors.push(`Node '${n.id}' is missing 'parent'`);
          continue;
        }
        if (!previousIds.has(n.parent)) {
          this._errors.push(
            `Node '${n.id}' references parent '${n.parent}' which is not in the previous layer`
          );
          continue;
        }
        if (isOther) {
          otherCount++;
          if (otherCount > 1) {
            this._errors.push(
              `Only one node of type 'other' is allowed per layer (${key})`
            );
            continue;
          }
        }

        ids.add(n.id);
        currentLayerIds.add(n.id);
        const defaultName = isOther
          ? (n.name || "Other")
          : (n.name || n.entity.replace(/^sensor\./, ""));
        layerNodes.push({
          ...n,
          icon: n.icon || (isOther ? "mdi:dots-horizontal" : DEFAULT_ICON),
          color: n.color || pickColor(),
          name: defaultName,
          type: n.type || null,
          layer: li,
        });
      }
      this._layers.push(layerNodes);
      if (currentLayerIds.size > 0) {
        previousIds = currentLayerIds;
      }
    }

    /* id → node map */
    this._nodeMap = new Map();
    this._nodeMap.set(this._root.id, this._root);
    for (const layer of this._layers) {
      for (const n of layer) {
        this._nodeMap.set(n.id, n);
      }
    }
  }

  /* ---------- rendering ---------- */

  render() {
    if (this._errors && this._errors.length > 0) {
      return html`
        <ha-card>
          <div class="errors">
            <h3>Configuration errors</h3>
            <ul>
              ${this._errors.map((e) => html`<li>${e}</li>`)}
            </ul>
          </div>
        </ha-card>
      `;
    }

    const visibleLayers = this._layers
      ? this._layers.filter((l) => l.length > 0)
      : [];

    return html`
      <ha-card>
        <div class="card-content">
          ${this._root ? this._renderTopology(visibleLayers) : ""}
        </div>
      </ha-card>
    `;
  }

  _getStateValue(entity) {
    if (!this.hass || !this.hass.states[entity]) return null;
    return this.hass.states[entity].state;
  }

  _formatPower(val) {
    if (val === null || val === undefined || isNaN(val)) return "-- W";
    const n = Number(val);
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)} kW`;
    return `${Math.round(n)} W`;
  }

  /**
   * Get the power value for a node.
   * For type:"other" nodes the value is computed as:
   *   parent_power − sum(sibling_powers)
   * where siblings are all non-"other" nodes sharing the same parent.
   */
  _getNodePower(node) {
    if (node.type === "other") {
      const parentNode = this._nodeMap.get(node.parent);
      if (!parentNode) return 0;
      const parentPower = safePower(this._getNodePower(parentNode));
      // Find siblings: same layer, same parent, not "other"
      const layer = this._layers[node.layer] || [];
      let siblingsSum = 0;
      for (const sib of layer) {
        if (sib.type === "other" || sib.parent !== node.parent) continue;
        siblingsSum += safePower(this._getNodePower(sib));
      }
      const remainder = parentPower - siblingsSum;
      return remainder > 0 ? remainder : 0;
    }
    // Normal node: read from hass
    const raw = this._getStateValue(node.entity);
    return raw !== null ? safePower(raw) : null;
  }

  /** Open the HA more-info dialog for the given entity. */
  _fireMoreInfo(entity) {
    const event = new CustomEvent("hass-more-info", {
      detail: { entityId: entity },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _renderTopology(visibleLayers) {
    const allRows = [[this._root], ...visibleLayers];

    const parts = [];
    for (let r = 0; r < allRows.length; r++) {
      parts.push(this._renderRow(allRows[r], r));
      if (r < allRows.length - 1) {
        parts.push(this._renderConnectors(allRows[r], allRows[r + 1], r));
      }
    }
    return html`<div class="topology">${parts}</div>`;
  }

  _renderRow(nodes, rowIndex) {
    return html`
      <div class="row" data-row="${rowIndex}">
        ${nodes.map((n) => this._renderNode(n))}
      </div>
    `;
  }

  _renderNode(node) {
    const powerVal = this._getNodePower(node);
    const power = this._formatPower(powerVal);
    const icon = resolveIcon(node, powerVal);
    const hasEntity = !!node.entity;
    return html`
      <div class="node-wrapper">
        <div class="node-name">${node.name}</div>
        <div
          class="node-circle ${hasEntity ? 'clickable' : ''}"
          style="border-color: ${node.color};"
          @click=${hasEntity ? () => this._fireMoreInfo(node.entity) : undefined}
        >
          <ha-icon .icon=${icon} style="color: ${node.color};"></ha-icon>
          <span class="node-power">${power}</span>
        </div>
      </div>
    `;
  }

  /* ---------------------------------------------------------------- */
  /*  SVG connectors (pixel-accurate viewBox – no distortion)         */
  /* ---------------------------------------------------------------- */

  _renderConnectors(parentRow, childRow, pairIndex) {
    /*
     * Previous approach used viewBox="0 0 100 100" with
     * preserveAspectRatio="none", which mapped a *square* coordinate
     * space onto a wide-and-short rectangle — stretching strokes into
     * rectangles and circles into ovals.
     *
     * Fix: measure the actual pixel width of the container
     * (via ResizeObserver) and set `viewBox="0 0 <width> <height>"`
     * so the coordinate system is 1:1 with screen pixels.
     */
    const w = this._containerWidth || 400;
    const h = SVG_CONNECTOR_HEIGHT;
    const parentCount = parentRow.length;
    const childCount = childRow.length;

    /* Centre-x of node `idx` in a row of `total`.
       Matches CSS `justify-content: space-around`. */
    const cx = (idx, total) => ((idx + 0.5) / total) * w;

    const lines = [];
    for (let ci = 0; ci < childCount; ci++) {
      const child = childRow[ci];
      const parentNode = this._nodeMap.get(child.parent);
      if (!parentNode) continue;
      const pi = parentRow.indexOf(parentNode);
      if (pi === -1) continue;

      const x1 = cx(pi, parentCount);
      const x2 = cx(ci, childCount);

      /* Bézier control points – gives a smooth S-curve */
      const cy1 = h * 0.4;
      const cy2 = h * 0.6;

      const power = Math.abs(safePower(this._getNodePower(child)));
      const speed = powerToSpeed(power, this._bubbleCfg);
      // Duration: speed factor 0.1 → 7.3s (slow), 1.0 → 1s (fast)
      const duration = power === 0 ? 0 : 8 - 7 * speed;

      const pathId = `p${pairIndex}-${ci}`;
      const lineColor = parentNode.color;

      lines.push(svg`
        <path
          id="${pathId}"
          d="M ${x1} 0 C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${h}"
          fill="none"
          stroke="${lineColor}"
          stroke-width="1.5"
          stroke-opacity="0.45"
        />
        ${duration > 0
          ? svg`
            <circle r="4" fill="${lineColor}" opacity="0.9">
              <animateMotion dur="${duration}s" repeatCount="indefinite"
                keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                <mpath href="#${pathId}" />
              </animateMotion>
            </circle>
            <circle r="4" fill="${lineColor}" opacity="0.9">
              <animateMotion dur="${duration}s" repeatCount="indefinite"
                keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                begin="${(duration * 0.33).toFixed(2)}s">
                <mpath href="#${pathId}" />
              </animateMotion>
            </circle>
            <circle r="4" fill="${lineColor}" opacity="0.9">
              <animateMotion dur="${duration}s" repeatCount="indefinite"
                keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                begin="${(duration * 0.66).toFixed(2)}s">
                <mpath href="#${pathId}" />
              </animateMotion>
            </circle>`
          : ""}
      `);
    }

    return svg`
      <svg
        class="connectors"
        width="${w}"
        height="${h}"
        viewBox="0 0 ${w} ${h}"
      >
        ${lines}
      </svg>
    `;
  }

  /* ---------- styles ---------- */

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        overflow: hidden;
      }

      .card-content {
        padding: 16px;
      }

      /* errors */
      .errors {
        padding: 16px;
        color: var(--error-color, #db4437);
      }
      .errors h3 {
        margin: 0 0 8px 0;
      }
      .errors ul {
        margin: 0;
        padding-left: 20px;
      }

      /* topology */
      .topology {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      /* rows */
      .row {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        gap: 8px;
        flex-shrink: 0;
      }

      /* node */
      .node-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1 1 0;
        min-width: 0;
      }

      .node-circle.clickable {
        cursor: pointer;
      }
      .node-circle.clickable:active {
        transform: scale(0.93);
      }

      .node-name {
        font-size: 0.82em;
        font-weight: 500;
        text-align: center;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        color: var(--primary-text-color, #e0e0e0);
      }

      .node-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2.5px solid;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        background: var(
          --card-background-color,
          var(--ha-card-background, #fff)
        );
        box-sizing: border-box;
        flex-shrink: 0;
        transition: transform 0.12s ease;
      }

      .node-circle ha-icon {
        --mdc-icon-size: 22px;
      }

      .node-power {
        font-size: 0.68em;
        font-weight: 600;
        line-height: 1;
        color: var(--primary-text-color, #e0e0e0);
      }

      /* connector SVG between rows */
      .connectors {
        width: 100%;
        display: block;
        flex-shrink: 0;
      }
    `;
  }
}

/* ------------------------------------------------------------------ */
/*  Registration                                                       */
/* ------------------------------------------------------------------ */

customElements.define(
  "energy-consumption-topology",
  EnergyConsumptionTopology
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "energy-consumption-topology",
  name: "Energy Consumption Topology",
  description:
    "Displays energy consumption as a vertical topology tree with animated power flow",
  preview: true,
});

console.info(
  `%c ENERGY-CONSUMPTION-TOPOLOGY %c v${CARD_VERSION} `,
  "color: white; background: #555; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;",
  "color: white; background: #1976d2; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"
);
