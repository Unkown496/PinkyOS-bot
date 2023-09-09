import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

const instanceSteam = axios.create({
    baseURL: process.env.valve_url,
}),
instanceSteamAbout = axios.create({
    baseURL: `${process.env.valve_url}about/`,
});

const instanceSteamCommunity = axios.create({
    baseURL: process.env.steam_community_url,
    headers: {
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    },
});

const instanceSteamStatic = axios.create({
    baseURL: process.env.steam_community_url_static,
});

/**
 * @async
 * @function getAllStats
 * @return { { users_online: number, users_ingame: number } }
 */
export const getAllStats = async () => await instanceSteamAbout.get('stats');

export const getMarketItems = async (start=0, count=10, appId="", query="") => {
    const marketApiBase = new URL(instanceSteamCommunity.defaults.baseURL);
    marketApiBase.searchParams.append('start', start);
    marketApiBase.searchParams.append('norender', 1);
    marketApiBase.searchParams.append('count', count);
    marketApiBase.searchParams.append('appid', appId);
    marketApiBase.searchParams.append('query', query);

    Array.from(marketApiBase.searchParams).forEach(([paramKey, param]) => {
        if(!param) {
            marketApiBase.searchParams.delete(paramKey);
        };
    });

    return await instanceSteamCommunity.get(`market/search/render${marketApiBase.search}`);
};

export const getCsGoItems = async (start=0, count=10, query="") => await getMarketItems(start, count, 730, query);