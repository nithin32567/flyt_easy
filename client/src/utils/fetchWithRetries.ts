interface FetchWithRetriesOptions {
  retries?: number;
  backoff?: number;
  timeout?: number;
}

interface FetchResult {
  ok: boolean;
  status: number;
  body: any;
  error?: any;
  errorCode?: string;
}

export async function fetchWithRetries(
  url: string,
  options: RequestInit = {},
  config: FetchWithRetriesOptions = {}
): Promise<FetchResult> {
  const { retries = 2, backoff = 300, timeout = 10000 } = config;
  let attempt = 0;
  let lastError: any;

  while (attempt <= retries) {
    try {
      console.log(`=== FETCH ATTEMPT ${attempt + 1}/${retries + 1} ===`);
      console.log('URL:', url);
      console.log('Options:', JSON.stringify(options, null, 2));

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`=== FETCH RESPONSE (Attempt ${attempt + 1}) ===`);
      console.log('Status:', response.status);
      console.log('OK:', response.ok);

      let body;
      try {
        body = await response.json();
      } catch (parseError) {
        console.warn('Failed to parse JSON response:', parseError);
        body = null;
      }

      console.log('Response body:', JSON.stringify(body, null, 2));

      return {
        ok: response.ok,
        status: response.status,
        body,
        error: response.ok ? undefined : body?.message || `HTTP ${response.status}`,
        errorCode: body?.code || body?.errorCode
      };

    } catch (err: any) {
      lastError = err;
      attempt++;
      
      console.error(`=== FETCH ATTEMPT ${attempt} FAILED ===`);
      console.error('Error:', err.message);
      console.error('Error type:', err.name);
      console.error('Error code:', err.code);

      // Don't retry on certain errors
      if (err.name === 'AbortError' || err.status === 401 || err.status === 403) {
        console.log('Non-retryable error, stopping attempts');
        break;
      }

      if (attempt <= retries) {
        const delay = backoff * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('=== ALL FETCH ATTEMPTS FAILED ===');
  console.error('Final error:', lastError);

  return {
    ok: false,
    status: lastError?.status || 0,
    body: null,
    error: lastError?.message || 'Network error',
    errorCode: lastError?.code
  };
}

export async function fetchWithAxiosRetries(
  axiosInstance: any,
  url: string,
  options: any = {},
  config: FetchWithRetriesOptions = {}
): Promise<FetchResult> {
  const { retries = 2, backoff = 300 } = config;
  let attempt = 0;
  let lastError: any;

  while (attempt <= retries) {
    try {
      console.log(`=== AXIOS ATTEMPT ${attempt + 1}/${retries + 1} ===`);
      console.log('URL:', url);
      console.log('Options:', JSON.stringify(options, null, 2));

      const response = await axiosInstance(url, options);

      console.log(`=== AXIOS RESPONSE (Attempt ${attempt + 1}) ===`);
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(response.data, null, 2));

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        body: response.data,
        error: response.status >= 400 ? response.data?.message || `HTTP ${response.status}` : undefined,
        errorCode: response.data?.code || response.data?.errorCode
      };

    } catch (err: any) {
      lastError = err;
      attempt++;
      
      console.error(`=== AXIOS ATTEMPT ${attempt} FAILED ===`);
      console.error('Error:', err.message);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);

      // Don't retry on certain errors
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404) {
        console.log('Non-retryable error, stopping attempts');
        break;
      }

      if (attempt <= retries) {
        const delay = backoff * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('=== ALL AXIOS ATTEMPTS FAILED ===');
  console.error('Final error:', lastError);

  return {
    ok: false,
    status: lastError?.response?.status || 0,
    body: null,
    error: lastError?.response?.data?.message || lastError?.message || 'Network error',
    errorCode: lastError?.response?.data?.code || lastError?.code
  };
}
