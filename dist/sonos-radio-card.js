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
const stationIssue = (station) => {
    const id = station.media_content_id?.trim() ?? "";
    const type = station.media_content_type || "music";
    if (!id) {
        return type === "favorite_item_id"
            ? "No Sonos favorite selected."
            : "No stream URL set.";
    }
    if (type === "favorite_item_id") {
        return /^https?:\/\//i.test(id)
            ? "This looks like a URL. Set the type to “Stream URL”."
            : undefined;
    }
    if (type === "music") {
        if (/^https?:\/\//i.test(id) && /\s/.test(id)) {
            return "The stream URL contains spaces.";
        }
        if (!HAS_SCHEME.test(id)) {
            return "The stream URL should start with http:// or https://.";
        }
    }
    return undefined;
};
/**
 * Collects configuration and availability problems that should be shown on
 * the card. `name` maps entity IDs to display names.
 */
const collectNotices = (hass, config, coordinatorId, name) => {
    const notices = [];
    const speakers = config.speakers
        .map((speaker) => speaker.entity)
        .filter((entityId) => entityId.length > 0);
    const configured = unique([config.master_entity ?? "", ...speakers].filter((id) => id.length > 0));
    if (configured.length === 0) {
        return [
            {
                level: "error",
                message: "No Sonos speakers configured. Edit the card to add at least one speaker.",
            },
        ];
    }
    for (const entityId of configured) {
        if (!entityId.startsWith("media_player.")) {
            notices.push({
                level: "warning",
                message: `${entityId} is not a media player. Pick a Sonos media_player entity in the card editor.`,
            });
        }
        else if (!hass.states[entityId]) {
            notices.push({
                level: "warning",
                message: `${entityId} was not found in Home Assistant. Check the entity ID in the card editor.`,
            });
        }
    }
    const known = configured.filter((id) => hass.states[id]);
    if (known.length > 0 && !known.some((id) => isAvailable(hass.states[id]))) {
        notices.push({
            level: "error",
            message: known.length === 1
                ? `${name(known[0])} is unavailable. Make sure the speaker is powered on and connected to your network.`
                : "All Sonos speakers are unavailable. Check power, network, and the Sonos integration in Home Assistant.",
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
            message: `Default speaker ${name(master)} is unavailable, using ${name(coordinatorId)} instead.`,
        });
    }
    return notices;
};

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

const GENERAL_SCHEMA = [
    {
        name: "title",
        selector: {
            text: {},
        },
    },
    {
        name: "master_entity",
        selector: {
            entity: {
                domain: ["media_player"],
            },
        },
    },
];
const GENERAL_LABELS = {
    title: "Card title",
    master_entity: "Default master speaker",
};
class SonosRadioCardEditor extends i$1 {
    constructor() {
        super(...arguments);
        this._computeLabel = (schema) => GENERAL_LABELS[schema.name] ?? schema.name;
        this._computeHelper = (schema) => schema.name === "master_entity"
            ? "Leave empty to automatically detect the current Sonos group master."
            : undefined;
    }
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

    h3 {
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
    .item-actions {
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

    .fields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .helper {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }

    .helper.warning {
      color: var(--warning-color, #ffa600);
    }

    @media (max-width: 600px) {
      .fields {
        grid-template-columns: minmax(0, 1fr);
      }
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
    _generalChanged(event) {
        if (!this._config) {
            return;
        }
        const { title, master_entity } = event.detail.value;
        const config = {
            ...this._config,
            title: this._optionalString(title),
            master_entity: this._optionalString(master_entity),
        };
        this._updateConfig(config);
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
    _eventValue(event) {
        const detail = event instanceof CustomEvent ? event.detail : undefined;
        const value = detail && typeof detail === "object" && "value" in detail
            ? detail.value
            : undefined;
        if (typeof value === "string") {
            return value;
        }
        const target = event.currentTarget;
        return typeof target.value === "string" ? target.value : "";
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
    _moveSpeaker(index, offset) {
        if (!this._config) {
            return;
        }
        const speakers = [...this._config.speakers];
        const targetIndex = index + offset;
        if (targetIndex < 0 || targetIndex >= speakers.length) {
            return;
        }
        [speakers[index], speakers[targetIndex]] = [
            speakers[targetIndex],
            speakers[index],
        ];
        this._updateConfig({ ...this._config, speakers });
    }
    _moveStation(index, offset) {
        if (!this._config) {
            return;
        }
        const stations = [...this._config.stations];
        const targetIndex = index + offset;
        if (targetIndex < 0 || targetIndex >= stations.length) {
            return;
        }
        [stations[index], stations[targetIndex]] = [
            stations[targetIndex],
            stations[index],
        ];
        this._updateConfig({ ...this._config, stations });
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
    _addStation() {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            stations: [
                ...this._config.stations,
                { name: "", media_content_id: "", media_content_type: "music" },
            ],
        });
    }
    _removeStation(index) {
        if (!this._config) {
            return;
        }
        this._updateConfig({
            ...this._config,
            stations: this._config.stations.filter((_, itemIndex) => itemIndex !== index),
        });
    }
    render() {
        const config = this._config;
        if (!config) {
            return b ``;
        }
        return b `
      <div class="editor">
        <section class="section">
          <h3>General and speakers</h3>
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
            <h4>Sonos speakers</h4>
            ${config.speakers.map((speaker, index) => b `
                <div class="item">
                  <div class="item-header">
                    <strong>Speaker ${index + 1}</strong>
                    <div class="item-actions">
                      <ha-icon-button
                        .label=${"Move speaker up"}
                        .disabled=${index === 0}
                        @click=${() => this._moveSpeaker(index, -1)}
                      >
                        <ha-icon icon="mdi:arrow-up"></ha-icon>
                      </ha-icon-button>
                      <ha-icon-button
                        .label=${"Move speaker down"}
                        .disabled=${index === config.speakers.length - 1}
                        @click=${() => this._moveSpeaker(index, 1)}
                      >
                        <ha-icon icon="mdi:arrow-down"></ha-icon>
                      </ha-icon-button>
                      <ha-icon-button
                        .label=${"Remove speaker"}
                        @click=${() => this._removeSpeaker(index)}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </ha-icon-button>
                    </div>
                  </div>
                  <ha-entity-picker
                    .hass=${this._hass}
                    .value=${speaker.entity}
                    .includeDomains=${["media_player"]}
                    .label=${"Speaker entity"}
                    @value-changed=${(event) => this._updateSpeaker(index, {
            entity: this._eventValue(event),
        })}
                  ></ha-entity-picker>
                  <div class="fields">
                    <ha-textfield
                      .label=${"Display name"}
                      .value=${speaker.name ?? ""}
                      @input=${(event) => this._updateSpeaker(index, {
            name: this._optionalString(this._eventValue(event)),
        })}
                    ></ha-textfield>
                    <ha-icon-picker
                      .label=${"Icon"}
                      .value=${speaker.icon ?? ""}
                      @value-changed=${(event) => this._updateSpeaker(index, {
            icon: this._optionalString(this._eventValue(event)),
        })}
                    ></ha-icon-picker>
                  </div>
                </div>
              `)}
            <ha-button @click=${this._addSpeaker}>Add speaker</ha-button>
          </div>
        </section>

        <section class="section">
          <h3>Radio stations</h3>
          ${config.stations.map((station, index) => b `
              <div class="item">
                <div class="item-header">
                  <strong>Station ${index + 1}</strong>
                  <div class="item-actions">
                    <ha-icon-button
                      .label=${"Move station up"}
                      .disabled=${index === 0}
                      @click=${() => this._moveStation(index, -1)}
                    >
                      <ha-icon icon="mdi:arrow-up"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      .label=${"Move station down"}
                      .disabled=${index === config.stations.length - 1}
                      @click=${() => this._moveStation(index, 1)}
                    >
                      <ha-icon icon="mdi:arrow-down"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      .label=${"Remove station"}
                      @click=${() => this._removeStation(index)}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </ha-icon-button>
                  </div>
                </div>
                <div class="fields">
                  <ha-textfield
                    .label=${"Station name"}
                    .value=${station.name}
                    @input=${(event) => this._updateStation(index, {
            name: this._eventValue(event),
        })}
                  ></ha-textfield>
                  <ha-select
                    .label=${"Media content type"}
                    .value=${station.media_content_type}
                    .options=${[
            {
                value: "music",
                label: "Stream URL (music / Radio Browser)",
            },
            {
                value: "favorite_item_id",
                label: "Sonos favorite",
            },
        ]}
                    @selected=${(event) => this._updateStation(index, {
            media_content_type: this._eventValue(event),
        })}
                  ></ha-select>
                </div>
                <ha-textfield
                  .label=${"Stream URL / media content ID"}
                  .value=${station.media_content_id}
                  .placeholder=${"https://... or Sonos favorite ID"}
                  @input=${(event) => this._updateStation(index, {
            media_content_id: this._eventValue(event),
        })}
                ></ha-textfield>
                <ha-textfield
                  .label=${"Logo URL or media-source"}
                  .value=${station.logo ?? ""}
                  .placeholder=${"https://... or media-source://..."}
                  @input=${(event) => this._updateStation(index, {
            logo: this._optionalString(this._eventValue(event)),
        })}
                ></ha-textfield>
                ${station.media_content_type === "favorite_item_id"
            ? b `<div class="helper">
                      Enter the Sonos favorite ID as the media content ID.
                    </div>`
            : b `<div class="helper">
                      Radio Browser stations use their stream URL with the
                      “music” media content type.
                    </div>`}
                ${station.media_content_id && stationIssue(station)
            ? b `<div class="helper warning" role="status">
                      ${stationIssue(station)}
                    </div>`
            : A}
              </div>
            `)}
          <ha-button @click=${this._addStation}>Add station</ha-button>
        </section>
      </div>
    `;
    }
}
if (!customElements.get("sonos-radio-card-editor")) {
    customElements.define("sonos-radio-card-editor", SonosRadioCardEditor);
}

const MEDIA_SOURCE_PREFIX = "media-source://";
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
const NOTICE_ICONS = {
    error: "mdi:alert-circle-outline",
    warning: "mdi:alert-outline",
    info: "mdi:information-outline",
};
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
        this._volume = new VolumeThrottle((key, level) => this._sendVolume(key, level), () => this.requestUpdate(), { intervalMs: VOLUME_THROTTLE_MS, holdMs: VOLUME_HOLD_MS });
        this._pendingSpeakers = [];
        this._logoUrls = {};
        this._brokenLogos = [];
        this._resolvingLogos = new Set();
        this._waiters = new Set();
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
        };
    }
    static { this.properties = {
        _config: { state: true },
        _drawerOpen: { state: true },
        _drawerClosing: { state: true },
        _pendingStation: { state: true },
        _pendingSpeakers: { state: true },
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
    getCardSize() {
        const rows = Math.ceil((this._config?.stations.length ?? 0) / 4);
        return 3 + rows * 2;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
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
        const target = this._drawerOpen ? ".drawer .close" : ".multiroom";
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
            const prefix = failure ?? `Failed to call media_player.${service}.`;
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
            this._showToast(`${station.name || "The station"} did not start. Check that the stream URL is reachable and uses a format Sonos supports (MP3, AAC or HLS).`, "warning");
        }
    }
    async _playStation(index) {
        const station = this._config?.stations[index];
        const entityId = this._coordinatorId;
        if (!station || !entityId) {
            return;
        }
        if (!station.media_content_id?.trim()) {
            this._showToast(`${station.name || "This station"}: ${stationIssue(station)} Add it in the card editor.`, "warning");
            return;
        }
        this._pendingStation = index;
        window.clearTimeout(this._pendingTimer);
        this._pendingTimer = window.setTimeout(() => this._pendingTimedOut(index), PENDING_TIMEOUT_MS);
        const played = await this._callService("play_media", {
            entity_id: entityId,
            media_content_id: station.media_content_id.trim(),
            media_content_type: station.media_content_type || "music",
        }, `Could not start ${station.name || "the station"}.`);
        if (!played) {
            this._clearPending();
        }
    }
    _playPause() {
        const entityId = this._coordinatorId;
        if (entityId) {
            void this._callService("media_play_pause", { entity_id: entityId });
        }
    }
    _stop() {
        const entityId = this._coordinatorId;
        if (entityId) {
            this._clearPending();
            void this._callService("media_stop", { entity_id: entityId });
        }
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
    async _sendVolume(key, level) {
        if (!this._hass) {
            return false;
        }
        const commands = key === GROUP_VOLUME_KEY
            ? planGroupVolume(this._hass, this._members, level)
            : [{ entity_id: key, volume_level: level }];
        const results = await Promise.all(commands.map((command) => this._callService("volume_set", { ...command }, `Could not change the volume of ${this._speakerName(command.entity_id)}.`)));
        return results.every(Boolean);
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
        if (this._pendingSpeakers.includes(entityId)) {
            return;
        }
        this._pendingSpeakers = [...this._pendingSpeakers, entityId];
        try {
            if (join) {
                await this._joinSpeaker(entityId);
            }
            else {
                await this._removeSpeaker(entityId);
            }
        }
        finally {
            this._pendingSpeakers = this._pendingSpeakers.filter((id) => id !== entityId);
        }
    }
    async _joinSpeaker(entityId) {
        const master = this._coordinatorId;
        if (!master || master === entityId) {
            return;
        }
        const joined = await this._callService("join", {
            entity_id: master,
            group_members: [entityId],
        });
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
            if (await this._callService("unjoin", { entity_id: entityId })) {
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
        if (!(await this._callService("unjoin", { entity_id: oldMaster }))) {
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
    _openDrawer() {
        window.clearTimeout(this._drawerTimer);
        this._drawerClosing = false;
        this._drawerOpen = true;
    }
    get _drawerElement() {
        return this.renderRoot.querySelector(".drawer");
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
            ? collectNotices(this._hass, this._config, this._coordinatorId, (id) => this._speakerName(id))
            : [];
        return b `
      <ha-card class=${this._drawerOpen ? "drawer-open" : ""}>
        ${this._config.title
            ? b `<h1 class="card-header">${this._config.title}</h1>`
            : A}
        ${notices.length > 0
            ? b `<div class="notices">
              ${notices.map((notice) => this._renderNotice(notice))}
            </div>`
            : A}
        ${this._renderStations(activeIndex, available)}
        ${this._renderControls(coordinator, activeIndex, available)}
        ${this._toast ? this._renderNotice(this._toast, true) : A}
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
              aria-label="Dismiss"
              @click=${this._dismissToast}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`
            : A}
      </div>
    `;
    }
    _renderStations(activeIndex, available) {
        const stations = this._config.stations;
        if (stations.length === 0) {
            return b `<div class="empty">
        <ha-icon icon="mdi:radio-off"></ha-icon>
        <div class="empty-title">No radio stations yet</div>
        <div class="secondary">
          Edit the card and add stations with a stream URL or a Sonos
          favorite.
        </div>
      </div>`;
        }
        const playing = this._coordinator?.state === "playing";
        return b `
      <div class="stations">
        ${stations.map((station, index) => {
            const active = index === activeIndex;
            const pending = index === this._pendingStation && !active;
            const logo = this._logoUrl(station);
            const issue = stationIssue(station);
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
              <span class="station-name">${station.name || "Unnamed"}</span>
              ${active
                ? b `<span class="badge">
                    <ha-icon
                      icon=${playing ? "mdi:equalizer" : "mdi:pause"}
                    ></ha-icon>
                    ${playing ? "Playing" : "Paused"}
                  </span>`
                : pending
                    ? b `<span class="badge">
                      <ha-icon icon="mdi:loading"></ha-icon>
                      Starting
                    </span>`
                    : issue
                        ? b `<span class="badge warning">
                        <ha-icon icon="mdi:alert-outline"></ha-icon>
                        ${station.media_content_id?.trim()
                            ? "Check URL"
                            : "Not set up"}
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
        const playing = coordinator?.state === "playing";
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
                ? "Unknown stream"
                : available
                    ? "Nothing playing"
                    : this._coordinatorId
                        ? "Speaker unavailable"
                        : "No speaker configured");
        const secondary = [
            unknownStream && config.stations.length > 0
                ? "Not in your station list"
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
            : "No speaker";
        return b `
      <div class="controls">
        <div class="now-playing">
          <div class="now-playing-primary">${primary}</div>
          <div class="now-playing-secondary">
            ${secondary || groupLabel}
          </div>
        </div>

        <div class="transport">
          <button
            class="round primary"
            aria-label=${playing ? "Pause" : "Play"}
            ?disabled=${!available}
            @click=${this._playPause}
          >
            <ha-icon icon=${playing ? "mdi:pause" : "mdi:play"}></ha-icon>
          </button>
          <button
            class="round"
            aria-label="Stop"
            ?disabled=${!available}
            @click=${this._stop}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        </div>

        ${this._renderVolume(GROUP_VOLUME_KEY, groupVolumeLevel, "Group volume", !available)}

        <button
          class="multiroom"
          aria-label="Multiroom"
          aria-haspopup="dialog"
          aria-expanded=${this._drawerOpen ? "true" : "false"}
          ?disabled=${config.speakers.length === 0}
          @click=${this._openDrawer}
        >
          <ha-icon icon="mdi:speaker-multiple"></ha-icon>
          <span class="multiroom-label">Multiroom</span>
          ${members.length > 1
            ? b `<span class="count">${members.length}</span>`
            : A}
        </button>
      </div>
    `;
    }
    _renderVolume(key, actual, label, disabled) {
        const volume = this._volume.draft(key) ?? actual;
        const percent = Math.round((volume ?? 0) * 100);
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
          max="100"
          step="1"
          aria-label=${label}
          .value=${l(String(percent))}
          style="--value: ${percent}%"
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
        const members = this._members;
        const memberSet = new Set(members);
        const coordinatorId = this._coordinatorId;
        const groupName = formatGroupName(members.map((id) => this._speakerName(id)));
        const closing = this._drawerClosing ? "closing" : "";
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
            <span class="drawer-eyebrow">Group speakers</span>
            <h2 id="drawer-title">
              ${groupName ? `Sonos group: ${groupName}` : "No active group"}
            </h2>
          </div>
          <button
            class="round small close"
            aria-label="Close"
            @click=${this._closeDrawer}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <ul class="rooms">
          ${this._config.speakers.map((speaker) => this._renderRoom(speaker, memberSet, members.length, coordinatorId))}
        </ul>
      </aside>
    `;
    }
    _renderRoom(speaker, members, memberCount, coordinatorId) {
        const entityId = speaker.entity;
        const entity = this._hass?.states[entityId];
        const available = isAvailable(entity);
        const inGroup = members.has(entityId);
        const isMaster = entityId === coordinatorId;
        const pending = this._pendingSpeakers.includes(entityId);
        const soleMember = inGroup && memberCount <= 1;
        const name = this._speakerName(entityId, speaker);
        const volume = entity?.attributes.volume_level;
        const status = !entity
            ? "Not found in Home Assistant"
            : !available
                ? "Unavailable – check power and network"
                : pending
                    ? inGroup
                        ? "Leaving group…"
                        : "Joining group…"
                    : isMaster
                        ? soleMember
                            ? "Master · only room in group"
                            : "Group master"
                        : inGroup
                            ? "In group"
                            : "Not in group";
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
            aria-label=${`${name} in group`}
            @change=${(event) => this._toggleSpeaker(entityId, event.target.checked)}
          ></ha-switch>
        </div>
        ${this._renderVolume(entityId, typeof volume === "number" ? volume : undefined, `${name} volume`, !available)}
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

    .now-playing {
      flex: 1 1 100%;
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

    @container (min-width: 720px) {
      .now-playing {
        flex: 1 1 180px;
      }
    }

    @container (max-width: 600px) {
      .controls {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
      }
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
}
window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "sonos-radio-card")) {
    window.customCards.push({
        type: "sonos-radio-card",
        name: "Sonos Radio Card",
        description: "Control Sonos speakers and radio stations.",
        preview: false,
    });
}
