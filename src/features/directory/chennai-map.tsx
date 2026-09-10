"use client";
import {useEffect,useRef} from 'react';
import type {Map as LeafletMap} from 'leaflet';
import type {Company} from '@/lib/catalog/types';
import 'leaflet/dist/leaflet.css';
export default function ChennaiMap({companies,onSelect,selected}:{companies:Company[];onSelect:(slug:string)=>void;selected:string}){
 const ref=useRef<HTMLDivElement>(null);const mapRef=useRef<LeafletMap|null>(null);const select=useRef(onSelect);
 useEffect(()=>{select.current=onSelect},[onSelect]);
 useEffect(()=>{let cancelled=false;void import('leaflet').then(L=>{if(cancelled||!ref.current)return;const map=L.map(ref.current,{scrollWheelZoom:false}).setView([13.02,80.22],11);mapRef.current=map;L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).addTo(map);const groups=new Map<string,Company[]>();for(const c of companies){if(c.latitude===null||c.longitude===null)continue;const key=c.latitude+','+c.longitude;groups.set(key,[...(groups.get(key)||[]),c]);}const points: [number,number][]=[];for(const group of groups.values()){const c=group[0];const point:[number,number]=[c.latitude!,c.longitude!];points.push(point);const icon=L.divIcon({className:'company-map-marker',html:'<span>'+group.length+'</span>',iconSize:[34,34],iconAnchor:[17,17]});const marker=L.marker(point,{icon,title:c.area+': '+group.length+' companies',keyboard:true}).addTo(map);const tooltip=document.createElement('span');tooltip.textContent=group.map(item=>item.name).join(' · ');marker.bindTooltip(tooltip,{direction:'top'});marker.on('click',()=>select.current(c.slug));}if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[60,60],maxZoom:13});});return()=>{cancelled=true;mapRef.current?.remove();mapRef.current=null};},[companies]);
 useEffect(()=>{const company=companies.find(c=>c.slug===selected);if(company?.latitude!=null&&company.longitude!=null)mapRef.current?.setView([company.latitude,company.longitude],13,{animate:false});},[selected,companies]);
 return <div ref={ref} className="interactive-map" role="region" aria-label="Interactive Chennai company map. Numbered markers group companies sharing a location; all companies are also available in the adjacent list."/>;
}
