import { SalesDemoMode } from '@/components/sales-demo/SalesDemoMode';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HospitalSize } from '@/lib/demoDataGenerator';

export default function SalesDemoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get initial hospital size from URL params
  const sizeParam = searchParams.get('size') as HospitalSize | null;
  const initialSize: HospitalSize = sizeParam && ['clinic', 'general', 'state'].includes(sizeParam) 
    ? sizeParam 
    : 'general';

  const handleExit = () => {
    navigate('/');
  };

  return (
    <SalesDemoMode 
      onExit={handleExit} 
      initialSize={initialSize}
    />
  );
}
