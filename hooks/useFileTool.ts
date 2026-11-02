'use client';
import { useCallback, useState } from 'react';
export function useFileTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pick = useCallback((f: File | null) => {
    setError('');
    setFile(f);
  }, []);
  return { file, pick, busy, setBusy, error, setError };
}
