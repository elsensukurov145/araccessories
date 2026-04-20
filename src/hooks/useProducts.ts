import { useEffect, useState, useCallback } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (dbError) {
      // Don't show a red banner — just log and return empty list (graceful)
      console.error('[useProducts]', dbError.message);
      setError(null);
      setProducts([]);
    } else {
      setProducts((data ?? []) as unknown as Product[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
