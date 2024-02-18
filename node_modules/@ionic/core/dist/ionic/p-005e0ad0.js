/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import{e as o,w as s}from"./p-d6129c6e.js";import{f as t,s as r}from"./p-66d633fb.js";import{c as e}from"./p-23a9d086.js";import"./p-06fee233.js";const a=()=>{const a=window;a.addEventListener("statusTap",(()=>{o((()=>{const o=document.elementFromPoint(a.innerWidth/2,a.innerHeight/2);if(!o)return;const n=t(o);n&&new Promise((o=>e(n,o))).then((()=>{s((async()=>{n.style.setProperty("--overflow","hidden"),await r(n,300),n.style.removeProperty("--overflow")}))}))}))}))};export{a as startStatusTap}