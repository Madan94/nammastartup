"use client";
import {useEffect,useRef} from 'react';
import type {Company} from '@/lib/catalog/types';
import 'leaflet/dist/leaflet.css';
export default function ChennaiMap({companies,onSelect}:{companies:Company[];onSelect:(slug:string)=>void}){
 const ref=useRef<HTMLDivElement>(null);const select=useRef(onSelect);
 useEffect(()=>{select.current=onSelect},[onSelect]);
 useEffect(()=>{let dispose=()=>{};let cancelled=false;void import('leaflet').then(L=>{if(cancelled||!ref.current)return;const map=L.map(ref.current,{scrollWheelZoom:false}).setView([13.02,80.22],11);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).addTo(map);const points: [number,number][]=[];companies.forEach(c=>{if(c.latitude===null||c.longitude===null)return;const point:[number,number]=[c.latitude,c.longitude];points.push(point);const marker=L.circleMarker(point,{radius:10,color:'#fff',weight:3,fillColor:'#345c43',fillOpacity:1}).addTo(map);marker.bindTooltip(c.name,{direction:'top'});marker.on('click',()=>select.current(c.slug));});if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[50,50],maxZoom:13});dispose=()=>map.remove();});return()=>{cancelled=true;dispose()};},[companies]);
 return <div ref={ref} className="interactive-map" role="region" aria-label="Interactive map of Chennai companies. Use the adjacent company list for accessible navigation."/>;
}
