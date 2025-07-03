'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getListingsTags } from '@/lib/services/ad.service';
import { FEATURES_MOCK } from '@/components/features.mock';

interface TagCardsSelectorProps {
  initialSelected?: string[];
  onSelectionChange?: (selectedTags: string[]) => void;
  className?: string;
}

export function TagCardsSelector({
  initialSelected = [],
  onSelectionChange,
  className = '',
}: TagCardsSelectorProps) {
    interface Feature {
    value: string;
    description: string;
  }

  const [availableTags, setAvailableTags] = useState<Feature[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTags(initialSelected);
  }, [initialSelected]);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        setError(null);
        
        // Primeiro tenta buscar da API
        const response = await getListingsTags();
        
        // Se a API retornar dados válidos, usa eles
        if (response.data && response.data.length > 0) {
          setAvailableTags(response.data);
        } else {
          // Se a API retornar vazio, usa o mock
          setAvailableTags(FEATURES_MOCK);
          console.warn('API returned empty data, using mock features');
        }
      } catch (err) {
        // Se a API falhar, usa o mock
        setAvailableTags(FEATURES_MOCK);
        setError('Falha ao carregar opções. Mostrando dados de exemplo.');
        console.error('Failed to fetch tags, using mock data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(updatedTags);
    onSelectionChange?.(updatedTags);
  };

  if (loading) {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>
    );
  }

return (
  <div className={`p-4 rounded-2xl border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
    <div className="flex flex-wrap gap-3">
      {availableTags.map(tag => {
        const isSelected = selectedTags.includes(tag.value);
        return (
          <Button
            key={tag.value}
            type="button"
            variant="outline"
            onClick={() => toggleTag(tag.value)}
            className={`
              px-4 py-1.5 rounded-full transition-all text-sm border-2
              ${isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 border-blue-700 dark:border-blue-800'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'}
              focus-visible:ring-2 focus-visible:ring-blue-500
              active:scale-95
            `}
          >
            <span className="font-medium capitalize">
              {tag.description || formatTagLabel(tag.value)}
            </span>
          </Button>
        );
      })}

      {error && (
        <div className="w-full text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          {error}
        </div>
      )}
    </div>
  </div>
);
}

// Função auxiliar para formatar as labels
function formatTagLabel(tag: string | undefined): string {
  if (!tag || typeof tag !== 'string') return '';
  return tag
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}
