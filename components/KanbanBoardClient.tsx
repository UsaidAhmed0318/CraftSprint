'use client';import dynamic from 'next/dynamic';
const KanbanBoard=dynamic(()=>import('./KanbanBoard').then(m=>m.KanbanBoard),{ssr:false});
export default KanbanBoard;
