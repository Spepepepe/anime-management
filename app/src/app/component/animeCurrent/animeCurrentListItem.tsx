import { ICurrentAnime } from "../data/interface";
import { AnimeCurrentListItemProps } from "../data/props";
export const AnimeCurrentListItem : React.FC<AnimeCurrentListItemProps> = ({currentAnime,onclick,onFinish}) => {
    const releaseDate = currentAnime.releasedate;

    const currentDate = new Date();

    const colorMap = {
        Monday: "bg-blue-500", 
        Tuesday: "bg-green-400",
        Wednesday: "bg-pink-300",
        Thursday: "bg-orange-400",
        Friday: "bg-yellow-300", 
        Saturday: "bg-red-500", 
        Sunday: "bg-teal-300",
      };


    // 今日の曜日を取得 (0: 日曜日, 1: 月曜日, ..., 6: 土曜日)
    const todayWeekday = currentDate.getDay();
    // 1-7の形式に変換 (1: 月曜日, ..., 7: 日曜日)
    const todayWeekdayStr = todayWeekday === 0 ? "7" : todayWeekday.toString();

    let deliveryWeeday = "";
    let stateBgColorClass = "";
    let isToday = false;

    switch(currentAnime.delivery_weekday){
        case "1":
            deliveryWeeday = "月";
            stateBgColorClass = colorMap['Monday'];
            isToday = todayWeekdayStr === "1";
        break;
        case "2":
            deliveryWeeday = "火";
            stateBgColorClass = colorMap['Tuesday'];
            isToday = todayWeekdayStr === "2";
        break;
        case "3":
            deliveryWeeday = "水";
            stateBgColorClass = colorMap['Wednesday'];
            isToday = todayWeekdayStr === "3";
        break;
        case "4":
            deliveryWeeday = "木";
            stateBgColorClass = colorMap['Thursday'];
            isToday = todayWeekdayStr === "4";
        break;
        case "5":
            deliveryWeeday = "金";
            stateBgColorClass = colorMap['Friday'];
            isToday = todayWeekdayStr === "5";
        break;
        case "6":
            deliveryWeeday = "土";
            stateBgColorClass = colorMap['Saturday'];
            isToday = todayWeekdayStr === "6";
        break;
        case "7":
            deliveryWeeday = "日";
            stateBgColorClass = colorMap['Sunday'];
            isToday = todayWeekdayStr === "7";
        break;
    }

    // 今日の場合は反転スタイルを適用
    const weekdayTextColor = isToday ? stateBgColorClass.replace('bg-', 'text-') : '!text-black';
    const weekdayBgColor = isToday ? '!bg-black' : stateBgColorClass;

    const onEpisodeUp = () => {
        onclick(currentAnime);
    }

    const onFinishAnime = () => {
        onFinish(currentAnime);
    }

    const getExpectedEpisodes = (delivery:string) => {
        const releaseDateTime = new Date(`${releaseDate}T${delivery}`);
        const diffInMilliseconds = currentDate.getTime() - releaseDateTime.getTime();
        const diffInWeeks = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 7));

        return diffInWeeks + 1;
    };

    const getRowStyle = (currentAnime:ICurrentAnime) => {
        const { delivery_time:delivery, anime:animeInfo } = currentAnime;
        const expectedEpisodes = getExpectedEpisodes(delivery);

        if (expectedEpisodes > animeInfo.episode) {
            return {
                titleColor: '!text-red-600',
                fontWeight: 'font-bold'
            };
        }else{
            return {
                titleColor: '!text-black',
                fontWeight: ''
            };
        }
    };

    const rowStyle = getRowStyle(currentAnime);

    const formatAnimeName = (name: string) => {
        if (window.innerWidth >= 768) return name; // Web版では区切らない
        if (name.length <= 10) return name;
        const chunks = [];
        for (let i = 0; i < name.length; i += 10) {
            chunks.push(name.slice(i, i + 10));
        }
        return chunks.join('\n');
    };
    const animeName = formatAnimeName(currentAnime.anime.anime_name);

    return (
        <tr className={`bg-white hover:bg-gray-100 ${rowStyle.fontWeight}`}>
            <td className={`px-1 py-1 text-xs md:text-base whitespace-pre md:whitespace-nowrap ${rowStyle.titleColor}`}>{animeName}</td>
            {/* <td className="!text-black px-1 py-1 text-center text-xs whitespace-nowrap">{releaseDate}</td> */}
            <td className={`px-1 py-1 text-center text-xs md:text-base whitespace-nowrap ${weekdayTextColor} ${weekdayBgColor}`}>{deliveryWeeday}</td>
            <td className="!text-black px-1 py-1 text-center text-xs md:text-base whitespace-nowrap">{currentAnime.delivery_time.slice(0, 5)}</td>
            <td className="!text-black px-1 py-1 text-center text-xs md:text-base whitespace-nowrap">{currentAnime.anime.episode}話</td>
            <td className="!text-black px-1 py-1 text-center whitespace-nowrap">
                <div className="flex flex-col md:flex-row gap-1 md:gap-4 md:justify-center">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 md:w-24 md:h-16 md:text-base rounded"
                        onClick={onEpisodeUp}>
                    視聴
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 md:w-24 md:h-16 md:text-base rounded"
                        onClick={onFinishAnime}>
                    終了
                    </button>
                </div>
            </td>
        </tr>
    );
};
