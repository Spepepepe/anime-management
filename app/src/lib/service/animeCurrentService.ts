import { supabase } from '../supabaseClient';
import { ICurrentAnime } from '../../app/component/data/interface';
import { addWatchHistory } from './watchHistoryService';

export const getCurrentAnime = async (userId: string): Promise<ICurrentAnime[]> => {
  const { data, error } = await supabase
    .from('current_anime')
    .select(`
      *,
      anime!inner(*)
    `)
    .eq('anime.user_id', userId)
    .order('delivery_weekday', { ascending: true })
    .order('delivery_time', { ascending: true });
    
  if (error) throw error;
  
  return data.map((item: any) => ({
    id: item.id,
    anime_id: item.anime_id,
    year: item.year,
    season: item.season as '1' | '2' | '3' | '4',
    releasedate: item.releasedate,
    delivery_weekday: item.delivery_weekday as '1' | '2' | '3' | '4' | '5' | '6' | '7',
    delivery_time: item.delivery_time,
    anime: {
      id: item.anime.id,
      user_id: item.anime.user_id,
      anime_name: item.anime.anime_name,
      episode: item.anime.episode,
      favoritecharacter: item.anime.favoritecharacter,
      speed: item.anime.speed,
      anime_flg: item.anime.anime_flg,
    },
  }));
};

export const currentAnimeEpisodeUp = async (animeId: number, userId: string): Promise<void> => {
  const { data: currentData, error: fetchError } = await supabase
    .from('anime')
    .select('episode')
    .eq('anime_id', animeId)
    .single();
    
  if (fetchError) throw fetchError;
  
  const newEpisode = currentData.episode + 1;
  
  const { error } = await supabase
    .from('anime')
    .update({ episode: newEpisode })
    .eq('anime_id', animeId);
    
  if (error) throw error;
  
  await addWatchHistory(animeId, userId, newEpisode);
};

export const deleteCurrentAnime = async (animeId: number): Promise<void> => {
  // current_animeから削除
  const { error: deleteCurrentError } = await supabase
    .from('current_anime')
    .delete()
    .eq('anime_id', animeId);

  if (deleteCurrentError) throw deleteCurrentError;

  // animeテーブルから削除
  const { error: deleteAnimeError } = await supabase
    .from('anime')
    .delete()
    .eq('anime_id', animeId);

  if (deleteAnimeError) throw deleteAnimeError;
};

export const currentAnimeFinishWatching = async (animeId: number, userId: string): Promise<void> => {
  const { data: animeData, error: fetchError } = await supabase
    .from('anime')
    .select('view_count')
    .eq('anime_id', animeId)
    .single();
    
  if (fetchError) throw fetchError;
  
  const currentCount = animeData.view_count || 0;
  const { error: updateError } = await supabase
    .from('anime')
    .update({ 
      view_count: currentCount + 1,
      episode: 0
    })
    .eq('anime_id', animeId);
    
  if (updateError) throw updateError;
  
  const { error: deleteError } = await supabase
    .from('current_anime')
    .delete()
    .eq('anime_id', animeId);
    
  if (deleteError) throw deleteError;
  
  const { error: insertError } = await supabase
    .from('viewed_anime')
    .insert({
      anime_id: animeId,
      user_id: userId,
      viewed_end_date: new Date().toISOString()
    });
    
  if (insertError) throw insertError;
};