import axios from 'axios';

export const handleSearch = async (payload, setLoading, setError, setResponse) => {
  const url = "http://129.159.151.202:5000/search";
  
  setLoading(true);
  setError(null);
  setResponse(null);

  try {
    const res = await axios.post(url, payload, {
      headers: {'Content-Type': 'application/json'}
    });
    console.log(` this is the resice data${res}`);
    setResponse(res.data);
  } catch (err) {
    setError(`Error: ${err.response?.status || 'Unknown'}, ${err.response?.data || err.message}`);
  } finally {
    setLoading(false);
  }
};
