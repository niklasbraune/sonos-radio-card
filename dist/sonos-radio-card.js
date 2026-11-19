/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$3=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$2,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$2,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$2=c$1?c$1.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$2:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$3(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$2(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$2=t=>t,s$1=t$1.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r$1=`<${n}>`,l$1=document,c=()=>l$1.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l$1.createTreeWalker(l$1,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$1:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l$1).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l$1,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l$1.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$2(t).nextSibling;i$2(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o=s.litElementPolyfillSupport;o?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=o=>void 0===o.strings,m={},p=(o,t=m)=>o._$AH=t;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=e(class extends i{constructor(r$1){if(super(r$1),r$1.type!==t.PROPERTY&&r$1.type!==t.ATTRIBUTE&&r$1.type!==t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!r(r$1))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t$1]){if(t$1===E||t$1===A)return t$1;const o=i.element,l=i.name;if(i.type===t.PROPERTY){if(t$1===o[l])return E}else if(i.type===t.BOOLEAN_ATTRIBUTE){if(!!t$1===o.hasAttribute(l))return E}else if(i.type===t.ATTRIBUTE&&o.getAttribute(l)===t$1+"")return E;return p(i),t$1}});

const ACTIVE_STATES = new Set(["playing", "paused", "buffering"]);
const UNAVAILABLE_STATES = new Set(["unavailable", "unknown"]);
const unique = (items) => [...new Set(items)];
const clamp = (value) => Math.min(1, Math.max(0, value));
const stringAttribute = (entity, name) => {
    const value = entity?.attributes[name];
    return typeof value === "string" && value.length > 0 ? value : undefined;
};
const isActiveState = (entity) => !!entity && ACTIVE_STATES.has(entity.state);
const isAvailable = (entity) => !!entity && !UNAVAILABLE_STATES.has(entity.state);
/** Sonos lists the group coordinator first in `group_members`. */
const groupMembers = (hass, entityId) => {
    const members = hass.states[entityId]?.attributes.group_members;
    return Array.isArray(members) &&
        members.length > 0 &&
        members.every((member) => typeof member === "string")
        ? members
        : [entityId];
};
const coordinatorOf = (hass, entityId) => groupMembers(hass, entityId)[0];
/**
 * Resolves the entity that should receive playback commands. Commands always
 * target a group coordinator so that existing Sonos groups stay intact.
 * `preferred` overrides the configuration, e.g. after a master handoff.
 */
const resolveCoordinator = (hass, config, preferred) => {
    if (preferred && isAvailable(hass.states[preferred])) {
        return coordinatorOf(hass, preferred);
    }
    if (config.master_entity && isAvailable(hass.states[config.master_entity])) {
        return coordinatorOf(hass, config.master_entity);
    }
    const coordinators = unique(config.speakers
        .map((speaker) => speaker.entity)
        .filter((entityId) => entityId.length > 0)
        .map((entityId) => coordinatorOf(hass, entityId)));
    return (coordinators.find((id) => hass.states[id]?.state === "playing") ??
        coordinators.find((id) => isActiveState(hass.states[id])) ??
        coordinators.find((id) => isAvailable(hass.states[id])) ??
        // Nothing is reachable: keep the configured master so the UI can say so.
        (config.master_entity || undefined) ??
        coordinators[0]);
};
// Sonos rewrites stream URLs (e.g. to x-rincon-mp3radio://), so compare
// identifiers without their scheme.
const normalizeContentId = (value) => value
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:(\/\/)?/i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
const normalizeText = (value) => value.trim().toLowerCase();
const findActiveStationIndex = (stations, entity) => {
    if (!isActiveState(entity)) {
        return -1;
    }
    const contentId = stringAttribute(entity, "media_content_id");
    if (contentId) {
        const normalizedId = normalizeContentId(contentId);
        const index = stations.findIndex((station) => station.media_content_id.length > 0 &&
            normalizeContentId(station.media_content_id) === normalizedId);
        if (index >= 0) {
            return index;
        }
    }
    const titles = ["media_channel", "media_title"]
        .map((name) => stringAttribute(entity, name))
        .filter((title) => !!title)
        .map(normalizeText);
    return stations.findIndex((station) => station.name.trim().length > 0 &&
        titles.includes(normalizeText(station.name)));
};
const volumeOf = (hass, entityId) => {
    const volume = hass.states[entityId]?.attributes.volume_level;
    return typeof volume === "number" ? volume : undefined;
};
const groupVolume = (hass, members) => {
    const volumes = members
        .map((member) => volumeOf(hass, member))
        .filter((volume) => volume !== undefined);
    return volumes.length > 0
        ? volumes.reduce((sum, volume) => sum + volume, 0) / volumes.length
        : undefined;
};
/**
 * Shifts every member by the same offset so that relative volume differences
 * between rooms are preserved. The extremes are applied to all members.
 */
const planGroupVolume = (hass, members, target) => {
    const level = clamp(target);
    const current = groupVolume(hass, members);
    return members.map((entityId) => {
        const volume = volumeOf(hass, entityId);
        const next = level <= 0 || level >= 1 || current === undefined || volume === undefined
            ? level
            : clamp(volume + level - current);
        return { entity_id: entityId, volume_level: Math.round(next * 100) / 100 };
    });
};
const formatGroupName = (names) => names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
/**
 * Lists the configured speakers as playback targets. Grouped speakers are
 * merged into one target per group so that choosing a target never splits an
 * existing Sonos group. `current` is always included.
 */
const playbackTargets = (hass, config, current) => {
    const coordinators = unique([...config.speakers.map((speaker) => speaker.entity), current ?? ""]
        .filter((entityId) => entityId.length > 0 && hass.states[entityId])
        .map((entityId) => coordinatorOf(hass, entityId)));
    return coordinators.map((id) => ({
        id,
        members: groupMembers(hass, id),
        available: isAvailable(hass.states[id]),
        playing: hass.states[id]?.state === "playing",
    }));
};
/**
 * Plans how to remove a speaker from its group. Removing the coordinator hands
 * the group over to another member so playback continues in the other rooms.
 * `preferredOrder` (usually the configured speakers) decides the new master.
 */
const planSpeakerRemoval = (hass, entityId, preferredOrder = []) => {
    const members = groupMembers(hass, entityId);
    if (members.length <= 1) {
        return { type: "blocked", entity: entityId };
    }
    if (members[0] !== entityId) {
        return { type: "unjoin", entity: entityId };
    }
    const remaining = members.filter((member) => member !== entityId);
    const rank = (id) => {
        const index = preferredOrder.indexOf(id);
        return index === -1 ? preferredOrder.length : index;
    };
    const candidates = [...remaining].sort((a, b) => rank(a) - rank(b));
    const newMaster = candidates.find((id) => isAvailable(hass.states[id])) ?? candidates[0];
    return { type: "handoff", entity: entityId, newMaster, remaining };
};
// Sonos accepts many URI schemes (http(s), x-rincon-mp3radio:, plex://,
// media-source://, …), so only IDs without any scheme are flagged.
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
/** Returns a hint when a station cannot (or probably cannot) be played. */
const stationIssue = (station, t) => {
    const id = station.media_content_id?.trim() ?? "";
    const type = station.media_content_type || "music";
    if (!id) {
        return type === "favorite_item_id"
            ? t("issue.no_favorite")
            : t("issue.no_url");
    }
    if (type === "favorite_item_id") {
        return /^https?:\/\//i.test(id) ? t("issue.url_as_favorite") : undefined;
    }
    if (type === "music") {
        if (/^https?:\/\//i.test(id) && /\s/.test(id)) {
            return t("issue.url_spaces");
        }
        if (!HAS_SCHEME.test(id)) {
            return t("issue.url_scheme");
        }
    }
    return undefined;
};
/**
 * Collects configuration and availability problems that should be shown on
 * the card. `name` maps entity IDs to display names.
 */
const collectNotices = (hass, config, coordinatorId, name, t) => {
    const notices = [];
    const speakers = config.speakers
        .map((speaker) => speaker.entity)
        .filter((entityId) => entityId.length > 0);
    const configured = unique([config.master_entity ?? "", ...speakers].filter((id) => id.length > 0));
    if (configured.length === 0) {
        return [{ level: "error", message: t("notice.no_speakers") }];
    }
    for (const entityId of configured) {
        if (!entityId.startsWith("media_player.")) {
            notices.push({
                level: "warning",
                message: t("notice.not_media_player", { entity: entityId }),
            });
        }
        else if (!hass.states[entityId]) {
            notices.push({
                level: "warning",
                message: t("notice.not_found", { entity: entityId }),
            });
        }
    }
    const known = configured.filter((id) => hass.states[id]);
    if (known.length > 0 && !known.some((id) => isAvailable(hass.states[id]))) {
        notices.push({
            level: "error",
            message: known.length === 1
                ? t("notice.speaker_unavailable", { name: name(known[0]) })
                : t("notice.all_unavailable"),
        });
        return notices;
    }
    const master = config.master_entity;
    if (master &&
        hass.states[master] &&
        !isAvailable(hass.states[master]) &&
        coordinatorId &&
        coordinatorId !== master) {
        notices.push({
            level: "info",
            message: t("notice.master_fallback", {
                master: name(master),
                name: name(coordinatorId),
            }),
        });
    }
    return notices;
};

const en = {
    "card.description": "Control Sonos speakers and radio stations.",
    "card.unnamed": "Unnamed",
    "card.this_station": "This station",
    "card.the_station": "The station",
    "card.service_failed": "Failed to call media_player.{service}.",
    "card.station_not_set_up": "{name}: {issue} Add it in the card editor.",
    "card.station_failed": "Could not start {name}.",
    "card.station_timeout": "{name} did not start. Check that the stream URL is reachable and uses a format Sonos supports (MP3, AAC or HLS).",
    "card.volume_failed": "Could not change the volume of {name}.",
    "card.join_failed": "Could not add {name} to the group.",
    "card.unjoin_failed": "Could not remove {name} from the group.",
    "card.dismiss": "Dismiss",
    "card.empty_title": "No radio stations yet",
    "card.empty_text": "Edit the card and add stations with a stream URL or a Sonos favorite.",
    "card.playing": "Playing",
    "card.paused": "Paused",
    "card.starting": "Starting",
    "card.check_url": "Check URL",
    "card.not_set_up": "Not set up",
    "card.unknown_stream": "Unknown stream",
    "card.nothing_playing": "Nothing playing",
    "card.speaker_unavailable": "Speaker unavailable",
    "card.no_speaker_configured": "No speaker configured",
    "card.not_in_station_list": "Not in your station list",
    "card.no_speaker": "No speaker",
    "card.play": "Play",
    "card.stop": "Stop",
    "card.group_volume": "Group volume",
    "card.multiroom": "Multiroom",
    "card.play_on": "Play on",
    "settings.title": "Settings",
    "settings.eyebrow": "Playback",
    "settings.max_volume": "Maximum volume",
    "settings.max_volume_help": "Upper limit for all volume sliders. Louder speakers are turned down when playback starts.",
    "settings.quiet_hours": "Quiet hours",
    "settings.quiet_hours_help": "Playback started from this card during these times begins at the chosen volume.",
    "settings.quiet_period": "Quiet hours {index}",
    "settings.from": "From",
    "settings.to": "To",
    "settings.start_volume": "{name}: start volume",
    "settings.add_quiet": "Add quiet hours",
    "settings.remove_quiet": "Remove {name}",
    "settings.active_now": "Active now",
    "settings.quiet_active": "Quiet hours active: playback starts at {volume}%",
    "settings.shuffle": "Shuffle playlists",
    "settings.shuffle_help": "Starts Sonos favorites such as Spotify playlists in shuffle mode. Radio stations are not affected.",
    "settings.storage_note": "Settings are saved in your Home Assistant user profile and apply to every Sonos Radio Card.",
    "settings.save_failed": "Settings could not be saved to your profile and are only stored on this device.",
    "card.group_speakers": "Group speakers",
    "card.sonos_group": "Sonos group: {name}",
    "card.no_active_group": "No active group",
    "card.close": "Close",
    "card.room_in_group": "{name} in group",
    "card.room_volume": "{name} volume",
    "room.not_found": "Not found in Home Assistant",
    "room.unavailable": "Unavailable – check power and network",
    "room.leaving": "Leaving group…",
    "room.joining": "Joining group…",
    "room.master_only": "Master · only room in group",
    "room.master": "Group master",
    "room.in_group": "In group",
    "room.not_in_group": "Not in group",
    "issue.no_favorite": "No Sonos favorite selected.",
    "issue.no_url": "No stream URL set.",
    "issue.url_as_favorite": "This looks like a URL. Set the type to “Stream URL”.",
    "issue.url_spaces": "The stream URL contains spaces.",
    "issue.url_scheme": "The stream URL should start with http:// or https://.",
    "notice.no_speakers": "No Sonos speakers configured. Edit the card to add at least one speaker.",
    "notice.not_media_player": "{entity} is not a media player. Pick a Sonos media_player entity in the card editor.",
    "notice.not_found": "{entity} was not found in Home Assistant. Check the entity ID in the card editor.",
    "notice.speaker_unavailable": "{name} is unavailable. Make sure the speaker is powered on and connected to your network.",
    "notice.all_unavailable": "All Sonos speakers are unavailable. Check power, network, and the Sonos integration in Home Assistant.",
    "notice.master_fallback": "Default speaker {master} is unavailable, using {name} instead.",
    "editor.general": "General and speakers",
    "editor.title": "Card title",
    "editor.master": "Default master speaker",
    "editor.master_helper": "Leave empty to automatically detect the current Sonos group master.",
    "editor.speakers": "Sonos speakers",
    "editor.speaker_n": "Speaker {n}",
    "editor.speaker_up": "Move speaker up",
    "editor.speaker_down": "Move speaker down",
    "editor.speaker_remove": "Remove speaker",
    "editor.speaker_entity": "Speaker entity",
    "editor.display_name": "Display name",
    "editor.icon": "Icon",
    "editor.add_speaker": "Add speaker",
    "editor.stations": "Radio stations",
    "editor.station_n": "Station {n}",
    "editor.station_up": "Move station up",
    "editor.station_down": "Move station down",
    "editor.station_remove": "Remove station",
    "editor.station_name": "Station name",
    "editor.content_type": "Media content type",
    "editor.type_music": "Stream URL (music / Radio Browser)",
    "editor.type_favorite": "Sonos favorite",
    "editor.content_id": "Stream URL / media content ID",
    "editor.content_id_placeholder": "https://... or Sonos favorite ID",
    "editor.logo": "Logo URL or media-source",
    "editor.logo_placeholder": "https://... or media-source://...",
    "editor.helper_favorite": "Pick a favorite or enter the Sonos favorite ID (for example FV:2/12).",
    "editor.helper_music": "Radio Browser stations use their stream URL with the “music” media content type.",
    "editor.add_station": "Add station",
    "editor.favorite": "Sonos favorite",
    "editor.favorites_loading": "Loading Sonos favorites…",
    "editor.favorites_failed": "Could not load Sonos favorites. Enter the favorite ID manually.",
    "editor.favorites_empty": "No Sonos favorites found. Add favorites in the Sonos app.",
    "editor.favorites_reload": "Reload favorites",
    "editor.search_title": "Find stations on Radio Browser",
    "editor.search_label": "Station name",
    "editor.search": "Search",
    "editor.search_helper": "Searches the public radio-browser.info directory. Only the search term is sent.",
    "editor.search_empty": "No stations found.",
    "editor.search_failed": "Radio Browser is not reachable. Try again later.",
    "editor.search_add": "Add",
    "editor.search_added": "Added",
    "editor.browse_logo": "Pick logo from media",
    "editor.browse_title": "Media",
    "editor.browse_back": "Back",
    "editor.browse_close": "Close media browser",
    "editor.browse_empty": "This folder contains no images.",
    "editor.browse_failed": "Could not open the media browser.",
    "editor.browse_loading": "Loading…",
};
const de = {
    "card.description": "Sonos-Lautsprecher und Radiosender steuern.",
    "card.unnamed": "Ohne Namen",
    "card.this_station": "Dieser Sender",
    "card.the_station": "Der Sender",
    "card.service_failed": "media_player.{service} ist fehlgeschlagen.",
    "card.station_not_set_up": "{name}: {issue} Ergänze ihn im Karteneditor.",
    "card.station_failed": "{name} konnte nicht gestartet werden.",
    "card.station_timeout": "{name} startet nicht. Prüfe, ob die Stream-URL erreichbar ist und ein von Sonos unterstütztes Format nutzt (MP3, AAC oder HLS).",
    "card.volume_failed": "Die Lautstärke von {name} konnte nicht geändert werden.",
    "card.join_failed": "{name} konnte nicht zur Gruppe hinzugefügt werden.",
    "card.unjoin_failed": "{name} konnte nicht aus der Gruppe entfernt werden.",
    "card.dismiss": "Schließen",
    "card.empty_title": "Noch keine Radiosender",
    "card.empty_text": "Bearbeite die Karte und füge Sender mit Stream-URL oder Sonos-Favorit hinzu.",
    "card.playing": "Läuft",
    "card.paused": "Pausiert",
    "card.starting": "Startet",
    "card.check_url": "URL prüfen",
    "card.not_set_up": "Nicht eingerichtet",
    "card.unknown_stream": "Unbekannter Stream",
    "card.nothing_playing": "Keine Wiedergabe",
    "card.speaker_unavailable": "Lautsprecher nicht verfügbar",
    "card.no_speaker_configured": "Kein Lautsprecher eingerichtet",
    "card.not_in_station_list": "Nicht in deiner Senderliste",
    "card.no_speaker": "Kein Lautsprecher",
    "card.play": "Wiedergabe",
    "card.stop": "Stopp",
    "card.group_volume": "Gruppenlautstärke",
    "card.multiroom": "Multiroom",
    "card.play_on": "Wiedergabe auf",
    "settings.title": "Einstellungen",
    "settings.eyebrow": "Wiedergabe",
    "settings.max_volume": "Maximale Lautstärke",
    "settings.max_volume_help": "Obergrenze für alle Lautstärkeregler. Lautere Lautsprecher werden beim Start der Wiedergabe heruntergeregelt.",
    "settings.quiet_hours": "Ruhezeiten",
    "settings.quiet_hours_help": "Startet die Wiedergabe in diesen Zeiten über die Karte, beginnen die Lautsprecher mit der gewählten Lautstärke.",
    "settings.quiet_period": "Ruhezeit {index}",
    "settings.from": "Von",
    "settings.to": "Bis",
    "settings.start_volume": "{name}: Startlautstärke",
    "settings.add_quiet": "Ruhezeit hinzufügen",
    "settings.remove_quiet": "{name} entfernen",
    "settings.active_now": "Jetzt aktiv",
    "settings.quiet_active": "Ruhezeit aktiv: Wiedergabe startet mit {volume} %",
    "settings.shuffle": "Playlists zufällig abspielen",
    "settings.shuffle_help": "Startet Sonos-Favoriten wie Spotify-Playlists im Shuffle-Modus. Radiosender sind nicht betroffen.",
    "settings.storage_note": "Die Einstellungen werden in deinem Home-Assistant-Benutzerprofil gespeichert und gelten für alle Sonos Radio Cards.",
    "settings.save_failed": "Die Einstellungen konnten nicht im Profil gespeichert werden und liegen nur auf diesem Gerät.",
    "card.group_speakers": "Lautsprecher gruppieren",
    "card.sonos_group": "Sonos-Gruppe: {name}",
    "card.no_active_group": "Keine aktive Gruppe",
    "card.close": "Schließen",
    "card.room_in_group": "{name} in der Gruppe",
    "card.room_volume": "Lautstärke {name}",
    "room.not_found": "In Home Assistant nicht gefunden",
    "room.unavailable": "Nicht verfügbar – Strom und Netzwerk prüfen",
    "room.leaving": "Verlässt die Gruppe…",
    "room.joining": "Tritt der Gruppe bei…",
    "room.master": "Gruppen-Master",
    "room.master_only": "Master · einziger Raum in der Gruppe",
    "room.in_group": "In der Gruppe",
    "room.not_in_group": "Nicht in der Gruppe",
    "issue.no_favorite": "Kein Sonos-Favorit ausgewählt.",
    "issue.no_url": "Keine Stream-URL angegeben.",
    "issue.url_as_favorite": "Das sieht nach einer URL aus. Stelle den Typ auf „Stream-URL“.",
    "issue.url_spaces": "Die Stream-URL enthält Leerzeichen.",
    "issue.url_scheme": "Die Stream-URL sollte mit http:// oder https:// beginnen.",
    "notice.no_speakers": "Keine Sonos-Lautsprecher eingerichtet. Bearbeite die Karte und füge mindestens einen Lautsprecher hinzu.",
    "notice.not_media_player": "{entity} ist kein Media-Player. Wähle im Karteneditor eine Sonos-media_player-Entität.",
    "notice.not_found": "{entity} wurde in Home Assistant nicht gefunden. Prüfe die Entitäts-ID im Karteneditor.",
    "notice.speaker_unavailable": "{name} ist nicht verfügbar. Prüfe, ob der Lautsprecher eingeschaltet und mit dem Netzwerk verbunden ist.",
    "notice.all_unavailable": "Alle Sonos-Lautsprecher sind nicht verfügbar. Prüfe Strom, Netzwerk und die Sonos-Integration in Home Assistant.",
    "notice.master_fallback": "Standard-Lautsprecher {master} ist nicht verfügbar, stattdessen wird {name} verwendet.",
    "editor.general": "Allgemein und Lautsprecher",
    "editor.title": "Kartentitel",
    "editor.master": "Standard-Master-Lautsprecher",
    "editor.master_helper": "Leer lassen, um den aktuellen Master der Sonos-Gruppe automatisch zu erkennen.",
    "editor.speakers": "Sonos-Lautsprecher",
    "editor.speaker_n": "Lautsprecher {n}",
    "editor.speaker_up": "Lautsprecher nach oben",
    "editor.speaker_down": "Lautsprecher nach unten",
    "editor.speaker_remove": "Lautsprecher entfernen",
    "editor.speaker_entity": "Lautsprecher-Entität",
    "editor.display_name": "Anzeigename",
    "editor.icon": "Symbol",
    "editor.add_speaker": "Lautsprecher hinzufügen",
    "editor.stations": "Radiosender",
    "editor.station_n": "Sender {n}",
    "editor.station_up": "Sender nach oben",
    "editor.station_down": "Sender nach unten",
    "editor.station_remove": "Sender entfernen",
    "editor.station_name": "Sendername",
    "editor.content_type": "Medientyp",
    "editor.type_music": "Stream-URL (music / Radio Browser)",
    "editor.type_favorite": "Sonos-Favorit",
    "editor.content_id": "Stream-URL / Medien-ID",
    "editor.content_id_placeholder": "https://... oder Sonos-Favoriten-ID",
    "editor.logo": "Logo-URL oder media-source",
    "editor.logo_placeholder": "https://... oder media-source://...",
    "editor.helper_favorite": "Wähle einen Favoriten oder gib die Sonos-Favoriten-ID ein (z. B. FV:2/12).",
    "editor.helper_music": "Radio-Browser-Sender nutzen ihre Stream-URL mit dem Medientyp „music“.",
    "editor.add_station": "Sender hinzufügen",
    "editor.favorite": "Sonos-Favorit",
    "editor.favorites_loading": "Sonos-Favoriten werden geladen…",
    "editor.favorites_failed": "Sonos-Favoriten konnten nicht geladen werden. Gib die Favoriten-ID manuell ein.",
    "editor.favorites_empty": "Keine Sonos-Favoriten gefunden. Lege Favoriten in der Sonos-App an.",
    "editor.favorites_reload": "Favoriten neu laden",
    "editor.search_title": "Sender bei Radio Browser suchen",
    "editor.search_label": "Sendername",
    "editor.search": "Suchen",
    "editor.search_helper": "Durchsucht das öffentliche Verzeichnis radio-browser.info. Es wird nur der Suchbegriff übertragen.",
    "editor.search_empty": "Keine Sender gefunden.",
    "editor.search_failed": "Radio Browser ist nicht erreichbar. Versuche es später erneut.",
    "editor.search_add": "Hinzufügen",
    "editor.search_added": "Hinzugefügt",
    "editor.browse_logo": "Logo aus Medien wählen",
    "editor.browse_title": "Medien",
    "editor.browse_back": "Zurück",
    "editor.browse_close": "Medienbrowser schließen",
    "editor.browse_empty": "Dieser Ordner enthält keine Bilder.",
    "editor.browse_failed": "Der Medienbrowser konnte nicht geöffnet werden.",
    "editor.browse_loading": "Wird geladen…",
};
const TRANSLATIONS = { en, de };
const format = (template, vars) => vars
    ? template.replace(/\{(\w+)\}/g, (match, name) => name in vars ? String(vars[name]) : match)
    : template;
/** Returns a translator for `language` (e.g. "de-AT"), falling back to English. */
const createTranslator = (language) => {
    const base = (language ?? "en").toLowerCase().split("-")[0];
    const strings = TRANSLATIONS[base] ?? en;
    return (key, vars) => format(strings[key] ?? en[key], vars);
};
const languageOf = (hass) => hass?.locale?.language ?? hass?.language;

/**
 * Throttles volume slider changes per slider key.
 *
 * - While dragging, at most one call per interval is sent (leading and
 *   trailing), and never more than one call per slider is in flight.
 * - The dragged value is kept as a draft until Home Assistant reports a
 *   matching volume (or `holdMs` elapses), so the slider does not jump back
 *   to stale state updates.
 */
class VolumeThrottle {
    constructor(send, onChange, options = {}) {
        this._entries = new Map();
        this._send = send;
        this._onChange = onChange;
        this._intervalMs = options.intervalMs ?? 300;
        this._holdMs = options.holdMs ?? 2500;
        this._tolerance = options.tolerance ?? 0.011;
    }
    draft(key) {
        return this._entries.get(key)?.draft;
    }
    keys() {
        return [...this._entries.keys()];
    }
    /** Called for every `input` event while the slider is dragged. */
    input(key, level) {
        const entry = this._entries.get(key) ?? {
            draft: level,
            dragging: true,
            lastSentAt: Number.NEGATIVE_INFINITY,
            inFlight: false,
        };
        entry.draft = level;
        entry.dragging = true;
        clearTimeout(entry.holdTimer);
        entry.holdTimer = undefined;
        this._entries.set(key, entry);
        this._schedule(key, entry);
        this._onChange();
    }
    /** Called on `change` (slider released): sends the final value right away. */
    commit(key, level) {
        const entry = this._entries.get(key);
        if (!entry) {
            if (level !== undefined) {
                this.input(key, level);
                this.commit(key);
            }
            return;
        }
        if (level !== undefined) {
            entry.draft = level;
        }
        entry.dragging = false;
        clearTimeout(entry.timer);
        entry.timer = undefined;
        this._flush(key, entry);
        this._startHold(key, entry);
    }
    /** Releases the draft once Home Assistant reports the requested volume. */
    reconcile(key, actual) {
        const entry = this._entries.get(key);
        if (entry &&
            actual !== undefined &&
            this._settled(entry) &&
            Math.abs(actual - entry.draft) <= this._tolerance) {
            this._release(key);
        }
    }
    dispose() {
        for (const entry of this._entries.values()) {
            clearTimeout(entry.timer);
            clearTimeout(entry.holdTimer);
        }
        this._entries.clear();
    }
    _settled(entry) {
        return (!entry.dragging &&
            !entry.inFlight &&
            entry.timer === undefined &&
            entry.sent === entry.draft);
    }
    _schedule(key, entry) {
        if (entry.timer !== undefined || entry.inFlight) {
            // The latest draft is picked up by the pending timer or after the
            // in-flight call finishes.
            return;
        }
        const wait = entry.lastSentAt + this._intervalMs - Date.now();
        if (wait <= 0) {
            this._flush(key, entry);
        }
        else {
            entry.timer = setTimeout(() => {
                entry.timer = undefined;
                this._flush(key, entry);
            }, wait);
        }
    }
    _flush(key, entry) {
        if (entry.inFlight || entry.draft === entry.sent) {
            return;
        }
        const level = entry.draft;
        entry.sent = level;
        entry.lastSentAt = Date.now();
        entry.inFlight = true;
        void this._send(key, level)
            .catch(() => false)
            .then((ok) => {
            entry.inFlight = false;
            if (this._entries.get(key) !== entry) {
                return;
            }
            if (!ok && !entry.dragging) {
                // Show the real volume again instead of a value that was rejected.
                this._release(key);
            }
            else if (entry.draft !== entry.sent) {
                if (entry.dragging) {
                    this._schedule(key, entry);
                }
                else {
                    this._flush(key, entry);
                }
            }
        });
    }
    _startHold(key, entry) {
        clearTimeout(entry.holdTimer);
        entry.holdTimer = setTimeout(() => {
            entry.holdTimer = undefined;
            if (this._entries.get(key) !== entry) {
                return;
            }
            if (this._settled(entry)) {
                this._release(key);
            }
            else if (!entry.dragging) {
                this._startHold(key, entry);
            }
        }, this._holdMs);
    }
    _release(key) {
        const entry = this._entries.get(key);
        if (!entry) {
            return;
        }
        clearTimeout(entry.timer);
        clearTimeout(entry.holdTimer);
        this._entries.delete(key);
        this._onChange();
    }
}

const SETTINGS_KEY = "sonos-radio-card";
const DEFAULT_SETTINGS = {
    max_volume: 100,
    quiet_hours: [],
    shuffle_playlists: false,
};
const DEFAULT_QUIET_PERIOD = {
    start: "22:00",
    end: "07:00",
    volume: 15,
};
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const percent = (value, min, fallback) => typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(min, Math.round(value)))
    : fallback;
const time = (value, fallback) => typeof value === "string" && TIME_PATTERN.test(value) ? value : fallback;
/** Turns stored (possibly outdated or hand-edited) data into valid settings. */
const normalizeSettings = (raw) => {
    const data = raw && typeof raw === "object" ? raw : {};
    const periods = Array.isArray(data.quiet_hours) ? data.quiet_hours : [];
    return {
        max_volume: percent(data.max_volume, 1, DEFAULT_SETTINGS.max_volume),
        quiet_hours: periods
            .filter((item) => Boolean(item && typeof item === "object"))
            .map((item) => ({
            start: time(item.start, DEFAULT_QUIET_PERIOD.start),
            end: time(item.end, DEFAULT_QUIET_PERIOD.end),
            volume: percent(item.volume, 0, DEFAULT_QUIET_PERIOD.volume),
        })),
        shuffle_playlists: data.shuffle_playlists === true,
    };
};
const minutesOf = (value) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
};
/** Equal start and end times cover the whole day. */
const isInPeriod = (period, now) => {
    const start = minutesOf(period.start);
    const end = minutesOf(period.end);
    const current = now.getHours() * 60 + now.getMinutes();
    if (start === end) {
        return true;
    }
    return start < end
        ? current >= start && current < end
        : current >= start || current < end;
};
/** The quietest active period wins when windows overlap. */
const activeQuietPeriod = (settings, now) => settings.quiet_hours
    .filter((period) => isInPeriod(period, now))
    .sort((a, b) => a.volume - b.volume)[0];
const maxLevel = (settings) => settings.max_volume / 100;
const capLevel = (level, settings) => Math.min(level, maxLevel(settings));
/**
 * Volume (0-1) a speaker should be set to before playback starts, or
 * `undefined` to leave it alone. Quiet hours only apply when playback starts;
 * the maximum volume always applies.
 */
const startLevel = (current, settings, now, starting) => {
    const quiet = starting ? activeQuietPeriod(settings, now) : undefined;
    const target = quiet !== undefined
        ? capLevel(quiet.volume / 100, settings)
        : current !== undefined && current > maxLevel(settings)
            ? maxLevel(settings)
            : undefined;
    return target !== undefined &&
        (current === undefined || Math.abs(current - target) >= 0.005)
        ? target
        : undefined;
};
/**
 * Stations that may start a queue (Sonos favorites, playlists, Spotify URIs).
 * Radio streams cannot be shuffled.
 */
const isShuffleCandidate = (station) => {
    const type = (station.media_content_type || "").toLowerCase();
    const id = station.media_content_id.trim().toLowerCase();
    return (type === "favorite_item_id" ||
        type === "playlist" ||
        id.startsWith("spotify:") ||
        id.startsWith("https://open.spotify.com/"));
};

const FAVORITE_TYPE$1 = "favorite_item_id";
const absoluteUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined;
const browsePlayer = (hass, entityId, media_content_type, media_content_id) => hass.callWS({
    type: "media_player/browse_media",
    entity_id: entityId,
    media_content_type,
    media_content_id,
});
const favoritesFromSensor = (hass) => {
    for (const [entityId, entity] of Object.entries(hass.states)) {
        const items = entity.attributes.items;
        if (entityId.startsWith("sensor.") &&
            entityId.includes("sonos_favorites") &&
            items &&
            typeof items === "object") {
            return Object.entries(items).map(([id, title]) => ({ id, title: typeof title === "string" ? title : id }));
        }
    }
    return [];
};
/**
 * Loads the "My Sonos" favorites through the media browser of the first
 * reachable speaker (with artwork), falling back to `sensor.sonos_favorites`.
 */
const loadSonosFavorites = async (hass, entityIds) => {
    let lastError;
    for (const entityId of entityIds) {
        if (!hass.states[entityId]) {
            continue;
        }
        try {
            const root = await browsePlayer(hass, entityId, "favorites", "");
            const items = [];
            for (const child of root.children ?? []) {
                if (child.media_content_type === FAVORITE_TYPE$1) {
                    items.push(child);
                }
                else if (child.can_expand) {
                    const folder = await browsePlayer(hass, entityId, child.media_content_type, child.media_content_id);
                    items.push(...(folder.children ?? []).filter((item) => item.media_content_type === FAVORITE_TYPE$1));
                }
            }
            return items.map((item) => ({
                id: item.media_content_id,
                title: item.title,
                thumbnail: absoluteUrl(item.thumbnail),
            }));
        }
        catch (error) {
            lastError = error;
        }
    }
    const fromSensor = favoritesFromSensor(hass);
    if (fromSensor.length > 0 || lastError === undefined) {
        return fromSensor;
    }
    throw lastError instanceof Error ? lastError : new Error("Browse failed");
};
/** Browses Home Assistant media sources; omit `id` for the root. */
const browseMediaSource = (hass, id) => hass.callWS(id
    ? { type: "media_source/browse_media", media_content_id: id }
    : { type: "media_source/browse_media" });
const isImage = (item) => item.media_class === "image" || item.media_content_type.startsWith("image/");

// radio-browser.info asks clients to use its DNS-balanced mirrors; the "all"
// host lists the currently active ones.
const MIRRORS = [
    "https://de1.api.radio-browser.info",
    "https://all.api.radio-browser.info",
];
const REQUEST_TIMEOUT_MS = 8000;
const httpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value.trim())
    ? value.trim()
    : undefined;
/** Maps a raw Radio Browser station to a result, or drops unusable entries. */
const toRadioBrowserResult = (raw) => {
    if (!raw || typeof raw !== "object") {
        return undefined;
    }
    const item = raw;
    const url = httpUrl(item.url_resolved) ?? httpUrl(item.url);
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!url || !name) {
        return undefined;
    }
    return {
        id: typeof item.stationuuid === "string" ? item.stationuuid : url,
        name,
        url,
        favicon: httpUrl(item.favicon),
        codec: typeof item.codec === "string" && item.codec.length > 0
            ? item.codec
            : undefined,
        bitrate: typeof item.bitrate === "number" && item.bitrate > 0
            ? item.bitrate
            : undefined,
        country: typeof item.countrycode === "string" && item.countrycode.length > 0
            ? item.countrycode
            : undefined,
    };
};
/** Searches radio-browser.info by station name, most popular first. */
const searchRadioBrowser = async (query, fetchFn = (input, init) => fetch(input, init), limit = 12) => {
    const params = new URLSearchParams({
        name: query.trim(),
        limit: String(limit),
        hidebroken: "true",
        order: "clickcount",
        reverse: "true",
    });
    let lastError;
    for (const mirror of MIRRORS) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const response = await fetchFn(`${mirror}/json/stations/search?${params.toString()}`, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`Radio Browser responded with ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Unexpected Radio Browser response");
            }
            const seen = new Set();
            return data
                .map(toRadioBrowserResult)
                .filter((item) => {
                if (!item || seen.has(item.url)) {
                    return false;
                }
                seen.add(item.url);
                return true;
            });
        }
        catch (error) {
            lastError = error;
        }
        finally {
            clearTimeout(timer);
        }
    }
    throw lastError instanceof Error
        ? lastError
        : new Error("Radio Browser is not reachable");
};

const FAVORITE_TYPE = "favorite_item_id";
const MEDIA_PLAYER = { entity: { filter: { domain: "media_player" } } };
// All inputs are rendered through <ha-form> selectors. Home Assistant loads
// and maintains these fields itself, while internal elements such as
// <ha-textfield> or <ha-select> change between releases.
const GENERAL_SCHEMA = [
    { name: "title", selector: { text: {} } },
    { name: "master_entity", selector: MEDIA_PLAYER },
];
const SPEAKER_SCHEMA = [
    { name: "entity", required: true, selector: MEDIA_PLAYER },
    {
        name: "",
        type: "grid",
        schema: [
            { name: "name", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } },
        ],
    },
];
const SOURCE_SCHEMA = [
    { name: "media_content_id", required: true, selector: { text: {} } },
];
const LOGO_SCHEMA = [{ name: "logo", selector: { text: {} } }];
const SEARCH_SCHEMA = [
    { name: "query", selector: { text: { type: "search" } } },
];
const formValue = (event) => {
    // Each sub form is handled here; the card editor only needs config-changed.
    event.stopPropagation();
    const value = event.detail?.value;
    return value && typeof value === "object" ? value : {};
};
const asString = (value) => (typeof value === "string" ? value : "");
class SonosRadioCardEditor extends i$1 {
    constructor() {
        super(...arguments);
        this._favorites = [];
        this._favoritesState = "idle";
        this._searchQuery = "";
        this._searchState = "idle";
        this._searchResults = [];
        this._searchRun = 0;
        this._computeLabel = (schema) => {
            const key = {
                title: "editor.title",
                master_entity: "editor.master",
                entity: "editor.speaker_entity",
                icon: "editor.icon",
                media_content_type: "editor.content_type",
                media_content_id: "editor.content_id",
                logo: "editor.logo",
                favorite: "editor.favorite",
                query: "editor.search_label",
            }[schema.name];
            return key ? this._t(key) : schema.name;
        };
        this._speakerLabel = (schema) => schema.name === "name"
            ? this._t("editor.display_name")
            : this._computeLabel(schema);
        this._stationLabel = (schema) => schema.name === "name"
            ? this._t("editor.station_name")
            : this._computeLabel(schema);
        this._computeHelper = (schema) => schema.name === "master_entity"
            ? this._t("editor.master_helper")
            : schema.name === "media_content_id"
                ? this._t("editor.content_id_placeholder")
                : schema.name === "logo"
                    ? this._t("editor.logo_placeholder")
                    : undefined;
    }
    static { this.properties = {
        _config: { state: true },
        _favorites: { state: true },
        _favoritesState: { state: true },
        _searchQuery: { state: true },
        _searchState: { state: true },
        _searchResults: { state: true },
        _browser: { state: true },
    }; }
    static { this.styles = i$4 `
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 24px;
    }

    .section {
      display: grid;
      gap: 16px;
    }

    h3,
    h4 {
      margin: 0;
    }

    .item {
      display: grid;
      gap: 16px;
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-md, 8px);
    }

    .item-header,
    .item-actions,
    .with-action {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-header {
      justify-content: space-between;
    }

    .item-actions {
      justify-content: flex-end;
    }

    .with-action > :first-child {
      flex: 1;
      min-width: 0;
    }

    .helper {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }

    .helper.warning {
      color: var(--warning-color, #ffa600);
    }

    .results,
    .browser-list {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .result,
    .browser-item {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 48px;
      padding: 4px 8px;
      border-radius: var(--ha-border-radius-sm, 6px);
    }

    .result:hover,
    .browser-item:hover {
      background: var(--secondary-background-color);
    }

    .result-logo,
    .browser-thumb {
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: contain;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      --mdc-icon-size: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .result-text {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
    }

    .result-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .browser {
      display: grid;
      gap: 8px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-md, 8px);
    }

    .browser-header {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .browser-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .browser-item {
      width: 100%;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
  `; }
    setConfig(config) {
        this._config = {
            ...config,
            type: "custom:sonos-radio-card",
            speakers: (config.speakers ?? []).map((speaker) => ({ ...speaker })),
            stations: (config.stations ?? []).map((station) => ({ ...station })),
        };
    }
    set hass(hass) {
        this._hass = hass;
        this.requestUpdate();
    }
    get hass() {
        return this._hass;
    }
    get _t() {
        const language = languageOf(this._hass);
        if (!this._translator || this._translator.language !== language) {
            this._translator = { language, t: createTranslator(language) };
        }
        return this._translator.t;
    }
    willUpdate(_changed) {
        if (this._favoritesState === "idle" &&
            this._hass &&
            this._config?.stations.some((station) => station.media_content_type === FAVORITE_TYPE)) {
            void this._loadFavorites();
        }
    }
    _stationSchema() {
        const language = languageOf(this._hass);
        if (!this._stationSchemaCache || this._stationSchemaCache.language !== language) {
            const t = this._t;
            this._stationSchemaCache = {
                language,
                schema: [
                    { name: "name", required: true, selector: { text: {} } },
                    {
                        name: "media_content_type",
                        required: true,
                        selector: {
                            select: {
                                mode: "list",
                                options: [
                                    { value: "music", label: t("editor.type_music") },
                                    { value: FAVORITE_TYPE, label: t("editor.type_favorite") },
                                ],
                            },
                        },
                    },
                ],
            };
        }
        return this._stationSchemaCache.schema;
    }
    _favoriteSchema() {
        if (!this._favoriteSchemaCache || this._favoriteSchemaCache.favorites !== this._favorites) {
            this._favoriteSchemaCache = {
                favorites: this._favorites,
                schema: [
                    {
                        name: "favorite",
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: this._favorites.map((favorite) => ({
                                    value: favorite.id,
                                    label: favorite.title,
                                })),
                            },
                        },
                    },
                ],
            };
        }
        return this._favoriteSchemaCache.schema;
    }
    _generalChanged(event) {
        if (!this._config) {
            return;
        }
        const { title, master_entity } = formValue(event);
        const config = {
            ...this._config,
            title: this._optionalString(title),
            master_entity: this._optionalString(master_entity),
        };
        this._updateConfig(config);
    }
    _speakerChanged(index, event) {
        const value = formValue(event);
        this._updateSpeaker(index, {
            entity: asString(value.entity),
            name: this._optionalString(value.name),
            icon: this._optionalString(value.icon),
        });
    }
    _stationChanged(index, event) {
        const station = this._config?.stations[index];
        if (!station) {
            return;
        }
        const value = formValue(event);
        this._updateStation(index, {
            name: asString(value.name),
            media_content_type: asString(value.media_content_type) || station.media_content_type,
        });
    }
    _sourceChanged(index, event) {
        this._updateStation(index, {
            media_content_id: asString(formValue(event).media_content_id),
        });
    }
    _logoChanged(index, event) {
        this._updateStation(index, {
            logo: this._optionalString(formValue(event).logo),
        });
    }
    _updateConfig(config) {
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
        }));
    }
    _optionalString(value) {
        return typeof value === "string" && value.length > 0 ? value : undefined;
    }
    _updateSpeaker(index, updates) {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            speakers: this._config.speakers.map((speaker, itemIndex) => itemIndex === index ? { ...speaker, ...updates } : speaker),
        });
    }
    _updateStation(index, updates) {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            stations: this._config.stations.map((station, itemIndex) => itemIndex === index ? { ...station, ...updates } : station),
        });
    }
    _move(items, index, offset) {
        const targetIndex = index + offset;
        if (targetIndex < 0 || targetIndex >= items.length) {
            return undefined;
        }
        const moved = [...items];
        [moved[index], moved[targetIndex]] = [moved[targetIndex], moved[index]];
        return moved;
    }
    _moveSpeaker(index, offset) {
        const speakers = this._config && this._move(this._config.speakers, index, offset);
        if (this._config && speakers) {
            this._updateConfig({ ...this._config, speakers });
        }
    }
    _moveStation(index, offset) {
        const stations = this._config && this._move(this._config.stations, index, offset);
        if (this._config && stations) {
            this._browser = undefined;
            this._updateConfig({ ...this._config, stations });
        }
    }
    _addSpeaker() {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            speakers: [...this._config.speakers, { entity: "" }],
        });
    }
    _removeSpeaker(index) {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            speakers: this._config.speakers.filter((_, itemIndex) => itemIndex !== index),
        });
    }
    _addStation(station) {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            stations: [
                ...this._config.stations,
                station ?? { name: "", media_content_id: "", media_content_type: "music" },
            ],
        });
    }
    _removeStation(index) {
        if (!this._config) {
            return;
        }
        this._browser = undefined;
        this._updateConfig({
            ...this._config,
            stations: this._config.stations.filter((_, itemIndex) => itemIndex !== index),
        });
    }
    _favoriteEntities() {
        const config = this._config;
        if (!config) {
            return [];
        }
        return [
            ...new Set([config.master_entity ?? "", ...config.speakers.map((s) => s.entity)].filter((id) => id.startsWith("media_player."))),
        ];
    }
    async _loadFavorites() {
        if (!this._hass || this._favoritesState === "loading") {
            return;
        }
        this._favoritesState = "loading";
        try {
            this._favorites = await loadSonosFavorites(this._hass, this._favoriteEntities());
            this._favoritesState = "done";
        }
        catch {
            this._favorites = [];
            this._favoritesState = "error";
        }
    }
    _pickFavorite(index, id) {
        const station = this._config?.stations[index];
        const favorite = this._favorites.find((item) => item.id === id);
        if (!station || !favorite || station.media_content_id === id) {
            return;
        }
        this._updateStation(index, {
            media_content_id: favorite.id,
            name: station.name || favorite.title,
            logo: station.logo || favorite.thumbnail,
        });
    }
    async _search() {
        const query = this._searchQuery.trim();
        if (!query) {
            return;
        }
        const run = ++this._searchRun;
        this._searchState = "loading";
        try {
            const results = await searchRadioBrowser(query);
            if (run === this._searchRun) {
                this._searchResults = results;
                this._searchState = "done";
            }
        }
        catch {
            if (run === this._searchRun) {
                this._searchResults = [];
                this._searchState = "error";
            }
        }
    }
    _searchKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            void this._search();
        }
    }
    _addResult(result) {
        this._addStation({
            name: result.name,
            media_content_id: result.url,
            media_content_type: "music",
            ...(result.favicon ? { logo: result.favicon } : {}),
        });
    }
    async _browse(index, item) {
        const hass = this._hass;
        if (!hass) {
            return;
        }
        const stack = item && this._browser?.index === index ? this._browser.stack : [];
        this._browser = { index, stack, state: "loading" };
        try {
            const result = await browseMediaSource(hass, item?.media_content_id);
            if (this._browser?.index === index) {
                this._browser = { index, stack: [...stack, result], state: "done" };
            }
        }
        catch {
            if (this._browser?.index === index) {
                this._browser = { index, stack, state: "error" };
            }
        }
    }
    _browseBack() {
        if (this._browser && this._browser.stack.length > 1) {
            this._browser = {
                ...this._browser,
                stack: this._browser.stack.slice(0, -1),
                state: "done",
            };
        }
    }
    _toggleBrowser(index) {
        if (this._browser?.index === index) {
            this._browser = undefined;
        }
        else {
            void this._browse(index);
        }
    }
    _pickLogo(index, item) {
        this._browser = undefined;
        this._updateStation(index, { logo: item.media_content_id });
    }
    render() {
        const config = this._config;
        if (!config) {
            return A;
        }
        const t = this._t;
        return b `
      <div class="editor">
        <section class="section">
          <h3>${t("editor.general")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${{
            title: config.title,
            master_entity: config.master_entity,
        }}
            .schema=${GENERAL_SCHEMA}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._generalChanged}
          ></ha-form>

          <div class="section">
            <h4>${t("editor.speakers")}</h4>
            ${config.speakers.map((speaker, index) => this._renderSpeaker(speaker, index, config.speakers.length))}
            <ha-button @click=${() => this._addSpeaker()}>
              ${t("editor.add_speaker")}
            </ha-button>
          </div>
        </section>

        <section class="section">
          <h3>${t("editor.stations")}</h3>
          ${config.stations.map((station, index) => this._renderStation(station, index, config.stations.length))}
          <ha-button @click=${() => this._addStation()}>
            ${t("editor.add_station")}
          </ha-button>
          ${this._renderSearch()}
        </section>
      </div>
    `;
    }
    _renderSpeaker(speaker, index, count) {
        const t = this._t;
        return b `
      <div class="item">
        <div class="item-header">
          <strong>${t("editor.speaker_n", { n: index + 1 })}</strong>
          <div class="item-actions">
            <ha-icon-button
              .label=${t("editor.speaker_up")}
              .disabled=${index === 0}
              @click=${() => this._moveSpeaker(index, -1)}
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.speaker_down")}
              .disabled=${index === count - 1}
              @click=${() => this._moveSpeaker(index, 1)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.speaker_remove")}
              @click=${() => this._removeSpeaker(index)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </div>
        <ha-form
          class="speaker-form"
          .hass=${this._hass}
          .data=${{ entity: speaker.entity, name: speaker.name, icon: speaker.icon }}
          .schema=${SPEAKER_SCHEMA}
          .computeLabel=${this._speakerLabel}
          @value-changed=${(event) => this._speakerChanged(index, event)}
        ></ha-form>
      </div>
    `;
    }
    _renderStation(station, index, count) {
        const t = this._t;
        const isFavorite = station.media_content_type === FAVORITE_TYPE;
        const issue = station.media_content_id
            ? stationIssue(station, t)
            : undefined;
        return b `
      <div class="item station">
        <div class="item-header">
          <strong>${t("editor.station_n", { n: index + 1 })}</strong>
          <div class="item-actions">
            <ha-icon-button
              .label=${t("editor.station_up")}
              .disabled=${index === 0}
              @click=${() => this._moveStation(index, -1)}
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.station_down")}
              .disabled=${index === count - 1}
              @click=${() => this._moveStation(index, 1)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.station_remove")}
              @click=${() => this._removeStation(index)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </div>
        <ha-form
          class="station-form"
          .hass=${this._hass}
          .data=${{
            name: station.name,
            media_content_type: station.media_content_type,
        }}
          .schema=${this._stationSchema()}
          .computeLabel=${this._stationLabel}
          @value-changed=${(event) => this._stationChanged(index, event)}
        ></ha-form>
        ${isFavorite ? this._renderFavoritePicker(station, index) : A}
        <ha-form
          class="source-form"
          .hass=${this._hass}
          .data=${{ media_content_id: station.media_content_id }}
          .schema=${SOURCE_SCHEMA}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${(event) => this._sourceChanged(index, event)}
        ></ha-form>
        <div class="with-action">
          <ha-form
            class="logo-form"
            .hass=${this._hass}
            .data=${{ logo: station.logo }}
            .schema=${LOGO_SCHEMA}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${(event) => this._logoChanged(index, event)}
          ></ha-form>
          <ha-icon-button
            class="browse-logo"
            .label=${t("editor.browse_logo")}
            .disabled=${!this._hass}
            @click=${() => this._toggleBrowser(index)}
          >
            <ha-icon icon="mdi:image-search-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${this._browser?.index === index ? this._renderBrowser(index) : A}
        <div class="helper">
          ${isFavorite ? t("editor.helper_favorite") : t("editor.helper_music")}
        </div>
        ${issue
            ? b `<div class="helper warning" role="status">${issue}</div>`
            : A}
      </div>
    `;
    }
    _renderFavoritePicker(station, index) {
        const t = this._t;
        if (this._favoritesState === "loading" || this._favoritesState === "idle") {
            return b `<div class="helper">${t("editor.favorites_loading")}</div>`;
        }
        const message = this._favoritesState === "error"
            ? t("editor.favorites_failed")
            : this._favorites.length === 0
                ? t("editor.favorites_empty")
                : undefined;
        return b `
      <div class="with-action">
        ${message
            ? b `<div class="helper warning" role="status">${message}</div>`
            : b `<ha-form
              class="favorite-form"
              .hass=${this._hass}
              .data=${{
                favorite: this._favorites.some((favorite) => favorite.id === station.media_content_id)
                    ? station.media_content_id
                    : undefined,
            }}
              .schema=${this._favoriteSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${(event) => this._pickFavorite(index, asString(formValue(event).favorite))}
            ></ha-form>`}
        <ha-icon-button
          class="reload-favorites"
          .label=${t("editor.favorites_reload")}
          @click=${() => {
            this._favoritesState = "idle";
            void this._loadFavorites();
        }}
        >
          <ha-icon icon="mdi:refresh"></ha-icon>
        </ha-icon-button>
      </div>
    `;
    }
    _renderBrowser(index) {
        const t = this._t;
        const browser = this._browser;
        const current = browser.stack[browser.stack.length - 1];
        const children = (current?.children ?? []).filter((item) => item.can_expand || isImage(item));
        return b `
      <div class="browser">
        <div class="browser-header">
          ${browser.stack.length > 1
            ? b `<ha-icon-button
                .label=${t("editor.browse_back")}
                @click=${() => this._browseBack()}
              >
                <ha-icon icon="mdi:arrow-left"></ha-icon>
              </ha-icon-button>`
            : A}
          <span class="browser-title">
            ${current?.title ?? t("editor.browse_title")}
          </span>
          <ha-icon-button
            .label=${t("editor.browse_close")}
            @click=${() => (this._browser = undefined)}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </ha-icon-button>
        </div>
        ${browser.state === "loading"
            ? b `<div class="helper">${t("editor.browse_loading")}</div>`
            : browser.state === "error"
                ? b `<div class="helper warning" role="status">
                ${t("editor.browse_failed")}
              </div>`
                : children.length === 0
                    ? b `<div class="helper">${t("editor.browse_empty")}</div>`
                    : b `<ul class="browser-list">
                  ${children.map((item) => b `<li>
                      <button
                        class="browser-item"
                        @click=${() => item.can_expand
                        ? this._browse(index, item)
                        : this._pickLogo(index, item)}
                      >
                        ${item.thumbnail && /^https?:\/\//i.test(item.thumbnail)
                        ? b `<img class="browser-thumb" src=${item.thumbnail} alt="" />`
                        : b `<span class="browser-thumb">
                              <ha-icon
                                icon=${item.can_expand ? "mdi:folder" : "mdi:image"}
                              ></ha-icon>
                            </span>`}
                        <span class="result-name">${item.title}</span>
                      </button>
                    </li>`)}
                </ul>`}
      </div>
    `;
    }
    _renderSearch() {
        const t = this._t;
        const added = new Set(this._config?.stations.map((station) => station.media_content_id) ?? []);
        return b `
      <div class="section search">
        <h4>${t("editor.search_title")}</h4>
        <div class="with-action" @keydown=${this._searchKeydown}>
          <ha-form
            class="search-form"
            .hass=${this._hass}
            .data=${{ query: this._searchQuery }}
            .schema=${SEARCH_SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${(event) => (this._searchQuery = asString(formValue(event).query))}
          ></ha-form>
          <ha-button
            class="search-button"
            .disabled=${!this._searchQuery.trim() ||
            this._searchState === "loading"}
            @click=${() => this._search()}
          >
            ${t("editor.search")}
          </ha-button>
        </div>
        <div class="helper">${t("editor.search_helper")}</div>
        ${this._searchState === "loading"
            ? b `<div class="helper">${t("editor.browse_loading")}</div>`
            : this._searchState === "error"
                ? b `<div class="helper warning" role="status">
                ${t("editor.search_failed")}
              </div>`
                : this._searchState === "done" && this._searchResults.length === 0
                    ? b `<div class="helper">${t("editor.search_empty")}</div>`
                    : A}
        ${this._searchResults.length > 0
            ? b `<ul class="results">
              ${this._searchResults.map((result) => {
                const isAdded = added.has(result.url);
                const meta = [
                    result.codec,
                    result.bitrate ? `${result.bitrate} kbps` : undefined,
                    result.country,
                ]
                    .filter(Boolean)
                    .join(" · ");
                return b `<li class="result">
                  ${result.favicon
                    ? b `<img class="result-logo" src=${result.favicon} alt="" />`
                    : b `<span class="result-logo">
                        <ha-icon icon="mdi:radio"></ha-icon>
                      </span>`}
                  <span class="result-text">
                    <span class="result-name">${result.name}</span>
                    <span class="helper">${meta}</span>
                  </span>
                  <ha-button
                    class="add-result"
                    .disabled=${isAdded}
                    @click=${() => this._addResult(result)}
                  >
                    ${isAdded ? t("editor.search_added") : t("editor.search_add")}
                  </ha-button>
                </li>`;
            })}
            </ul>`
            : A}
      </div>
    `;
    }
}
if (!customElements.get("sonos-radio-card-editor")) {
    customElements.define("sonos-radio-card-editor", SonosRadioCardEditor);
}

const MEDIA_SOURCE_PREFIX = "media-source://";
// Unit and component tests load the sources without the Rollup replacement.
const CARD_VERSION = "0.1.0" ;
const GROUP_VOLUME_KEY = "__group__";
const PENDING_TIMEOUT_MS = 10000;
const VOLUME_THROTTLE_MS = 300;
const VOLUME_HOLD_MS = 2500;
const TOAST_TIMEOUT_MS = 8000;
const GROUP_CHANGE_TIMEOUT_MS = 8000;
const HANDOFF_SETTLE_MS = 3000;
const DRAWER_ANIMATION_MS = 220;
const SWIPE_SLOP_PX = 10;
const SWIPE_CLOSE_RATIO = 0.3;
const SWIPE_CLOSE_VELOCITY = 0.5;
const SETTINGS_SAVE_DELAY_MS = 500;
const SETTINGS_EVENT = "sonos-radio-card-settings";
const NOTICE_ICONS = {
    error: "mdi:alert-circle-outline",
    warning: "mdi:alert-outline",
    info: "mdi:information-outline",
};
const readLocalSettings = () => {
    try {
        const raw = window.localStorage.getItem(SETTINGS_KEY);
        return raw ? normalizeSettings(JSON.parse(raw)) : undefined;
    }
    catch {
        return undefined;
    }
};
const writeLocalSettings = (settings) => {
    try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
    catch {
        // Storage can be disabled (private mode); the profile copy still works.
    }
};
/** Playing or about to play; the transport button then offers Stop. */
const isRunning = (entity) => entity?.state === "playing" || entity?.state === "buffering";
/** HA rejects service calls with `{ code, message }` objects, not Errors. */
const errorMessage = (error) => {
    const message = error && typeof error === "object" && "message" in error
        ? error.message
        : undefined;
    return typeof message === "string" && message.length > 0
        ? message
        : undefined;
};
class SonosRadioCard extends i$1 {
    constructor() {
        super(...arguments);
        this._drawerOpen = false;
        this._drawerClosing = false;
        this._drawerView = "group";
        this._settings = DEFAULT_SETTINGS;
        this._settingsRequested = false;
        this._settingsEdited = false;
        this._volume = new VolumeThrottle((key, level) => this._sendVolume(key, level), () => this.requestUpdate(), { intervalMs: VOLUME_THROTTLE_MS, holdMs: VOLUME_HOLD_MS });
        this._membershipTargets = {};
        this._logoUrls = {};
        this._brokenLogos = [];
        this._resolvingLogos = new Set();
        this._waiters = new Set();
        /** Keeps several cards on the same dashboard in sync. */
        this._settingsBroadcast = (event) => {
            const detail = event
                .detail;
            if (detail.source !== this) {
                this._settings = detail.settings;
                this._settingsEdited = true;
            }
        };
        this._closeDrawer = () => {
            if (!this._drawerOpen || this._drawerClosing) {
                return;
            }
            this._swipe = undefined;
            const drawer = this._drawerElement;
            if (drawer) {
                drawer.classList.remove("dragging");
                drawer.style.transform = "";
            }
            this._drawerClosing = true;
            this._drawerTimer = window.setTimeout(() => {
                this._drawerOpen = false;
                this._drawerClosing = false;
            }, DRAWER_ANIMATION_MS);
        };
        this._handleKeydown = (event) => {
            if (event.key === "Escape") {
                this._closeDrawer();
            }
            else if (event.key === "Tab") {
                this._trapFocus(event);
            }
        };
    }
    static { this.properties = {
        _config: { state: true },
        _drawerOpen: { state: true },
        _drawerClosing: { state: true },
        _drawerView: { state: true },
        _settings: { state: true },
        _pendingStation: { state: true },
        _membershipTargets: { state: true },
        _coordinatorOverride: { state: true },
        _toast: { state: true },
        _logoUrls: { state: true },
        _brokenLogos: { state: true },
    }; }
    setConfig(config) {
        if (!config ||
            config.type !== "custom:sonos-radio-card" ||
            !Array.isArray(config.speakers) ||
            !Array.isArray(config.stations)) {
            throw new Error("Invalid Sonos Radio Card configuration: type, speakers, and stations are required.");
        }
        this._config = config;
        this._coordinatorOverride = undefined;
    }
    set hass(hass) {
        const previous = this._hass;
        this._hass = hass;
        for (const waiter of [...this._waiters]) {
            if (waiter.check(hass)) {
                this._settleWaiter(waiter, true);
            }
        }
        this.requestUpdate("hass", previous);
        if (!this._settingsRequested) {
            this._settingsRequested = true;
            void this._loadSettings();
        }
    }
    get hass() {
        return this._hass;
    }
    static getStubConfig() {
        return {
            type: "custom:sonos-radio-card",
            speakers: [],
            stations: [],
        };
    }
    static getConfigElement() {
        return document.createElement("sonos-radio-card-editor");
    }
    /** Height in 50 px units for the masonry view. */
    getCardSize() {
        const height = this.offsetHeight;
        if (height > 0) {
            return Math.max(1, Math.ceil(height / 50));
        }
        // Estimate before the first layout: four 150 px tiles per row plus the
        // control bar and the optional title.
        const rows = Math.ceil((this._config?.stations.length ?? 0) / 4);
        return (this._config?.title ? 1 : 0) + Math.max(rows, 1) * 3 + 2;
    }
    /** Size in the sections view: full width by default, height follows content. */
    getGridOptions() {
        return { columns: 12, rows: "auto", min_columns: 6 };
    }
    get _t() {
        const language = languageOf(this._hass);
        if (!this._translator || this._translator.language !== language) {
            this._translator = { language, t: createTranslator(language) };
        }
        return this._translator.t;
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(SETTINGS_EVENT, this._settingsBroadcast);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(SETTINGS_EVENT, this._settingsBroadcast);
        if (this._settingsTimer !== undefined) {
            window.clearTimeout(this._settingsTimer);
            void this._saveSettings();
        }
        this._volume.dispose();
        window.clearTimeout(this._pendingTimer);
        window.clearTimeout(this._toastTimer);
        window.clearTimeout(this._drawerTimer);
        for (const waiter of [...this._waiters]) {
            this._settleWaiter(waiter, false);
        }
        window.removeEventListener("keydown", this._handleKeydown);
    }
    willUpdate(changed) {
        if (changed.has("hass") || changed.has("_config")) {
            this._resolveLogos();
            for (const key of this._volume.keys()) {
                this._volume.reconcile(key, this._actualVolume(key));
            }
            if (this._pendingStation !== undefined &&
                this._pendingStation === this._activeStationIndex()) {
                this._clearPending();
            }
        }
        if (changed.has("_drawerOpen")) {
            if (this._drawerOpen) {
                window.addEventListener("keydown", this._handleKeydown);
            }
            else {
                window.removeEventListener("keydown", this._handleKeydown);
            }
        }
    }
    updated(changed) {
        // The initial render reports `undefined` as the previous value.
        if (changed.get("_drawerOpen") === undefined) {
            return;
        }
        const target = this._drawerOpen
            ? ".drawer .close"
            : this._drawerView === "settings"
                ? ".settings-button"
                : ".multiroom";
        this.renderRoot.querySelector(target)?.focus();
    }
    get _coordinatorId() {
        return this._hass && this._config
            ? resolveCoordinator(this._hass, this._config, this._coordinatorOverride)
            : undefined;
    }
    get _coordinator() {
        const id = this._coordinatorId;
        return id ? this._hass?.states[id] : undefined;
    }
    get _members() {
        const id = this._coordinatorId;
        return id && this._hass ? groupMembers(this._hass, id) : [];
    }
    _activeStationIndex() {
        return this._config
            ? findActiveStationIndex(this._config.stations, this._coordinator)
            : -1;
    }
    _speakerName(entityId, speaker) {
        const configured = speaker ?? this._config?.speakers.find((item) => item.entity === entityId);
        const friendlyName = this._hass?.states[entityId]?.attributes.friendly_name;
        return (configured?.name ??
            (typeof friendlyName === "string" ? friendlyName : undefined) ??
            entityId);
    }
    async _callService(service, data, failure) {
        if (!this._hass) {
            return false;
        }
        try {
            await this._hass.callService("media_player", service, data);
            return true;
        }
        catch (error) {
            const detail = errorMessage(error);
            const prefix = failure ?? this._t("card.service_failed", { service });
            this._showToast(detail ? `${prefix} ${detail}` : prefix);
            return false;
        }
    }
    _showToast(message, level = "error") {
        this._toast = { level, message };
        window.clearTimeout(this._toastTimer);
        this._toastTimer = window.setTimeout(() => this._dismissToast(), TOAST_TIMEOUT_MS);
    }
    _dismissToast() {
        window.clearTimeout(this._toastTimer);
        this._toast = undefined;
    }
    _clearPending() {
        window.clearTimeout(this._pendingTimer);
        this._pendingStation = undefined;
    }
    _pendingTimedOut(index) {
        const station = this._config?.stations[index];
        const stillPending = this._pendingStation === index;
        this._clearPending();
        // Matching can fail for streams that Sonos renames, so only complain if
        // nothing is playing at all.
        if (stillPending && station && this._coordinator?.state !== "playing") {
            this._showToast(this._t("card.station_timeout", {
                name: station.name || this._t("card.the_station"),
            }), "warning");
        }
    }
    async _playStation(index) {
        const station = this._config?.stations[index];
        const entityId = this._coordinatorId;
        if (!station || !entityId) {
            return;
        }
        if (!station.media_content_id?.trim()) {
            this._showToast(this._t("card.station_not_set_up", {
                name: station.name || this._t("card.this_station"),
                issue: stationIssue(station, this._t) ?? "",
            }), "warning");
            return;
        }
        this._pendingStation = index;
        window.clearTimeout(this._pendingTimer);
        this._pendingTimer = window.setTimeout(() => this._pendingTimedOut(index), PENDING_TIMEOUT_MS);
        const startVolumes = this._startVolumeCommands(this._members, this._coordinator?.state !== "playing");
        if (startVolumes.length > 0) {
            await this._sendVolumeCommands(startVolumes);
        }
        const played = await this._callService("play_media", {
            entity_id: entityId,
            media_content_id: station.media_content_id.trim(),
            media_content_type: station.media_content_type || "music",
        }, this._t("card.station_failed", {
            name: station.name || this._t("card.the_station"),
        }));
        if (!played) {
            this._clearPending();
        }
        else if (isShuffleCandidate(station)) {
            await this._applyShuffle(entityId);
        }
    }
    /** Sets Sonos' play mode for queue-based favorites such as Spotify playlists. */
    async _applyShuffle(entityId) {
        const shuffle = this._settings.shuffle_playlists;
        if (!this._hass || this._hass.states[entityId]?.attributes.shuffle === shuffle) {
            return;
        }
        try {
            await this._hass.callService("media_player", "shuffle_set", {
                entity_id: entityId,
                shuffle,
            });
        }
        catch {
            // Radio favorites have no queue and cannot be shuffled.
        }
    }
    /** Quiet-hour start volumes and the maximum volume for the given speakers. */
    _startVolumeCommands(entityIds, starting) {
        const hass = this._hass;
        if (!hass) {
            return [];
        }
        const now = new Date();
        return entityIds.flatMap((entityId) => {
            const current = hass.states[entityId]?.attributes.volume_level;
            const level = startLevel(typeof current === "number" ? current : undefined, this._settings, now, starting);
            return level === undefined
                ? []
                : [{ entity_id: entityId, volume_level: Math.round(level * 100) / 100 }];
        });
    }
    async _sendVolumeCommands(commands) {
        const results = await Promise.all(commands.map((command) => this._callService("volume_set", { ...command }, this._t("card.volume_failed", {
            name: this._speakerName(command.entity_id),
        }))));
        return results.every(Boolean);
    }
    /** One button for radio: stops a running stream, otherwise (re)starts playback. */
    async _togglePlayback() {
        const entityId = this._coordinatorId;
        if (!entityId) {
            return;
        }
        if (isRunning(this._coordinator)) {
            this._clearPending();
            await this._callService("media_stop", { entity_id: entityId });
            return;
        }
        const startVolumes = this._startVolumeCommands(this._members, true);
        if (startVolumes.length > 0) {
            await this._sendVolumeCommands(startVolumes);
        }
        await this._callService("media_play", { entity_id: entityId });
    }
    _sliderLevel(event) {
        return Number(event.target.value) / 100;
    }
    _volumeInput(key, event) {
        this._volume.input(key, this._sliderLevel(event));
    }
    _commitVolume(key, event) {
        this._volume.commit(key, this._sliderLevel(event));
    }
    _actualVolume(key) {
        if (!this._hass) {
            return undefined;
        }
        if (key === GROUP_VOLUME_KEY) {
            return groupVolume(this._hass, this._members);
        }
        const volume = this._hass.states[key]?.attributes.volume_level;
        return typeof volume === "number" ? volume : undefined;
    }
    async _sendVolume(key, requested) {
        if (!this._hass) {
            return false;
        }
        const level = capLevel(requested, this._settings);
        const commands = key === GROUP_VOLUME_KEY
            ? planGroupVolume(this._hass, this._members, level).map((command) => ({
                ...command,
                volume_level: capLevel(command.volume_level, this._settings),
            }))
            : [{ entity_id: key, volume_level: level }];
        return this._sendVolumeCommands(commands);
    }
    _waitFor(check, timeoutMs = GROUP_CHANGE_TIMEOUT_MS) {
        if (this._hass && check(this._hass)) {
            return Promise.resolve(true);
        }
        return new Promise((resolve) => {
            const waiter = {
                check,
                resolve,
                timer: window.setTimeout(() => this._settleWaiter(waiter, false), timeoutMs),
            };
            this._waiters.add(waiter);
        });
    }
    _settleWaiter(waiter, matched) {
        window.clearTimeout(waiter.timer);
        this._waiters.delete(waiter);
        waiter.resolve(matched);
    }
    _currentMedia() {
        const station = this._config?.stations[this._activeStationIndex()];
        if (station?.media_content_id) {
            return {
                media_content_id: station.media_content_id,
                media_content_type: station.media_content_type || "music",
            };
        }
        const attributes = this._coordinator?.attributes ?? {};
        const id = attributes.media_content_id;
        const type = attributes.media_content_type;
        return typeof id === "string" && id.length > 0
            ? {
                media_content_id: id,
                media_content_type: typeof type === "string" ? type : "music",
            }
            : undefined;
    }
    async _toggleSpeaker(entityId, join) {
        if (entityId in this._membershipTargets) {
            return;
        }
        this._membershipTargets = { ...this._membershipTargets, [entityId]: join };
        try {
            if (join) {
                await this._joinSpeaker(entityId);
            }
            else {
                await this._removeSpeaker(entityId);
            }
        }
        finally {
            // Fall back to the real group state: confirmed, reverted or timed out.
            const { [entityId]: _done, ...rest } = this._membershipTargets;
            this._membershipTargets = rest;
        }
    }
    async _joinSpeaker(entityId) {
        const master = this._coordinatorId;
        if (!master || master === entityId) {
            return;
        }
        const startVolumes = this._startVolumeCommands([entityId], this._coordinator?.state === "playing" &&
            this._hass?.states[entityId]?.state !== "playing");
        if (startVolumes.length > 0) {
            await this._sendVolumeCommands(startVolumes);
        }
        const joined = await this._callService("join", { entity_id: master, group_members: [entityId] }, this._t("card.join_failed", { name: this._speakerName(entityId) }));
        if (joined) {
            await this._waitFor((hass) => groupMembers(hass, master).includes(entityId));
        }
    }
    async _removeSpeaker(entityId) {
        if (!this._hass || !this._config) {
            return;
        }
        const plan = planSpeakerRemoval(this._hass, entityId, this._config.speakers.map((speaker) => speaker.entity));
        if (plan.type === "unjoin") {
            if (await this._callService("unjoin", { entity_id: entityId }, this._t("card.unjoin_failed", { name: this._speakerName(entityId) }))) {
                await this._waitFor((hass) => groupMembers(hass, entityId).length <= 1);
            }
        }
        else if (plan.type === "handoff") {
            await this._handoffAndRemove(plan);
        }
    }
    /**
     * Removes the group coordinator without silencing the remaining rooms:
     * Sonos usually promotes another member itself; otherwise the remaining
     * rooms are regrouped under the new master and the media is resumed there.
     */
    async _handoffAndRemove(plan) {
        const oldMaster = plan.entity;
        const wasPlaying = this._hass?.states[oldMaster]?.state === "playing";
        const media = this._currentMedia();
        const previousOverride = this._coordinatorOverride;
        this._coordinatorOverride = plan.newMaster;
        if (!(await this._callService("unjoin", { entity_id: oldMaster }, this._t("card.unjoin_failed", { name: this._speakerName(oldMaster) })))) {
            this._coordinatorOverride = previousOverride;
            return;
        }
        await this._waitFor((hass) => plan.remaining.every((id) => !groupMembers(hass, id).includes(oldMaster)));
        if (wasPlaying) {
            await this._waitFor((hass) => plan.remaining.some((id) => hass.states[id]?.state === "playing"), HANDOFF_SETTLE_MS);
        }
        const hass = this._hass;
        const master = plan.remaining.find((id) => coordinatorOf(hass, id) === id &&
            hass.states[id]?.state === "playing") ?? plan.newMaster;
        this._coordinatorOverride = master;
        const missing = plan.remaining.filter((id) => id !== master &&
            !groupMembers(hass, master).includes(id) &&
            isAvailable(hass.states[id]));
        if (missing.length > 0) {
            await this._callService("join", {
                entity_id: master,
                group_members: missing,
            });
        }
        if (wasPlaying && media && hass.states[master]?.state !== "playing") {
            await this._callService("play_media", { entity_id: master, ...media });
        }
        if (this._hass?.states[oldMaster]?.state === "playing") {
            await this._callService("media_stop", { entity_id: oldMaster });
        }
    }
    _openDrawer(view = "group") {
        window.clearTimeout(this._drawerTimer);
        this._drawerView = view;
        this._drawerClosing = false;
        this._drawerOpen = true;
    }
    _openGroupDrawer() {
        this._openDrawer("group");
    }
    _openSettingsDrawer() {
        this._openDrawer("settings");
    }
    async _loadSettings() {
        const cached = readLocalSettings();
        if (cached) {
            this._settings = cached;
        }
        try {
            const result = await this._hass?.callWS({
                type: "frontend/get_user_data",
                key: SETTINGS_KEY,
            });
            // Keep edits that were made while the request was in flight.
            if (result?.value != null && !this._settingsEdited) {
                this._settings = normalizeSettings(result.value);
                writeLocalSettings(this._settings);
            }
        }
        catch {
            // Older or restricted frontends: the local copy is all we have.
        }
    }
    _updateSettings(changes) {
        this._settings = normalizeSettings({ ...this._settings, ...changes });
        this._settingsEdited = true;
        writeLocalSettings(this._settings);
        window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, {
            detail: { source: this, settings: this._settings },
        }));
        window.clearTimeout(this._settingsTimer);
        this._settingsTimer = window.setTimeout(() => {
            this._settingsTimer = undefined;
            void this._saveSettings();
        }, SETTINGS_SAVE_DELAY_MS);
    }
    async _saveSettings() {
        try {
            await this._hass?.callWS({
                type: "frontend/set_user_data",
                key: SETTINGS_KEY,
                value: this._settings,
            });
        }
        catch (error) {
            const detail = errorMessage(error);
            const message = this._t("settings.save_failed");
            this._showToast(detail ? `${message} ${detail}` : message, "warning");
        }
    }
    _updateQuietPeriod(index, changes) {
        this._updateSettings({
            quiet_hours: this._settings.quiet_hours.map((period, i) => i === index ? { ...period, ...changes } : period),
        });
    }
    _addQuietPeriod() {
        this._updateSettings({
            quiet_hours: [
                ...this._settings.quiet_hours,
                {
                    ...DEFAULT_QUIET_PERIOD,
                    volume: Math.min(DEFAULT_QUIET_PERIOD.volume, this._settings.max_volume),
                },
            ],
        });
    }
    _removeQuietPeriod(index) {
        this._updateSettings({
            quiet_hours: this._settings.quiet_hours.filter((_, i) => i !== index),
        });
    }
    get _drawerElement() {
        return this.renderRoot.querySelector(".drawer");
    }
    /** Keeps keyboard focus inside the open drawer (modal dialog). */
    _trapFocus(event) {
        const focusable = [
            ...(this._drawerElement?.querySelectorAll("button, input, ha-switch") ?? []),
        ].filter((element) => !element.disabled);
        if (focusable.length === 0) {
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = this.shadowRoot?.activeElement;
        const inside = focusable.some((element) => element === active);
        if (event.shiftKey && (active === first || !inside)) {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && (active === last || !inside)) {
            event.preventDefault();
            first.focus();
        }
    }
    _swipeStart(event) {
        if (!event.isPrimary ||
            (event.pointerType === "mouse" && event.button !== 0) ||
            // Sliders and switches need horizontal drags for themselves.
            event
                .composedPath()
                .some((node) => node instanceof HTMLElement &&
                (node.localName === "input" || node.localName === "ha-switch"))) {
            return;
        }
        this._swipe = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startTime: event.timeStamp,
            active: false,
            offset: 0,
        };
    }
    _swipeMove(event) {
        const swipe = this._swipe;
        const drawer = this._drawerElement;
        if (!swipe || swipe.pointerId !== event.pointerId || !drawer) {
            return;
        }
        const dx = event.clientX - swipe.startX;
        const dy = event.clientY - swipe.startY;
        if (!swipe.active) {
            if (Math.abs(dy) > SWIPE_SLOP_PX && Math.abs(dy) >= Math.abs(dx)) {
                this._swipe = undefined;
                return;
            }
            if (dx <= SWIPE_SLOP_PX || dx < Math.abs(dy)) {
                return;
            }
            swipe.active = true;
            drawer.setPointerCapture(event.pointerId);
            drawer.classList.add("dragging");
        }
        swipe.offset = Math.max(0, dx);
        drawer.style.transform = `translateX(${swipe.offset}px)`;
    }
    _swipeEnd(event) {
        const swipe = this._swipe;
        const drawer = this._drawerElement;
        if (!swipe || swipe.pointerId !== event.pointerId) {
            return;
        }
        this._swipe = undefined;
        if (!swipe.active || !drawer) {
            return;
        }
        drawer.classList.remove("dragging");
        const elapsed = Math.max(1, event.timeStamp - swipe.startTime);
        if (event.type === "pointerup" &&
            (swipe.offset > drawer.offsetWidth * SWIPE_CLOSE_RATIO ||
                swipe.offset / elapsed > SWIPE_CLOSE_VELOCITY)) {
            this._closeDrawer();
        }
        else {
            drawer.style.transform = "";
        }
    }
    _resolveLogos() {
        const hass = this._hass;
        if (!hass || !this._config) {
            return;
        }
        for (const station of this._config.stations) {
            const logo = station.logo;
            if (!logo?.startsWith(MEDIA_SOURCE_PREFIX) ||
                logo in this._logoUrls ||
                this._resolvingLogos.has(logo)) {
                continue;
            }
            this._resolvingLogos.add(logo);
            hass
                .callWS({
                type: "media_source/resolve_media",
                media_content_id: logo,
            })
                .then((result) => {
                this._logoUrls = { ...this._logoUrls, [logo]: hass.hassUrl(result.url) };
            })
                .catch(() => {
                this._logoUrls = { ...this._logoUrls, [logo]: "" };
            })
                .finally(() => this._resolvingLogos.delete(logo));
        }
    }
    _logoUrl(station) {
        if (!station.logo) {
            return undefined;
        }
        const url = station.logo.startsWith(MEDIA_SOURCE_PREFIX)
            ? this._logoUrls[station.logo]
            : station.logo;
        return url && !this._brokenLogos.includes(url) ? url : undefined;
    }
    _logoFailed(url) {
        if (!this._brokenLogos.includes(url)) {
            this._brokenLogos = [...this._brokenLogos, url];
        }
    }
    render() {
        if (!this._config) {
            return A;
        }
        const coordinator = this._coordinator;
        const available = isAvailable(coordinator);
        const activeIndex = this._activeStationIndex();
        const notices = this._hass
            ? collectNotices(this._hass, this._config, this._coordinatorId, (id) => this._speakerName(id), this._t)
            : [];
        return b `
      <ha-card class=${this._drawerOpen ? "drawer-open" : ""}>
        <div class="content" ?inert=${this._drawerOpen}>
          <div class="header">
            ${this._config.title
            ? b `<h1 class="card-header">${this._config.title}</h1>`
            : this._renderTargets()}
            ${this._renderSettingsButton()}
          </div>
          ${notices.length > 0
            ? b `<div class="notices">
                ${notices.map((notice) => this._renderNotice(notice))}
              </div>`
            : A}
          ${this._config.title ? this._renderTargets() : A}
          ${this._renderStations(activeIndex, available)}
          ${this._renderControls(coordinator, activeIndex, available)}
          ${this._toast ? this._renderNotice(this._toast, true) : A}
        </div>
        ${this._renderDrawer()}
      </ha-card>
    `;
    }
    _renderNotice(notice, dismissible = false) {
        return b `
      <div
        class="notice ${notice.level} ${dismissible ? "toast" : ""}"
        role=${notice.level === "info" ? "status" : "alert"}
      >
        <ha-icon icon=${NOTICE_ICONS[notice.level]}></ha-icon>
        <span class="notice-text">${notice.message}</span>
        ${dismissible
            ? b `<button
              class="round small dismiss"
              aria-label=${this._t("card.dismiss")}
              @click=${this._dismissToast}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`
            : A}
      </div>
    `;
    }
    _renderTargets() {
        if (!this._hass || !this._config) {
            return A;
        }
        const current = this._coordinatorId;
        const targets = playbackTargets(this._hass, this._config, current);
        if (targets.length < 2) {
            return A;
        }
        return b `
      <div class="targets" role="group" aria-label=${this._t("card.play_on")}>
        ${targets.map((target) => {
            const selected = target.id === current;
            const name = this._speakerName(target.id);
            const label = target.members.length > 1
                ? `${name} + ${target.members.length - 1}`
                : name;
            return b `
            <button
              class="target ${selected ? "selected" : ""}"
              aria-pressed=${selected ? "true" : "false"}
              title=${formatGroupName(target.members.map((id) => this._speakerName(id)))}
              ?disabled=${!target.available}
              @click=${() => this._selectTarget(target.id)}
            >
              <ha-icon
                icon=${target.playing
                ? "mdi:speaker-play"
                : target.members.length > 1
                    ? "mdi:speaker-multiple"
                    : "mdi:speaker"}
              ></ha-icon>
              <span>${label}</span>
            </button>
          `;
        })}
      </div>
    `;
    }
    _selectTarget(entityId) {
        this._coordinatorOverride = entityId;
    }
    _renderStations(activeIndex, available) {
        const stations = this._config.stations;
        if (stations.length === 0) {
            return b `<div class="empty">
        <ha-icon icon="mdi:radio-off"></ha-icon>
        <div class="empty-title">${this._t("card.empty_title")}</div>
        <div class="secondary">${this._t("card.empty_text")}</div>
      </div>`;
        }
        const playing = this._coordinator?.state === "playing";
        return b `
      <div class="stations">
        ${stations.map((station, index) => {
            const active = index === activeIndex;
            const pending = index === this._pendingStation && !active;
            const logo = this._logoUrl(station);
            const issue = stationIssue(station, this._t);
            return b `
            <button
              class="station ${active ? "active" : ""} ${pending
                ? "pending"
                : ""} ${issue ? "has-issue" : ""}"
              aria-pressed=${active ? "true" : "false"}
              title=${issue ?? station.name}
              ?disabled=${!available}
              @click=${() => this._playStation(index)}
            >
              <div class="logo">
                ${logo
                ? b `<img
                      src=${logo}
                      alt=""
                      loading="lazy"
                      @error=${() => this._logoFailed(logo)}
                    />`
                : b `<ha-icon icon="mdi:radio"></ha-icon>`}
              </div>
              <span class="station-name">${station.name || this._t("card.unnamed")}</span>
              ${active
                ? b `<span class="badge">
                    <ha-icon
                      icon=${playing ? "mdi:equalizer" : "mdi:pause"}
                    ></ha-icon>
                    ${playing ? this._t("card.playing") : this._t("card.paused")}
                  </span>`
                : pending
                    ? b `<span class="badge">
                      <ha-icon icon="mdi:loading"></ha-icon>
                      ${this._t("card.starting")}
                    </span>`
                    : issue
                        ? b `<span class="badge warning">
                        <ha-icon icon="mdi:alert-outline"></ha-icon>
                        ${station.media_content_id?.trim()
                            ? this._t("card.check_url")
                            : this._t("card.not_set_up")}
                      </span>`
                        : A}
            </button>
          `;
        })}
      </div>
    `;
    }
    _renderControls(coordinator, activeIndex, available) {
        const config = this._config;
        const hass = this._hass;
        const members = this._members;
        const station = config.stations[activeIndex];
        const attributes = coordinator?.attributes ?? {};
        const channel = typeof attributes.media_channel === "string"
            ? attributes.media_channel
            : undefined;
        const title = typeof attributes.media_title === "string"
            ? attributes.media_title
            : undefined;
        const artist = typeof attributes.media_artist === "string"
            ? attributes.media_artist
            : undefined;
        const unknownStream = !station && isActiveState(coordinator);
        const primary = station?.name ??
            channel ??
            title ??
            (unknownStream
                ? this._t("card.unknown_stream")
                : available
                    ? this._t("card.nothing_playing")
                    : this._coordinatorId
                        ? this._t("card.speaker_unavailable")
                        : this._t("card.no_speaker_configured"));
        const secondary = [
            unknownStream && config.stations.length > 0
                ? this._t("card.not_in_station_list")
                : undefined,
            artist,
            title,
        ]
            .filter((value) => value && value !== primary)
            .join(" – ");
        const groupVolumeLevel = hass ? groupVolume(hass, members) : undefined;
        const coordinatorName = this._coordinatorId
            ? this._speakerName(this._coordinatorId)
            : undefined;
        const groupLabel = coordinatorName
            ? members.length > 1
                ? `${coordinatorName} + ${members.length - 1}`
                : coordinatorName
            : this._t("card.no_speaker");
        return b `
      <div class="controls">
        <div class="playback-info">
          <div class="now-playing">
            <div class="now-playing-primary">${primary}</div>
            <div class="now-playing-secondary">
              ${secondary || groupLabel}
            </div>
          </div>
          <button
            class="multiroom"
            aria-label=${this._t("card.multiroom")}
            aria-haspopup="dialog"
            aria-expanded=${this._drawerOpen && this._drawerView === "group"
            ? "true"
            : "false"}
            ?disabled=${config.speakers.length === 0}
            @click=${this._openGroupDrawer}
          >
            <ha-icon icon="mdi:speaker-multiple"></ha-icon>
            <span class="multiroom-label">${this._t("card.multiroom")}</span>
            ${members.length > 1
            ? b `<span class="count">${members.length}</span>`
            : A}
          </button>
        </div>

        <div class="playback-control">
          <div class="transport">
            <button
              class="round primary toggle-playback"
              aria-label=${isRunning(coordinator)
            ? this._t("card.stop")
            : this._t("card.play")}
              ?disabled=${!available}
              @click=${this._togglePlayback}
            >
              <ha-icon
                icon=${isRunning(coordinator) ? "mdi:stop" : "mdi:play"}
              ></ha-icon>
            </button>
          </div>
          ${this._renderVolume(GROUP_VOLUME_KEY, groupVolumeLevel, this._t("card.group_volume"), !available)}
        </div>
      </div>
    `;
    }
    _renderSettingsButton() {
        const quiet = activeQuietPeriod(this._settings, new Date());
        return b `
      <button
        class="settings-button ${quiet ? "quiet" : ""}"
        aria-label=${this._t("settings.title")}
        title=${quiet
            ? this._t("settings.quiet_active", { volume: quiet.volume })
            : this._t("settings.title")}
        aria-haspopup="dialog"
        aria-expanded=${this._drawerOpen && this._drawerView === "settings"
            ? "true"
            : "false"}
        @click=${this._openSettingsDrawer}
      >
        <ha-icon icon=${quiet ? "mdi:weather-night" : "mdi:tune-variant"}></ha-icon>
      </button>
    `;
    }
    _renderVolume(key, actual, label, disabled) {
        const volume = this._volume.draft(key) ?? actual;
        const percent = Math.round((volume ?? 0) * 100);
        const max = this._settings.max_volume;
        const fill = Math.min(100, (percent / max) * 100);
        return b `
      <label class="volume">
        <ha-icon
          icon=${percent === 0
            ? "mdi:volume-off"
            : percent < 50
                ? "mdi:volume-medium"
                : "mdi:volume-high"}
        ></ha-icon>
        <input
          type="range"
          min="0"
          max=${String(max)}
          step="1"
          aria-label=${label}
          .value=${l(String(Math.min(percent, max)))}
          style="--value: ${fill}%"
          ?disabled=${disabled || volume === undefined}
          @input=${(event) => this._volumeInput(key, event)}
          @change=${(event) => this._commitVolume(key, event)}
        />
        <span class="volume-value">${percent}%</span>
      </label>
    `;
    }
    _renderDrawer() {
        if (!this._drawerOpen) {
            return A;
        }
        const closing = this._drawerClosing ? "closing" : "";
        const settings = this._drawerView === "settings";
        const members = this._members;
        const groupName = formatGroupName(members.map((id) => this._speakerName(id)));
        return b `
      <div class="scrim ${closing}" @click=${this._closeDrawer}></div>
      <aside
        class="drawer ${closing}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        @pointerdown=${this._swipeStart}
        @pointermove=${this._swipeMove}
        @pointerup=${this._swipeEnd}
        @pointercancel=${this._swipeEnd}
      >
        <div class="drawer-header">
          <div class="drawer-heading">
            <span class="drawer-eyebrow"
              >${settings
            ? this._t("settings.eyebrow")
            : this._t("card.group_speakers")}</span
            >
            <h2 id="drawer-title">
              ${settings
            ? this._t("settings.title")
            : groupName
                ? this._t("card.sonos_group", { name: groupName })
                : this._t("card.no_active_group")}
            </h2>
          </div>
          <button
            class="round small close"
            aria-label=${this._t("card.close")}
            @click=${this._closeDrawer}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${settings ? this._renderSettings() : this._renderRooms(members)}
      </aside>
    `;
    }
    _renderRooms(members) {
        const memberSet = new Set(members);
        const coordinatorId = this._coordinatorId;
        return b `
      <ul class="rooms">
        ${this._config.speakers.map((speaker) => this._renderRoom(speaker, memberSet, members.length, coordinatorId))}
      </ul>
    `;
    }
    _renderSettings() {
        const t = this._t;
        const settings = this._settings;
        const active = activeQuietPeriod(settings, new Date());
        return b `
      <div class="settings">
        <section class="setting">
          <div class="setting-header">
            <ha-icon icon="mdi:volume-high"></ha-icon>
            <div class="room-text">
              <span class="room-name"
                >${t("settings.max_volume")}</span
              >
              <span class="secondary">${t("settings.max_volume_help")}</span>
            </div>
          </div>
          ${this._renderSettingSlider(settings.max_volume, 10, 100, t("settings.max_volume"), (value) => this._updateSettings({ max_volume: value }), "max-volume")}
        </section>

        <section class="setting">
          <div class="setting-header">
            <ha-icon icon="mdi:weather-night"></ha-icon>
            <div class="room-text">
              <span class="room-name">${t("settings.quiet_hours")}</span>
              <span class="secondary">${t("settings.quiet_hours_help")}</span>
            </div>
          </div>
          ${settings.quiet_hours.map((period, index) => this._renderQuietPeriod(period, index, period === active))}
          <button class="add-quiet" @click=${this._addQuietPeriod}>
            <ha-icon icon="mdi:plus"></ha-icon>
            <span>${t("settings.add_quiet")}</span>
          </button>
        </section>

        <section class="setting">
          <div class="setting-header">
            <ha-icon icon="mdi:shuffle-variant"></ha-icon>
            <div class="room-text">
              <span class="room-name">${t("settings.shuffle")}</span>
              <span class="secondary">${t("settings.shuffle_help")}</span>
            </div>
            <ha-switch
              class="shuffle-switch"
              .checked=${l(settings.shuffle_playlists)}
              aria-label=${t("settings.shuffle")}
              @change=${(event) => this._updateSettings({
            shuffle_playlists: event.target.checked,
        })}
            ></ha-switch>
          </div>
        </section>

        <p class="settings-note secondary">${t("settings.storage_note")}</p>
      </div>
    `;
    }
    _renderQuietPeriod(period, index, active) {
        const t = this._t;
        const name = t("settings.quiet_period", { index: index + 1 });
        return b `
      <div class="quiet-period ${active ? "active" : ""}">
        <div class="quiet-times">
          <label>
            <span>${t("settings.from")}</span>
            <input
              type="time"
              class="quiet-start"
              .value=${l(period.start)}
              aria-label=${`${name}: ${t("settings.from")}`}
              @change=${(event) => this._updateQuietPeriod(index, {
            start: event.target.value,
        })}
            />
          </label>
          <label>
            <span>${t("settings.to")}</span>
            <input
              type="time"
              class="quiet-end"
              .value=${l(period.end)}
              aria-label=${`${name}: ${t("settings.to")}`}
              @change=${(event) => this._updateQuietPeriod(index, {
            end: event.target.value,
        })}
            />
          </label>
          ${active
            ? b `<span class="quiet-badge">${t("settings.active_now")}</span>`
            : A}
        </div>
        <div class="quiet-volume-row">
          ${this._renderSettingSlider(Math.min(period.volume, this._settings.max_volume), 0, this._settings.max_volume, t("settings.start_volume", { name }), (value) => this._updateQuietPeriod(index, { volume: value }), "quiet-volume")}
          <button
            class="round small remove-quiet"
            aria-label=${t("settings.remove_quiet", { name })}
            @click=${() => this._removeQuietPeriod(index)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
      </div>
    `;
    }
    /** Slider for a stored percentage; saves on release, shows the value live. */
    _renderSettingSlider(value, min, max, label, commit, className) {
        const fill = max > min ? ((value - min) / (max - min)) * 100 : 100;
        const show = (event) => {
            const input = event.target;
            const current = Number(input.value);
            input.style.setProperty("--value", `${max > min ? ((current - min) / (max - min)) * 100 : 100}%`);
            const output = input.nextElementSibling;
            if (output) {
                output.textContent = `${current}%`;
            }
        };
        return b `
      <label class="volume ${className}">
        <input
          type="range"
          min=${String(min)}
          max=${String(max)}
          step="1"
          aria-label=${label}
          .value=${l(String(value))}
          style="--value: ${fill}%"
          @input=${show}
          @change=${(event) => commit(Number(event.target.value))}
        />
        <span class="volume-value">${value}%</span>
      </label>
    `;
    }
    _renderRoom(speaker, members, memberCount, coordinatorId) {
        const entityId = speaker.entity;
        const entity = this._hass?.states[entityId];
        const available = isAvailable(entity);
        const target = this._membershipTargets[entityId];
        const pending = target !== undefined;
        // Show the requested state right away; Sonos takes a moment to regroup.
        const inGroup = target ?? members.has(entityId);
        const isMaster = entityId === coordinatorId;
        const soleMember = members.has(entityId) && memberCount <= 1;
        const name = this._speakerName(entityId, speaker);
        const volume = entity?.attributes.volume_level;
        const t = this._t;
        const status = !entity
            ? t("room.not_found")
            : !available
                ? t("room.unavailable")
                : pending
                    ? inGroup
                        ? t("room.joining")
                        : t("room.leaving")
                    : isMaster
                        ? soleMember
                            ? t("room.master_only")
                            : t("room.master")
                        : inGroup
                            ? t("room.in_group")
                            : t("room.not_in_group");
        return b `
      <li
        class="room ${inGroup ? "in-group" : ""} ${available
            ? ""
            : "unavailable"}"
      >
        <div class="room-header">
          <ha-icon
            class="room-icon"
            icon=${pending ? "mdi:loading" : (speaker.icon ?? "mdi:speaker")}
          ></ha-icon>
          <div class="room-text">
            <span class="room-name">${name}</span>
            <span class="secondary">${status}</span>
          </div>
          <ha-switch
            .checked=${l(inGroup)}
            .disabled=${!available || pending || soleMember || !coordinatorId}
            aria-label=${t("card.room_in_group", { name })}
            @change=${(event) => this._toggleSpeaker(entityId, event.target.checked)}
          ></ha-switch>
        </div>
        ${this._renderVolume(entityId, typeof volume === "number" ? volume : undefined, t("card.room_volume", { name }), !available)}
      </li>
    `;
    }
    static { this.styles = i$4 `
    :host {
      --sonos-radio-tile-min: 128px;
      --sonos-radio-touch: 56px;
      --sonos-radio-radius: var(
        --ha-card-border-radius,
        var(--card-border-radius, 12px)
      );
      display: block;
    }

    ha-card {
      position: relative;
      overflow: hidden;
      container-type: inline-size;
      background: var(--ha-card-background, var(--card-background-color));
      border-radius: var(--sonos-radio-radius);
    }

    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .card-header {
      margin: 0;
      padding: 16px 16px 0;
      color: var(--ha-card-header-color, var(--primary-text-color));
      font-size: var(--ha-card-header-font-size, 24px);
      font-weight: 400;
    }

    .targets {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px 0;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .target {
      flex: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 44px;
      padding: 0 16px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      border-radius: 22px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
    }

    .target.selected {
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      color: var(--primary-color);
      font-weight: 500;
    }

    .target:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .target ha-icon {
      --mdc-icon-size: 20px;
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }

    .empty > ha-icon {
      --mdc-icon-size: 40px;
      opacity: 0.6;
    }

    .empty-title {
      color: var(--primary-text-color);
      font-weight: 500;
    }

    .stations {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(var(--sonos-radio-tile-min), 1fr)
      );
      gap: 12px;
      padding: 16px;
    }

    .station {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 8px 8px 12px;
      cursor: pointer;
      border: 2px solid var(--divider-color);
      border-radius: var(--sonos-radio-radius);
      background: var(--secondary-background-color, transparent);
      transition:
        border-color 150ms ease,
        box-shadow 150ms ease,
        transform 100ms ease;
    }

    .station:not(:disabled):active {
      transform: scale(0.97);
    }

    .station.active {
      border-color: var(--primary-color);
      box-shadow:
        0 0 0 2px var(--primary-color),
        0 0 18px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }

    .station.pending {
      border-color: var(--primary-color);
      border-style: dashed;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: calc(var(--sonos-radio-radius) - 4px);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
    }

    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .logo ha-icon {
      --mdc-icon-size: 48px;
    }

    .station-name {
      overflow: hidden;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.3;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
    }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px 2px 4px;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge ha-icon {
      --mdc-icon-size: 16px;
    }

    .badge.warning {
      background: var(--warning-color, #ffa600);
      color: #000;
    }

    .station.has-issue:not(.active) .logo {
      opacity: 0.6;
    }

    .room.unavailable .room-header,
    .room.unavailable .volume {
      opacity: 0.55;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding: 12px 16px 16px;
      border-top: 1px solid var(--divider-color);
    }

    .playback-info,
    .playback-control {
      display: flex;
      flex: 1 1 320px;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .now-playing {
      flex: 1;
      min-width: 0;
    }

    .now-playing-primary,
    .now-playing-secondary {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .now-playing-primary {
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .now-playing-secondary {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }

    .transport {
      display: flex;
      gap: 12px;
    }

    .round {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--sonos-radio-touch);
      height: var(--sonos-radio-touch);
      padding: 0;
      cursor: pointer;
      border: 1px solid var(--divider-color);
      border-radius: 50%;
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
    }

    .round.primary {
      width: calc(var(--sonos-radio-touch) + 8px);
      height: calc(var(--sonos-radio-touch) + 8px);
      border: none;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .round.primary ha-icon {
      --mdc-icon-size: 32px;
    }

    .round.small {
      width: 48px;
      height: 48px;
    }

    .volume {
      display: flex;
      flex: 1 1 100px;
      align-items: center;
      gap: 12px;
      min-width: 0;
      min-height: var(--sonos-radio-touch);
      color: var(--secondary-text-color);
    }

    .volume-value {
      min-width: 2.5ch;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    input[type="range"] {
      flex: 1;
      width: 100%;
      min-width: 0;
      height: var(--sonos-radio-touch);
      margin: 0;
      cursor: pointer;
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
    }

    input[type="range"]:disabled {
      cursor: default;
      opacity: 0.5;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(
        to right,
        var(--primary-color) var(--value),
        var(--divider-color) var(--value)
      );
    }

    input[type="range"]::-moz-range-track {
      height: 8px;
      border-radius: 4px;
      background: var(--divider-color);
    }

    input[type="range"]::-moz-range-progress {
      height: 8px;
      border-radius: 4px;
      background: var(--primary-color);
    }

    input[type="range"]::-webkit-slider-thumb {
      width: 28px;
      height: 28px;
      margin-top: -10px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      -webkit-appearance: none;
      appearance: none;
    }

    input[type="range"]::-moz-range-thumb {
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    .multiroom {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: var(--sonos-radio-touch);
      padding: 0 20px;
      cursor: pointer;
      border: none;
      border-radius: calc(var(--sonos-radio-touch) / 2);
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      color: var(--primary-color);
      font-weight: 600;
    }

    .count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      border-radius: 11px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
    }

    @container (max-width: 420px) {
      .multiroom {
        padding: 0 16px;
      }

      .multiroom-label,
      .volume-value {
        display: none;
      }
    }

    .notices {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 16px 0;
    }

    .notice {
      --notice-color: var(--error-color, #db4437);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--notice-color) 14%, transparent);
      color: var(--primary-text-color);
      font-size: 0.9rem;
      line-height: 1.35;
    }

    .notice > ha-icon {
      flex: none;
      color: var(--notice-color);
    }

    .notice.warning {
      --notice-color: var(--warning-color, #ffa600);
    }

    .notice.info {
      --notice-color: var(--info-color, #039be5);
    }

    .notice-text {
      flex: 1;
      min-width: 0;
    }

    .notice.toast {
      margin: 0 16px 16px;
      padding-right: 4px;
    }

    .notice .dismiss {
      flex: none;
      width: 44px;
      height: 44px;
    }

    ha-card.drawer-open {
      min-height: var(--sonos-radio-drawer-min-height, 440px);
    }

    .scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: rgba(0, 0, 0, 0.45);
      animation: fade-in ${DRAWER_ANIMATION_MS}ms ease-out;
      transition: opacity ${DRAWER_ANIMATION_MS}ms ease-in;
    }

    .scrim.closing {
      opacity: 0;
    }

    .drawer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      width: min(var(--sonos-radio-drawer-width, 380px), 92%);
      overflow-y: auto;
      overscroll-behavior: contain;
      border-radius: var(--sonos-radio-radius) 0 0 var(--sonos-radio-radius);
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: -6px 0 24px rgba(0, 0, 0, 0.3);
      touch-action: pan-y;
      animation: slide-in ${DRAWER_ANIMATION_MS}ms ease-out;
      transition: transform ${DRAWER_ANIMATION_MS}ms ease;
    }

    .drawer.dragging {
      transition: none;
    }

    .drawer.closing {
      transform: translateX(100%);
      transition-timing-function: ease-in;
    }

    @keyframes slide-in {
      from {
        transform: translateX(100%);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    .drawer-header {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 12px 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: inherit;
    }

    .drawer-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .drawer-eyebrow {
      color: var(--primary-color);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .drawer-heading h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 500;
      line-height: 1.3;
      color: var(--primary-text-color);
    }

    .rooms {
      margin: 0;
      padding: 4px 16px 16px;
      list-style: none;
    }

    .room {
      padding: 12px 0 4px;
      border-bottom: 1px solid var(--divider-color);
    }

    .room:last-child {
      border-bottom: none;
    }

    .room-header {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: var(--sonos-radio-touch);
    }

    .room-icon {
      flex: none;
      color: var(--secondary-text-color);
    }

    .room.in-group .room-icon {
      color: var(--primary-color);
    }

    .room-text {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
    }

    .room-name {
      overflow: hidden;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
    }

    .room ha-switch {
      flex: none;
      --ha-switch-min-touch-size: var(--sonos-radio-touch);
    }

    .room .volume {
      padding-left: 36px;
      min-height: 48px;
    }

    .room .volume-value {
      display: inline;
    }

    .secondary {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 8px 8px 0 16px;
    }

    .header .card-header,
    .header .targets {
      flex: 1;
      min-width: 0;
      padding: 0;
    }

    .settings-button {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      margin-left: auto;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .settings-button ha-icon {
      --mdc-icon-size: 22px;
    }

    .settings-button.quiet {
      color: var(--primary-color);
    }

    .settings {
      padding: 4px 16px 16px;
    }

    .setting {
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .setting-header {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: var(--sonos-radio-touch);
    }

    .setting-header > ha-icon {
      flex: none;
      color: var(--secondary-text-color);
    }

    .setting-header ha-switch {
      flex: none;
      --ha-switch-min-touch-size: var(--sonos-radio-touch);
    }

    .setting .volume {
      padding-left: 36px;
      min-height: 48px;
    }

    .setting .volume-value {
      display: inline;
    }

    .quiet-period {
      margin: 8px 0 0 36px;
      padding: 8px 12px 0;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .quiet-period.active {
      border-color: var(--primary-color);
    }

    .quiet-volume-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .quiet-volume-row .volume {
      flex: 1;
      min-width: 0;
      padding-left: 0;
    }

    .remove-quiet {
      flex: none;
    }

    .quiet-times {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
    }

    .quiet-times label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    input[type="time"] {
      min-height: 44px;
      padding: 0 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      color-scheme: light dark;
    }

    .quiet-badge {
      padding: 2px 8px;
      border-radius: 10px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .add-quiet {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 44px;
      margin: 8px 0 0 36px;
      padding: 0 16px;
      border: 1px dashed var(--divider-color);
      border-radius: 22px;
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
    }

    .settings-note {
      margin: 12px 0 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .station,
      .scrim,
      .drawer {
        transition: none;
        animation: none;
      }
    }
  `; }
}
if (!customElements.get("sonos-radio-card")) {
    customElements.define("sonos-radio-card", SonosRadioCard);
    console.info(`%c SONOS-RADIO-CARD %c ${CARD_VERSION} `, "color: #fff; background: #03a9f4; font-weight: 700;", "color: #03a9f4; background: #fff; font-weight: 700;");
}
window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "sonos-radio-card")) {
    window.customCards.push({
        type: "sonos-radio-card",
        name: "Sonos Radio Card",
        description: createTranslator(navigator.language)("card.description"),
        preview: false,
    });
}
