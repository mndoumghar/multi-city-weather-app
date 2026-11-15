# Manual Error Tests

This guide helps you test the Weather Dashboard error handling in Chrome. These are manual browser tests, not automated tests.

## 1. Prepare the application

1. Start the application with Live Server (or another local HTTP server).
2. Open it in Chrome.
3. Press `F12` and open the **Console** tab.
4. Make sure the Console execution context is set to `top`.
5. Paste the helper code below once.

## 2. Install the test helpers

Paste this code into the Console and press Enter:

```js

(() => {

  const originalFetch = window.fetch;
  window.mockNextFetch = (mockResponse) => {
    window.fetch = async (...args) => {
      window.fetch = originalFetch;
      return mockResponse(...args);
    };
  };

  window.mockNextHttp = (status) => {
    window.mockNextFetch(() => new Response(null, { status }));
  };

  window.mockNextInvalidJson = () => {
    window.mockNextFetch(() => new Response("This is not valid JSON", {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }));
  };


  window.mockNextNetworkError = () => {
    window.mockNextFetch(() => {
      throw new TypeError("Failed to fetch");
    });
  };

  window.restoreFetch = () => {
    window.fetch = originalFetch;
    console.log("Fetch restored.");
  };

  console.log("Error-test helpers are ready.");
})();

```

Each mock affects only the **next** Fetch request. The original `fetch` is restored automatically after that request.

## 3. Run the tests

For each test:

1. Paste the test command into the Console and press Enter.
2. Return to the application.
3. Perform the action described below. For search-request tests, enter `Nador` and click **Search**.
4. Check the message shown in the page, not only the Console.
5. Confirm that the loading message disappears and the application remains usable.

| Test | Console command | Action | Expected error code / message |
|---|---|---|---|
| Network error | `mockNextNetworkError()` | Search for Nador | `NETWORK_ERROR` — Unable to connect. Check your internet connection and try again. |
| HTTP 400 | `mockNextHttp(400)` | Search for Nador | `BAD_REQUEST` — The request was invalid. Please try again. |
| HTTP 401 | `mockNextHttp(401)` | Search for Nador | `API_ACCESS_ERROR` — The weather service rejected the request. Please try again later. |
| HTTP 403 | `mockNextHttp(403)` | Search for Nador | `API_ACCESS_ERROR` — The weather service rejected the request. Please try again later. |
| HTTP 404 | `mockNextHttp(404)` | Search for Nador | `HTTP_ERROR` — The weather service returned an unexpected response. |
| HTTP 429 | `mockNextHttp(429)` | Search for Nador | `RATE_LIMIT` — Too many requests. Please wait a moment and try again. |
| HTTP 500 | `mockNextHttp(500)` | Search for Nador | `SERVER_ERROR` — The weather service is temporarily unavailable. Please try again later. |
| Invalid JSON | `mockNextInvalidJson()` | Search for Nador | `INVALID_RESPONSE` — The weather service returned invalid data. |

### Unknown city (real API test)

1. Do not install a mock for this test.
2. Search for a random name such as `xyzabc123notacity`.
3. Expected: `CITY_NOT_FOUND` — "We couldn't find that city. Check the spelling and try again."

### Retry after an error

1. Run one of the mock tests above and confirm that its error message appears.
2. Search for `Nador` again. Do not install another mock.
3. Select Nador from the results.
4. Expected: the weather card loads successfully without refreshing the page.

## 4. What counts as a passed test?

Mark a test as **PASS** only when all applicable checks succeed:

- The correct error message appears in the application UI.
- The loading indicator disappears after the request finishes.
- The application does not become unusable.
- A later valid search can succeed without a page refresh.

A red `AppError` stack trace in the Console is expected when the application calls `console.error(error)`. It does not, by itself, mean that the UI failed.

## 5. Test results log

Record the actual result and date. Do not mark a test as passed until you have checked the browser UI.

| Test | Result (PASS / FAIL / NOT TESTED) | Notes / date |
|---|---|---|
| Network error | NOT TESTED | |
| HTTP 400 | NOT TESTED | |
| HTTP 401 | NOT TESTED | |
| HTTP 403 | NOT TESTED | |
| HTTP 404 | NOT TESTED | |
| HTTP 429 | NOT TESTED | |
| HTTP 500 | NOT TESTED | |
| Invalid JSON | NOT TESTED | |
| Unknown city | NOT TESTED | |
| Retry after error | NOT TESTED | |

## Important notes

- These HTTP and JSON tests use mocked responses. They test how the application handles responses; they do not make the Open-Meteo server return those errors.
- Do not use an infinite loop or send repeated requests to try to trigger HTTP 429 or 500 on the live API.
- If the Console helper is lost or the page behaves unexpectedly, reload the page and paste the helper code again when needed.
- The `window.restoreFetch()` helper restores the original Fetch function captured when the helpers were installed.
