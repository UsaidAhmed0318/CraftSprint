'use client';
import dynamic from 'next/dynamic';
const KanbanBoard = dynamic(
  () => import('@/components/tools/productivity/KanbanBoard').then(m => m.KanbanBoard),
  { ssr: false },
);
export default KanbanBoard;
