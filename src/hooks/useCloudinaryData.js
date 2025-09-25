import { useEffect, useState } from 'react';
import { ensureClientSideDataLoaded } from '../utils/cloudinary-mapping';

export function useCloudinaryData() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== 'undefined' && !isLoaded && !isLoading) {
        setIsLoading(true);
        try {
          await ensureClientSideDataLoaded();
          setIsLoaded(true);
          console.log('✅ Cloudinary data loaded globally');
        } catch (error) {
          console.error('❌ Failed to load Cloudinary data globally:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [isLoaded, isLoading]);

  return { isLoaded, isLoading };
}
