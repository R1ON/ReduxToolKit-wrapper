Wrapper for createAsyncThunk to pass axios instance with auth token.
And custom useFetch hook (if you don't have to use RTK slice).

It's not a library. Just wrapper, with good (maybe) typescript.

1. Create your api service in api/service/ (example in api/service/good-service folder)
2. Import your service in api/index.ts and export it
3. Use it through useFetch hook or getAsyncThunk (is you have to work with RTK)
