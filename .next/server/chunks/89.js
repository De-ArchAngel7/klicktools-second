exports.id=89,exports.ids=[89],exports.modules={46855:(e,t,r)=>{Promise.resolve().then(r.bind(r,94332))},47222:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2583,23)),Promise.resolve().then(r.t.bind(r,26840,23)),Promise.resolve().then(r.t.bind(r,38771,23)),Promise.resolve().then(r.t.bind(r,13225,23)),Promise.resolve().then(r.t.bind(r,9295,23)),Promise.resolve().then(r.t.bind(r,43982,23))},94332:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var s=r(95344),n=r(47674);function i({children:e}){return s.jsx(n.SessionProvider,{children:e})}},51354:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]])},48120:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]])},28765:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])},76755:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},18822:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},14513:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},78062:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>d,metadata:()=>u});var s=r(25036),n=r(80265),i=r.n(n);r(67272);let l=(0,r(86843).createProxy)(String.raw`C:\Users\Heylel Yaka\Desktop\klicktools\app\providers.tsx`),{__esModule:o,$$typeof:a}=l,c=l.default,u={title:"KlickTools - Find the Smartest Tools on the Web",description:"Discover and explore the best AI tools, productivity apps, and utilities on the web."};function d({children:e}){return s.jsx("html",{lang:"en",children:(0,s.jsxs)("body",{className:i().className,children:[s.jsx("div",{className:"stars-bg",children:Array.from({length:15}).map((e,t)=>s.jsx("div",{className:"star"},t))}),s.jsx(c,{children:e})]})})}},67272:()=>{},73644:(e,t,r)=>{"use strict";r.d(t,{M:()=>y});var s=r(3729),n=r(19038);function i(){let e=(0,s.useRef)(!1);return(0,n.L)(()=>(e.current=!0,()=>{e.current=!1}),[]),e}var l=r(80228),o=r(35986),a=r(40207);class c extends s.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=this.props.sizeRef.current;e.height=t.offsetHeight||0,e.width=t.offsetWidth||0,e.top=t.offsetTop,e.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function u({children:e,isPresent:t}){let r=(0,s.useId)(),n=(0,s.useRef)(null),i=(0,s.useRef)({width:0,height:0,top:0,left:0});return(0,s.useInsertionEffect)(()=>{let{width:e,height:s,top:l,left:o}=i.current;if(t||!n.current||!e||!s)return;n.current.dataset.motionPopId=r;let a=document.createElement("style");return document.head.appendChild(a),a.sheet&&a.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${s}px !important;
            top: ${l}px !important;
            left: ${o}px !important;
          }
        `),()=>{document.head.removeChild(a)}},[t]),s.createElement(c,{isPresent:t,childRef:n,sizeRef:i},s.cloneElement(e,{ref:n}))}let d=({children:e,initial:t,isPresent:r,onExitComplete:n,custom:i,presenceAffectsLayout:l,mode:c})=>{let d=(0,a.h)(p),f=(0,s.useId)(),h=(0,s.useMemo)(()=>({id:f,initial:t,isPresent:r,custom:i,onExitComplete:e=>{for(let t of(d.set(e,!0),d.values()))if(!t)return;n&&n()},register:e=>(d.set(e,!1),()=>d.delete(e))}),l?void 0:[r]);return(0,s.useMemo)(()=>{d.forEach((e,t)=>d.set(t,!1))},[r]),s.useEffect(()=>{r||d.size||!n||n()},[r]),"popLayout"===c&&(e=s.createElement(u,{isPresent:r},e)),s.createElement(o.O.Provider,{value:h},e)};function p(){return new Map}var f=r(66828),h=r(87222);let m=e=>e.key||"",y=({children:e,custom:t,initial:r=!0,onExitComplete:o,exitBeforeEnter:a,presenceAffectsLayout:c=!0,mode:u="sync"})=>{var p;(0,h.k)(!a,"Replace exitBeforeEnter with mode='wait'");let y=(0,s.useContext)(f.p).forceRender||function(){let e=i(),[t,r]=(0,s.useState)(0),n=(0,s.useCallback)(()=>{e.current&&r(t+1)},[t]);return[(0,s.useCallback)(()=>l.Wi.postRender(n),[n]),t]}()[0],v=i(),k=function(e){let t=[];return s.Children.forEach(e,e=>{(0,s.isValidElement)(e)&&t.push(e)}),t}(e),x=k,E=(0,s.useRef)(new Map).current,b=(0,s.useRef)(x),P=(0,s.useRef)(new Map).current,g=(0,s.useRef)(!0);if((0,n.L)(()=>{g.current=!1,function(e,t){e.forEach(e=>{let r=m(e);t.set(r,e)})}(k,P),b.current=x}),p=()=>{g.current=!0,P.clear(),E.clear()},(0,s.useEffect)(()=>()=>p(),[]),g.current)return s.createElement(s.Fragment,null,x.map(e=>s.createElement(d,{key:m(e),isPresent:!0,initial:!!r&&void 0,presenceAffectsLayout:c,mode:u},e)));x=[...x];let R=b.current.map(m),Z=k.map(m),w=R.length;for(let e=0;e<w;e++){let t=R[e];-1!==Z.indexOf(t)||E.has(t)||E.set(t,void 0)}return"wait"===u&&E.size&&(x=[]),E.forEach((e,r)=>{if(-1!==Z.indexOf(r))return;let n=P.get(r);if(!n)return;let i=R.indexOf(r),l=e;l||(l=s.createElement(d,{key:m(n),isPresent:!1,onExitComplete:()=>{E.delete(r);let e=Array.from(P.keys()).filter(e=>!Z.includes(e));if(e.forEach(e=>P.delete(e)),b.current=k.filter(t=>{let s=m(t);return s===r||e.includes(s)}),!E.size){if(!1===v.current)return;y(),o&&o()}},custom:t,presenceAffectsLayout:c,mode:u},n),E.set(r,l)),x.splice(i,0,l)}),x=x.map(e=>{let t=e.key;return E.has(t)?e:s.createElement(d,{key:m(e),isPresent:!0,presenceAffectsLayout:c,mode:u},e)}),s.createElement(s.Fragment,null,E.size?x:x.map(e=>(0,s.cloneElement)(e)))}}};