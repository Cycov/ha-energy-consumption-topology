import{LitElement as e,html as t,svg as o,css as i}from"https://unpkg.com/lit-element@2.0.1/lit-element.js?module";const r="mdi:lightning-bolt",n=["#4caf50","#2196f3","#ff9800","#9c27b0","#00bcd4","#e91e63","#8bc34a","#ff5722","#3f51b5","#009688","#ffc107","#795548"];function s(e,t){const o=t.minPower,i=t.maxPower,r=t.minSpeed,n=t.maxSpeed;if(i<=o)return n;var s,a,l;return r+(s=(Math.abs(e)-o)/(i-o),a=0,l=1,Math.max(a,Math.min(l,s)))*(n-r)}function a(e,t){return e<=0?0:t/e}function l(e){if("number"==typeof e)return e;if(!e)return 0;const t=String(e).trim().toLowerCase(),o=parseFloat(t);return t.endsWith("kw")?1e3*o:o}function c(e){return"number"==typeof e?e:e?parseFloat(String(e))/100:0}function d(e){if(null==e)return 0;const t=Number(e);return isNaN(t)?0:t}customElements.define("energy-consumption-topology",class extends e{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_containerWidth:{state:!0},_containerHeight:{state:!0}}}constructor(){super(),this._containerWidth=0,this._containerHeight=0,this._ro=null,this._roTarget=null}setConfig(e){if(!e.root)throw new Error("You must define a root node");this._config=e,this._layout=e.layout||"vertical",this._errors=[],this._buildTree()}connectedCallback(){super.connectedCallback(),this._setupResizeObserver()}disconnectedCallback(){super.disconnectedCallback(),this._ro&&(this._ro.disconnect(),this._ro=null,this._roTarget=null)}firstUpdated(){this._setupResizeObserver()}_setupResizeObserver(){const e=this.shadowRoot&&this.shadowRoot.querySelector(".topology");e&&(this._ro&&this._roTarget===e||(this._ro&&(this._ro.disconnect(),this._ro=null),this._roTarget=e,this._ro=new ResizeObserver(e=>{for(const t of e){const e=t.contentRect.width,o=t.contentRect.height;e>0&&e!==this._containerWidth&&(this._containerWidth=e),o>0&&o!==this._containerHeight&&(this._containerHeight=o)}}),this._ro.observe(e)))}updated(){this._setupResizeObserver()}getCardSize(){return 6}getGridOptions(){const e=this._config&&this._config.grid_options||{};return{rows:e.rows||5,columns:e.columns||12,min_rows:e.min_rows||e.rows||5,min_columns:e.min_columns||e.columns||6}}static getStubConfig(){return{root:{id:"grid",entity:"sensor.grid_power",name:"Grid",color:"red",icon:"mdi:transmission-tower"},layer0:[{entity:"sensor.load_power",id:"load",parent:"grid",name:"Load"}]}}_buildTree(){this._errors=[];const e=this._config;let t=0;const o=()=>{const e=n[t%n.length];return t++,e},i=e.bubbles||{},s=i["min-speed"]||{},a=i["max-speed"]||{};this._bubbleCfg={minPower:l(s["power-equivalent"]||"100W"),maxPower:l(a["power-equivalent"]||"5000W"),minSpeed:c(s.value||"10%"),maxSpeed:c(a.value||"100%"),color:i.color||"inherit",size:null!=i.size?Number(i.size):4,quantity:null!=i.quantity?Number(i.quantity):3,baseDuration:null!=i.speed?parseFloat(String(i.speed)):1};const d=e.nodes&&e.nodes.sizes||{};this._nodeSizes={circle:null!=d.circle?Number(d.circle):64,icon:null!=d.icon?Number(d.icon):22,font:null!=d.font?Number(d.font):11};const h=e.root;h.id||this._errors.push("Root node is missing 'id'"),h.entity||this._errors.push("Root node is missing 'entity'");const p=new Set;h.id&&p.add(h.id),this._root={...h,icon:h.icon||r,color:h.color||o(),name:h.name||(h.entity?h.entity.replace(/^sensor\./,""):"Root"),type:h.type||null,layer:-1},this._layers=[];let u=new Set([this._root.id]);for(let t=0;t<4;t++){const i=`layer${t}`,n=e[i];if(!n||!Array.isArray(n)||0===n.length){this._layers.push([]);continue}const s=[],a=new Set,l=new Set;for(const e of n){const n="other"===e.type;if(!e.id){this._errors.push(`Node in ${i} is missing 'id'`);continue}if(p.has(e.id)){this._errors.push(`Duplicate id '${e.id}' in ${i}`);continue}if(!n&&!e.entity){this._errors.push(`Node '${e.id}' is missing 'entity'`);continue}if(!e.parent){this._errors.push(`Node '${e.id}' is missing 'parent'`);continue}if(!u.has(e.parent)){this._errors.push(`Node '${e.id}' references parent '${e.parent}' which is not in the previous layer`);continue}if(n){if(l.has(e.parent)){this._errors.push(`Only one node of type 'other' is allowed per parent – parent '${e.parent}' in ${i} already has one`);continue}l.add(e.parent)}p.add(e.id),a.add(e.id);const c=n?e.name||"Other":e.name||e.entity.replace(/^sensor\./,"");s.push({...e,icon:e.icon||(n?"mdi:dots-horizontal":r),color:e.color||o(),name:c,type:e.type||null,layer:t})}this._layers.push(s),a.size>0&&(u=a)}this._nodeMap=new Map,this._nodeMap.set(this._root.id,this._root);for(const e of this._layers)for(const t of e)this._nodeMap.set(t.id,t)}render(){if(this._errors&&this._errors.length>0)return t`
        <ha-card>
          <div class="errors">
            <h3>Configuration errors</h3>
            <ul>
              ${this._errors.map(e=>t`<li>${e}</li>`)}
            </ul>
          </div>
        </ha-card>
      `;const e=this._layers?this._layers.filter(e=>e.length>0):[],o="horizontal"===this._layout,i=this._nodeSizes||{circle:64,icon:22,font:11},r=`--node-circle-size: ${i.circle}px; --node-icon-size: ${i.icon}px; --node-font-size: ${i.font}px;`;return t`
      <ha-card>
        <div class="card-content ${o?"horizontal":"vertical"}" style="${r}">
          ${this._root?this._renderTopology(e):""}
        </div>
      </ha-card>
    `}_getStateValue(e){return this.hass&&this.hass.states[e]?this.hass.states[e].state:null}_formatPower(e){if(null==e||isNaN(e))return"-- W";const t=Number(e);return Math.abs(t)>=1e3?`${(t/1e3).toFixed(1)} kW`:`${Math.round(t)} W`}_getNodePower(e){if("other"===e.type){const t=this._nodeMap.get(e.parent);if(!t)return 0;const o=d(this._getNodePower(t)),i=this._layers[e.layer]||[];let r=0;for(const t of i)"other"!==t.type&&t.parent===e.parent&&(r+=d(this._getNodePower(t)));const n=o-r;return n>0?n:0}const t=this._getStateValue(e.entity);return null!==t?d(t):null}_fireMoreInfo(e){const t=new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0});this.dispatchEvent(t)}_renderTopology(e){const o=[[this._root],...e];if("horizontal"===this._layout){const e=o.map((e,t)=>this._renderRow(e,t));return t`
        <div class="topology horizontal">
          ${e}
          ${this._renderHorizontalConnectorOverlay(o)}
        </div>
      `}const i=[];for(let e=0;e<o.length;e++)i.push(this._renderRow(o[e],e)),e<o.length-1&&i.push(this._renderConnectors(o[e],o[e+1],e));return t`<div class="topology">${i}</div>`}_renderRow(e,o){return t`
      <div class="row" data-row="${o}">
        ${e.map(e=>this._renderNode(e))}
      </div>
    `}_renderNodeName(e){return"horizontal"===this._layout?t`<div class="node-name-h">${e.name}</div>`:t`<div class="node-name">${e.name}</div>`}_renderNode(e){const o=this._getNodePower(e),i=this._formatPower(o),n=function(e,t){if("light"===e.type)return(null===t||isNaN(t)?0:Math.abs(Number(t)))>0?"mdi:lightbulb-on":"mdi:lightbulb";return"other"===e.type?e.icon||"mdi:dots-horizontal":e.icon||r}(e,o),s=!!e.entity;return t`
      <div class="node-wrapper">
        ${this._renderNodeName(e)}
        <div
          class="node-circle ${s?"clickable":""}"
          style="border-color: ${e.color};"
          @click=${s?()=>this._fireMoreInfo(e.entity):void 0}
        >
          <ha-icon .icon=${n} style="color: ${e.color};"></ha-icon>
          <span class="node-power">${i}</span>
        </div>
      </div>
    `}_renderConnectors(e,t,i){const r=this._containerWidth||400,n=e.length,l=t.length,c=this._bubbleCfg,h=(e,t)=>(e+.5)/t*r,p=[];for(let r=0;r<l;r++){const u=t[r],f=this._nodeMap.get(u.parent);if(!f)continue;const g=e.indexOf(f);if(-1===g)continue;const m=h(g,n),_=h(r,l),y=32,w=48,b=Math.abs(d(this._getNodePower(u))),$=s(b,c),x=0===b?0:a($,c.baseDuration),v=`p${i}-${r}`,z=f.color,N="inherit"===c.color?z:c.color,k=c.size,C=c.quantity;p.push(o`
        <path
          id="${v}"
          d="M ${m} 0 C ${m} ${y}, ${_} ${w}, ${_} ${80}"
          fill="none"
          stroke="${z}"
          stroke-width="1.5"
          stroke-opacity="0.45"
        />
        ${x>0?Array.from({length:C},(e,t)=>o`
              <circle r="${k}" fill="${N}" opacity="0.9">
                <animateMotion dur="${x}s" repeatCount="indefinite"
                  keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                  begin="${(x*t/C).toFixed(2)}s">
                  <mpath href="#${v}" />
                </animateMotion>
              </circle>`):""}
      `)}return o`
      <svg
        class="connectors"
        width="${r}"
        height="${80}"
        viewBox="0 0 ${r} ${80}"
      >
        ${p}
      </svg>
    `}_renderHorizontalConnectorOverlay(e){const t=this._containerWidth||400,i=this._containerHeight||400,r=e.length,n=(this._nodeSizes?this._nodeSizes.circle:64)/2,l=this._bubbleCfg,c=e=>(e+.5)/r*t,h=(e,t)=>(e+.5)/t*i,p=[];for(let t=0;t<e.length-1;t++){const i=e[t],r=e[t+1],u=c(t)+n,f=c(t+1)-n,g=(u+f)/2;for(let e=0;e<r.length;e++){const n=r[e],c=this._nodeMap.get(n.parent);if(!c)continue;const m=i.indexOf(c);if(-1===m)continue;const _=h(m,i.length),y=h(e,r.length),w=Math.abs(d(this._getNodePower(n))),b=s(w,l),$=0===w?0:a(b,l.baseDuration),x=`hp${t}-${e}`,v=c.color,z="inherit"===l.color?v:l.color,N=l.size,k=l.quantity;p.push(o`
          <path
            id="${x}"
            d="M ${u} ${_} C ${g} ${_}, ${g} ${y}, ${f} ${y}"
            fill="none"
            stroke="${v}"
            stroke-width="1.5"
            stroke-opacity="0.45"
          />
          ${$>0?Array.from({length:k},(e,t)=>o`
                <circle r="${N}" fill="${z}" opacity="0.9">
                  <animateMotion dur="${$}s" repeatCount="indefinite"
                    keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                    begin="${($*t/k).toFixed(2)}s">
                    <mpath href="#${x}" />
                  </animateMotion>
                </circle>`):""}
        `)}}return o`
      <svg
        class="connectors-overlay"
        viewBox="0 0 ${t} ${i}"
      >
        ${p}
      </svg>
    `}static get styles(){return i`
      :host {
        display: block;
        height: 100%;
      }

      ha-card {
        height: 100%;
        overflow: hidden;
      }

      .card-content {
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
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

      /* topology – vertical (default) */
      .topology {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex: 1;
        min-height: 0;
      }

      /* topology – horizontal */
      .topology.horizontal {
        flex-direction: row;
        align-items: stretch;
        position: relative;
      }

      .card-content.horizontal {
        overflow-x: auto;
      }

      /* rows (vertical) */
      .row {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      /* vertical: connectors grow to fill extra height */
      .connectors {
        width: 100%;
        display: block;
        flex: 1 0 40px;
      }

      /* rows (horizontal) – each "row" is actually a column */
      .topology.horizontal > .row {
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex: 1 1 0;
        min-width: 0;
      }

      .topology.horizontal > .row > .node-wrapper {
        flex: 0 0 auto;
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

      .node-name-h {
        font-size: 0.82em;
        font-weight: 500;
        text-align: center;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 80px;
        color: var(--primary-text-color, #e0e0e0);
      }

      .node-circle {
        width: var(--node-circle-size, 64px);
        height: var(--node-circle-size, 64px);
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
        --mdc-icon-size: var(--node-icon-size, 22px);
      }

      .node-power {
        font-size: var(--node-font-size, 11px);
        font-weight: 600;
        line-height: 1;
        color: var(--primary-text-color, #e0e0e0);
      }

      /* single overlay SVG for horizontal connectors */
      .connectors-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"energy-consumption-topology",name:"Energy Consumption Topology",description:"Displays energy consumption as a vertical topology tree with animated power flow",preview:!0}),console.info("%c ENERGY-CONSUMPTION-TOPOLOGY %c v1.5.0 ","color: white; background: #555; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","color: white; background: #1976d2; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");
