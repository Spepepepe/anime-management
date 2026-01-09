import {IContent,ICurrentAnime,IPastAnime,IViewedAnime} from './interface';

export interface TabProps{
    onReturn: (content:IContent) => void,
    tabContent:Array<IContent>
}

export interface TabItemProps{
    onClick: (content:IContent) => void,
    content:IContent
}

export interface TitleEntryProps{
    onClick: (content:string) => void,
}

export interface LoginProps{
    onLogin: (token:string) => void,
}

export interface AnimeCurrentListItemProps{
    currentAnime: ICurrentAnime,
    onclick : (currentAnime:ICurrentAnime) => void,
    onFinish : (currentAnime:ICurrentAnime) => void
}

export interface AnimePastListItemProps{
    pastAnime: IPastAnime,
    onclick : (pastAnime:IPastAnime) => void,
    onFinish : (pasttAnime:IPastAnime) => void,
    isFirstZeroEpisode?: boolean
}

export interface AnimeViewedListItemProps{
    viewedAnime: IViewedAnime,
    onReturn : (viewedAnime:IViewedAnime) => void,
}