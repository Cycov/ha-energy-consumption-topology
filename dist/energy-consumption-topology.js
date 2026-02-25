/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:h,defineProperty:a,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,_=f?f.emptyScript:"",$=u.reactiveElementPolyfillSupport,m=(t,e)=>t,g={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!h(t,e),b={attribute:!0,type:String,converter:g,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&a(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:g).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:g;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??y)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[m("elementProperties")]=new Map,v[m("finalized")]=new Map,$?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=t=>t,E=A.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,M=`<${P}>`,N=document,O=()=>N.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,U="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,z=/>/g,W=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,I=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),B=I(1),V=I(2),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),G=new WeakMap,Y=N.createTreeWalker(N,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<s;e++){const s=t[e];let h,a,l=-1,c=0;for(;c<s.length&&(n.lastIndex=c,a=n.exec(s),null!==a);)c=n.lastIndex,n===T?"!--"===a[1]?n=H:void 0!==a[1]?n=z:void 0!==a[2]?(j.test(a[2])&&(o=RegExp("</"+a[2],"g")),n=W):void 0!==a[3]&&(n=W):n===W?">"===a[0]?(n=o??T,l=-1):void 0===a[1]?l=-2:(l=n.lastIndex-a[2].length,h=a[1],n=void 0===a[3]?W:'"'===a[3]?L:D):n===L||n===D?n=W:n===H||n===z?n=T:(n=W,o=void 0);const d=n===W&&t[e+1].startsWith("/>")?" ":"";r+=n===T?s+M:l>=0?(i.push(h),s.slice(0,l)+x+s.slice(l)+C+d):s+C+(-2===l?e:d)}return[J(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,h=this.parts,[a,l]=K(t,e);if(this.el=Z.createElement(a,s),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Y.nextNode())&&h.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(x)){const e=l[r++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);h.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?st:"?"===n[1]?it:"@"===n[1]?ot:et}),i.removeAttribute(t)}else t.startsWith(C)&&(h.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),Y.nextNode(),h.push({type:2,index:++o});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===P)h.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)h.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=N.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=k(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??N).importNode(e,!0);Y.currentNode=i;let o=Y.nextNode(),r=0,n=0,h=s[0];for(;void 0!==h;){if(r===h.index){let e;2===h.type?e=new tt(o,o.nextSibling,this,t):1===h.type?e=new h.ctor(o,h.name,h.strings,this,t):6===h.type&&(e=new rt(o,this,t)),this._$AV.push(e),h=s[++n]}r!==h?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=N,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),k(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Z(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new tt(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Q(this,t,e,0),r=!k(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const i=t;let n,h;for(t=o[0],n=0;n<o.length-1;n++)h=Q(this,i[s+n],e,n),h===q&&(h=this._$AH[n]),r||=!k(h)||h!==this._$AH[n],h===F?t=F:t!==F&&(t+=(h??"")+o[n+1]),this._$AH[n]=h}r&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class ot extends et{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??F)===q)return;const s=this._$AH,i=t===F&&s!==F||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=A.litHtmlPolyfillSupport;nt?.(Z,tt),(A.litHtmlVersions??=[]).push("3.3.2");const ht=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new tt(e.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,ht.litElementHydrateSupport?.({LitElement:at});const lt=ht.litElementPolyfillSupport;lt?.({LitElement:at}),(ht.litElementVersions??=[]).push("4.2.2");const ct="mdi:lightning-bolt",dt=["#4caf50","#2196f3","#ff9800","#9c27b0","#00bcd4","#e91e63","#8bc34a","#ff5722","#3f51b5","#009688","#ffc107","#795548"];function pt(t,e){const s=e.minPower,i=e.maxPower,o=e.minSpeed,r=e.maxSpeed;if(i<=s)return r;const n=function(t,e,s){return Math.max(e,Math.min(s,t))}((Math.abs(t)-s)/(i-s),0,1);return o+n*(r-o)}function ut(t){if("number"==typeof t)return t;if(!t)return 0;const e=String(t).trim().toLowerCase(),s=parseFloat(e);return e.endsWith("kw")?1e3*s:s}function ft(t){return"number"==typeof t?t:t?parseFloat(String(t))/100:0}function _t(t){if(null==t)return 0;const e=Number(t);return isNaN(e)?0:e}customElements.define("energy-consumption-topology",class extends at{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_containerWidth:{state:!0}}}constructor(){super(),this._containerWidth=0,this._ro=null}setConfig(t){if(!t.root)throw new Error("You must define a root node");this._config=t,this._errors=[],this._buildTree()}connectedCallback(){super.connectedCallback(),this._setupResizeObserver()}disconnectedCallback(){super.disconnectedCallback(),this._ro&&(this._ro.disconnect(),this._ro=null)}firstUpdated(){this._setupResizeObserver()}_setupResizeObserver(){if(this._ro)return;const t=this.shadowRoot&&this.shadowRoot.querySelector(".card-content");t&&(this._ro=new ResizeObserver(t=>{for(const e of t){const t=e.contentRect.width;t>0&&t!==this._containerWidth&&(this._containerWidth=t)}}),this._ro.observe(t))}updated(){this._ro||this._setupResizeObserver()}getCardSize(){return 6}static getStubConfig(){return{root:{id:"grid",entity:"sensor.grid_power",name:"Grid",color:"red",icon:"mdi:transmission-tower"},layer0:[{entity:"sensor.load_power",id:"load",parent:"grid",name:"Load"}]}}_buildTree(){this._errors=[];const t=this._config;let e=0;const s=()=>{const t=dt[e%dt.length];return e++,t},i=t.bubbles||{},o=i["min-speed"]||{},r=i["max-speed"]||{};this._bubbleCfg={minPower:ut(o["power-equivalent"]||"100W"),maxPower:ut(r["power-equivalent"]||"5000W"),minSpeed:ft(o.value||"10%"),maxSpeed:ft(r.value||"100%")};const n=t.root;n.id||this._errors.push("Root node is missing 'id'"),n.entity||this._errors.push("Root node is missing 'entity'");const h=new Set;n.id&&h.add(n.id),this._root={...n,icon:n.icon||ct,color:n.color||s(),name:n.name||(n.entity?n.entity.replace(/^sensor\./,""):"Root"),type:n.type||null,layer:-1},this._layers=[];let a=new Set([this._root.id]);for(let e=0;e<4;e++){const i=`layer${e}`,o=t[i];if(!o||!Array.isArray(o)||0===o.length){this._layers.push([]);continue}const r=[],n=new Set;let l=0;for(const t of o){const o="other"===t.type;if(!t.id){this._errors.push(`Node in ${i} is missing 'id'`);continue}if(h.has(t.id)){this._errors.push(`Duplicate id '${t.id}' in ${i}`);continue}if(!o&&!t.entity){this._errors.push(`Node '${t.id}' is missing 'entity'`);continue}if(!t.parent){this._errors.push(`Node '${t.id}' is missing 'parent'`);continue}if(!a.has(t.parent)){this._errors.push(`Node '${t.id}' references parent '${t.parent}' which is not in the previous layer`);continue}if(o&&(l++,l>1)){this._errors.push(`Only one node of type 'other' is allowed per layer (${i})`);continue}h.add(t.id),n.add(t.id);const c=o?t.name||"Other":t.name||t.entity.replace(/^sensor\./,"");r.push({...t,icon:t.icon||(o?"mdi:dots-horizontal":ct),color:t.color||s(),name:c,type:t.type||null,layer:e})}this._layers.push(r),n.size>0&&(a=n)}this._nodeMap=new Map,this._nodeMap.set(this._root.id,this._root);for(const t of this._layers)for(const e of t)this._nodeMap.set(e.id,e)}render(){if(this._errors&&this._errors.length>0)return B`
        <ha-card>
          <div class="errors">
            <h3>Configuration errors</h3>
            <ul>
              ${this._errors.map(t=>B`<li>${t}</li>`)}
            </ul>
          </div>
        </ha-card>
      `;const t=this._layers?this._layers.filter(t=>t.length>0):[];return B`
      <ha-card>
        <div class="card-content">
          ${this._root?this._renderTopology(t):""}
        </div>
      </ha-card>
    `}_getStateValue(t){return this.hass&&this.hass.states[t]?this.hass.states[t].state:null}_formatPower(t){if(null==t||isNaN(t))return"-- W";const e=Number(t);return Math.abs(e)>=1e3?`${(e/1e3).toFixed(1)} kW`:`${Math.round(e)} W`}_getNodePower(t){if("other"===t.type){const e=this._nodeMap.get(t.parent);if(!e)return 0;const s=_t(this._getNodePower(e)),i=this._layers[t.layer]||[];let o=0;for(const e of i)"other"!==e.type&&e.parent===t.parent&&(o+=_t(this._getNodePower(e)));const r=s-o;return r>0?r:0}const e=this._getStateValue(t.entity);return null!==e?_t(e):null}_fireMoreInfo(t){const e=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}_renderTopology(t){const e=[[this._root],...t],s=[];for(let t=0;t<e.length;t++)s.push(this._renderRow(e[t],t)),t<e.length-1&&s.push(this._renderConnectors(e[t],e[t+1],t));return B`<div class="topology">${s}</div>`}_renderRow(t,e){return B`
      <div class="row" data-row="${e}">
        ${t.map(t=>this._renderNode(t))}
      </div>
    `}_renderNode(t){const e=this._getNodePower(t),s=this._formatPower(e),i=function(t,e){if("light"===t.type)return(null===e||isNaN(e)?0:Math.abs(Number(e)))>0?"mdi:lightbulb-on":"mdi:lightbulb";return"other"===t.type?t.icon||"mdi:dots-horizontal":t.icon||ct}(t,e),o=!!t.entity;return B`
      <div class="node-wrapper">
        <div class="node-name">${t.name}</div>
        <div
          class="node-circle ${o?"clickable":""}"
          style="border-color: ${t.color};"
          @click=${o?()=>this._fireMoreInfo(t.entity):void 0}
        >
          <ha-icon .icon=${i} style="color: ${t.color};"></ha-icon>
          <span class="node-power">${s}</span>
        </div>
      </div>
    `}_renderConnectors(t,e,s){const i=this._containerWidth||400,o=t.length,r=e.length,n=(t,e)=>(t+.5)/e*i,h=[];for(let i=0;i<r;i++){const a=e[i],l=this._nodeMap.get(a.parent);if(!l)continue;const c=t.indexOf(l);if(-1===c)continue;const d=n(c,o),p=n(i,r),u=32,f=48,_=Math.abs(_t(this._getNodePower(a))),$=pt(_,this._bubbleCfg),m=0===_?0:8-7*$,g=`p${s}-${i}`,y=l.color;h.push(V`
        <path
          id="${g}"
          d="M ${d} 0 C ${d} ${u}, ${p} ${f}, ${p} ${80}"
          fill="none"
          stroke="${y}"
          stroke-width="1.5"
          stroke-opacity="0.45"
        />
        ${m>0?V`
            <circle r="4" fill="${y}" opacity="0.9">
              <animateMotion dur="${m}s" repeatCount="indefinite"
                keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                <mpath href="#${g}" />
              </animateMotion>
            </circle>
            <circle r="4" fill="${y}" opacity="0.9">
              <animateMotion dur="${m}s" repeatCount="indefinite"
                keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                begin="${(.33*m).toFixed(2)}s">
                <mpath href="#${g}" />
              </animateMotion>
            </circle>
            <circle r="4" fill="${y}" opacity="0.9">
              <animateMotion dur="${m}s" repeatCount="indefinite"
                keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                begin="${(.66*m).toFixed(2)}s">
                <mpath href="#${g}" />
              </animateMotion>
            </circle>`:""}
      `)}return V`
      <svg
        class="connectors"
        width="${i}"
        height="${80}"
        viewBox="0 0 ${i} ${80}"
      >
        ${h}
      </svg>
    `}static get styles(){return r`
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
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"energy-consumption-topology",name:"Energy Consumption Topology",description:"Displays energy consumption as a vertical topology tree with animated power flow",preview:!0}),console.info("%c ENERGY-CONSUMPTION-TOPOLOGY %c v1.2.0 ","color: white; background: #555; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","color: white; background: #1976d2; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");
