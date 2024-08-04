import { XRapidAPIHost, XRapidAPIHostNews, XRapidAPIKey } from "./api";
import axios from "axios";

const apiBaseUri = "https://coinranking1.p.rapidapi.com";

const coinsUri = `${apiBaseUri}/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`;

const CryptoApiCall = async (endpoints: string, params: any) => {
  const options = {
    method: "GET",
    url: endpoints,
    params: params? params : {},
    headers: {
      "X-RapidAPI-Key": `${XRapidAPIKey}`,
      "X-RapidAPI-Host": `${XRapidAPIHost}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error); // TODO: Handle error;
    return {};
  }
}

const newsUrl = "https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk";

const NewsAPICall = async (endpoints: string, params: any) => {
  const options = {
    method: "GET",
    url: endpoints,
    params: params? params : {},
    headers: {
      "X-RapidAPI-Key": `${XRapidAPIKey}`,
      "X-RapidAPI-Host": `${XRapidAPIHostNews}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error); // TODO: Handle error;
    return {};
  }
}

export const FetchAllCoins = async () => {
  return await CryptoApiCall(coinsUri, {});
}

export const FetchCoinDetails = async (uuid: string) => {
  const coinDetailsUri = `${apiBaseUri}/coin/${uuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
  return await CryptoApiCall(coinDetailsUri, {});
}

export const FetchCoinHistory = async (uuid: string) => {
  const coinHistoryUri = `${apiBaseUri}/coin/${uuid}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
  return await CryptoApiCall(coinHistoryUri, {});
}

// Search Coin
export const SearchCoin = async (search: string) => {
  const searchUri = `${apiBaseUri}/search-suggestions?query=${search}&referenceCurrencyUuid=yhjMzLPhuIDl`;
  return await CryptoApiCall(searchUri, {});
}

// News
export const FetchNews = async () => {
  return await NewsAPICall(newsUrl, {});
}