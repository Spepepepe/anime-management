import { useState,useEffect } from "react";
import { ICurrentAnime } from "../data/interface";
import { AnimeCurrentListItem } from "./animeCurrentListItem";
import { supabase } from '../../../lib/supabaseClient';
import { getCurrentAnime, currentAnimeEpisodeUp, currentAnimeFinishWatching, deleteCurrentAnime } from '../../../lib/service/animeCurrentService';
const AnimeCurrentEntry = () => {

  const [currentAnime,SetCurrentAnime] = useState<ICurrentAnime[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const dayOfWeek = currentDateTime.toLocaleString('ja-JP', { weekday: 'long' });
  const dateString = currentDateTime.toLocaleDateString('ja-JP');
  const timeString = currentDateTime.toLocaleTimeString('ja-JP');

  const loadCurrentAnime = async () => {
    if (!user) return;
    
    try {
      const data = await getCurrentAnime(user.id);
      SetCurrentAnime(data);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラーが発生しました。");
    }
  }

  const handleEpisodeUp = async (animeId : number) => {
    if (!user) return;
    
    try {
      await currentAnimeEpisodeUp(animeId, user.id);
      loadCurrentAnime();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("話数カウントに失敗しました。");
    }
  }

  const handleFinishWatching = async (animeId : number) => {
    if (!user) return;
    
    try {
      await currentAnimeFinishWatching(animeId, user.id);
      loadCurrentAnime();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("視聴終了に失敗しました。");
    }
  }

  const onEpisodeUp = (iCurrentAnime:ICurrentAnime) =>{
    handleEpisodeUp(iCurrentAnime.anime_id);
  }

  const onFinishWatching = async (iCurrentAnime:ICurrentAnime) => {
    handleFinishWatching(iCurrentAnime.anime_id);
  }

  const handleDelete = async (animeId: number) => {
    try {
      await deleteCurrentAnime(animeId);
      loadCurrentAnime();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("削除に失敗しました。");
    }
  }

  const onDelete = (iCurrentAnime:ICurrentAnime) => {
    handleDelete(iCurrentAnime.anime_id);
  }

  useEffect(() => {
    if (user) {
      loadCurrentAnime();
    }
  }, [user])

  return (
    <div className="block justify-center p-2 bg-gray-100 bg-opacity-50 min-h-full min-w-full">
      <div className="flex flex-row items-center justify-center space-x-4 my-1">
        <div className="text-sm md:text-xl text-gray-800 font-semibold mt-2">{dayOfWeek}</div>
        <div className="text-sm md:text-xl text-indigo-600 font-bold mt-2">{dateString}</div>
        <div className="text-sm md:text-xl text-gray-600 mt-2">{timeString}</div>
      </div>
      <div className="h-[calc(100vh-8rem)] w-full overflow-auto scrollbar-hide">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-100">
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">タイトル</th>
              {/* <th className="px-1 py-1 text-xs font-medium text-gray-700 text-center whitespace-nowrap">配信開始日</th> */}
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">曜日</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">配信</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">話数</th>
              <th className="px-1 py-1 text-xs md:px-4 md:py-2 md:text-base font-medium text-gray-700 text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentAnime.map((currentAnimedata, index) => (
              <AnimeCurrentListItem key={index} currentAnime={currentAnimedata} onclick={onEpisodeUp} onFinish={onFinishWatching} onDelete={onDelete}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimeCurrentEntry;