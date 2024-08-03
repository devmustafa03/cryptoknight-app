import { XRapidAPIHost, XRapidAPIKey } from "./api";
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

export const FetchAllCoins = async () => {
  return await CryptoApiCall(coinsUri, {});
}