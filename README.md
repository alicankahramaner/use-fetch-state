# useFetchState

![npm](https://img.shields.io/npm/v/use-fetch-state)
![downloads](https://img.shields.io/npm/dm/use-fetch-state)
![license](https://img.shields.io/npm/l/use-fetch-state)

`useFetchState` is a lightweight and type-safe React hook for managing API requests and keeping response data in state.

It provides:

- 🚀 Loading state management
- ❌ Error handling
- 🔄 Manual request triggering
- 🔁 Optional auto re-fetch on request change
- 🧠 Fully generic & TypeScript friendly
- 📦 Zero dependencies (except React)

---

## Installation

```bash
npm install use-fetch-state
# or
yarn add use-fetch-state
```

---

# Quick Start

```tsx
import { useEffect } from "react";
import { useFetchState } from "use-fetch-state";

function MyComponent() {
  const { loading, response, error, fetchData } = useFetchState({
    fetcher: async (request) => {
      const res = await fetch("/api/data", {
        method: "POST",
        body: JSON.stringify(request),
      });

      if (!res.ok) return false;

      return await res.json();
    },
    initialRequest: { id: 1 },
    initialResponse: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (response) return <pre>{JSON.stringify(response, null, 2)}</pre>;

  return <p>No data.</p>;
}
```

---

# Dynamic Request Example

```tsx
import { useEffect, useState } from "react";
import { useFetchState } from "use-fetch-state";

function MyComponent() {
  const [id, setId] = useState(1);

  const {
    loading,
    response,
    error,
    fetchData,
    setRequest,
  } = useFetchState({
    fetcher: async (request) => {
      const res = await fetch(`/api/data?id=${request.id}`);
      if (!res.ok) return false;
      return await res.json();
    },
    initialRequest: { id: 1 },
    initialResponse: null,
    reFetchChangeRequest: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = parseInt(e.target.value);
    setId(newId);
    setRequest({ id: newId });
  };

  return (
    <div>
      <input type="number" value={id} onChange={handleChange} />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
```

---

# API Reference

## Returned Values

| Name | Type | Description |
|------|------|-------------|
| `loading` | `boolean` | Indicates whether the request is in progress |
| `response` | `T \| null` | The successful API response |
| `error` | `Error \| null` | Contains error if request fails |
| `request` | `Req` | Current request parameters |
| `fetchData()` | `() => Promise<void>` | Manually triggers the request |
| `setRequest(newRequest)` | `(Req) => void` | Updates request parameters |

---

# Options

| Option | Type | Default | Description |
|--------|------|----------|-------------|
| `fetcher` | `(request: Req) => Promise<T \| false>` | required | Function responsible for API request |
| `initialRequest` | `Req` | required | Initial request parameters |
| `initialResponse` | `T \| null` | required | Initial response state |
| `waitCallback` | `boolean` | `false` | If true, skips initial execution |
| `reFetchChangeRequest` | `boolean` | `false` | Automatically re-fetch when request changes |

---

# TypeScript Example

```ts
interface User {
  id: number;
  name: string;
}

const { response } = useFetchState<{ id: number }, User>({
  fetcher: async (req) => {
    const res = await fetch(`/api/user/${req.id}`);
    return await res.json();
  },
  initialRequest: { id: 1 },
  initialResponse: null,
});
```

---

# Error Handling

If `fetcher` returns `false`, the hook will treat it as a failed request and update the `error` state.

```ts
if (!res.ok) {
  return false;
}
```

---

# When to Use

`useFetchState` is ideal when:

- You need lightweight request management
- You don't need full caching solutions like React Query
- You want a minimal abstraction over fetch logic
- You prefer full manual control

---

# License

MIT
