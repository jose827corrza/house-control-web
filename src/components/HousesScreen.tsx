import { useHouseData } from '../hooks/useHouseData';
import { HouseList } from './HouseList';

export default function HousesScreen() {
  const { data, loading, error, refetch } = useHouseData();

  return (
    <div className="p-6 text-white min-h-screen bg-gray-950 justify-items-center">

      {loading && <p className="text-yellow-400">Loading houses...</p>}
      
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && data && data.length === 0 && (
        <p className="text-gray-400">No houses found.</p>
      )}

      {!loading && !error && data && data.length > 0 && (
        <HouseList housesArray={data} refetchHouses={refetch}/>
      )}
    </div>
  );
}
