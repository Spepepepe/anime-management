import { supabase } from '../supabaseClient';

export interface IYearlyStats {
  year: number;
  animeCount: number;
  dramaCount: number;
}

export const getYearlyViewingStats = async (userId: string): Promise<IYearlyStats[]> => {
  const { data, error } = await supabase
    .from('anime_viewing_end_dates')
    .select(`
      day,
      anime!inner(anime_flg, user_id)
    `)
    .eq('user_id', userId);

  if (error) throw error;

  // 年別に集計
  const statsMap = new Map<number, { animeCount: number; dramaCount: number }>();

  data.forEach((item: any) => {
    const year = new Date(item.day).getFullYear();
    const isAnime = item.anime.anime_flg;

    if (!statsMap.has(year)) {
      statsMap.set(year, { animeCount: 0, dramaCount: 0 });
    }

    const stats = statsMap.get(year)!;
    if (isAnime) {
      stats.animeCount++;
    } else {
      stats.dramaCount++;
    }
  });

  // 年の昇順でソートして配列に変換
  const result: IYearlyStats[] = Array.from(statsMap.entries())
    .map(([year, counts]) => ({
      year,
      animeCount: counts.animeCount,
      dramaCount: counts.dramaCount,
    }))
    .sort((a, b) => a.year - b.year);

  return result;
};
