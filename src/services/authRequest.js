import axios from "axios";

//::==>> get base url from .env
const baseUrl = import.meta.env.VITE_API_URL;

const authRequest = async (url, data = {}) => {
  const payload = await axios.post(baseUrl + url, data);
  return payload.data;
};

export default authRequest;
