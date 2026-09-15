'use client';import dynamic from 'next/dynamic';
const MarkdownPreviewer=dynamic(()=>import('./WritingTools').then(m=>m.MarkdownPreviewer),{ssr:false});
export default MarkdownPreviewer;
