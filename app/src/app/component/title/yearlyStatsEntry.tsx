import { useState, useEffect } from "react";
import { supabase } from '../../../lib/supabaseClient';
import { getYearlyViewingStats, IYearlyStats } from '../../../lib/service/animeYearlyStatsService';

const YearlyStatsEntry = () => {
  const [yearlyStats, setYearlyStats] = useState<IYearlyStats[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const loadYearlyStats = async () => {
    if (!user) return;

    try {
      const data = await getYearlyViewingStats(user.id);
      setYearlyStats(data);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラーが発生しました。");
    }
  };

  useEffect(() => {
    if (user) {
      loadYearlyStats();
    }
  }, [user]);

  return (
    <div className="flex flex-col p-2 bg-gray-100 bg-opacity-50 min-h-full min-w-full">
      <div className="h-[calc(100vh-10rem)] w-full overflow-auto scrollbar-hide">
        <table className="table-fixed w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-100">
              <th className="w-1/3 px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">年</th>
              <th className="w-1/3 px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">アニメ</th>
              <th className="w-1/3 px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center">ドラマ</th>
            </tr>
          </thead>
          <tbody>
            {yearlyStats.map((stat, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                <td className="!text-black px-1 py-1 text-xs md:text-base text-center font-semibold">{stat.year}</td>
                <td className="!text-black px-1 py-1 text-xs md:text-base text-center text-blue-600">{stat.animeCount}本</td>
                <td className="!text-black px-1 py-1 text-xs md:text-base text-center text-pink-600">{stat.dramaCount}本</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyStatsEntry;
