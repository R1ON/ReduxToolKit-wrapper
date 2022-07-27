import { useCallback, useEffect, useRef, useState } from 'react';

import { isSSR } from './isSSR';
import { ResponseStatus } from '../constants';

import DeferredPromise from './DeferredPromise';
import type { Service, ErrorServiceData, CorrectValue } from '../utils/get-async-thunk';
import { useHttpApiServiceContext } from '../utils/create-http-api-service';

import { useFetchContext } from './context';
import type { ResponseSuccessPayload } from '../utils/default-response-adapter';

// ---

export const USE_FETCH_EMIT_KEY = 'add-use-fetch-deferred-promise';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type PayloadData = CorrectValue | undefined | void;
type State<T> = {
  data: Extract<Awaited<T>, ResponseSuccessPayload<Any>>['data'] | null;
  loading: boolean;
  requested: boolean;
  error: ErrorServiceData<T> | null;
};

const INITIAL_STATE = {
  data: null,
  error: null,
  loading: false,
  requested: false,
};

/*
* uniqKey - ключ, по которому во время SSR данные будут переданы на клиент.
* Если не установить этот ключ, то запрос во время SSR не будет сделан.
* Это может пригодиться, если вы грузите данные не по событию willMount.
* */
const useFetch = <Response extends Promise<Any>, Payload extends PayloadData = void>(
  service: Service<Response, Payload>,
  uniqKey: string | null = null,
): State<Response> & { makeRequest: (payload: Payload) => void } => {
  const apiService = useHttpApiServiceContext();

  type ContextData = Awaited<ReturnType<typeof service>>;
  const hasUniqKey = uniqKey !== null;

  const keyWithServiceName = hasUniqKey ? `${uniqKey}_${service.name}` : null;
  const context = useFetchContext<ContextData>(keyWithServiceName);

  if (hasUniqKey && uniqKey === service.name) {
    console.warn(`Не используйте название сервиса (${uniqKey}) в качестве uniqKey`);
  }

  const [state, setState] = useState<State<Response>>(getInitialState(context));
  const controller = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  const makeRequest = useCallback((payload: Payload) => {
    if (!hasUniqKey && isSSR) {
      return;
    }

    setState((currentState) => ({ ...currentState, loading: true, requested: false, error: null }));

    if (!isSSR) {
      controller.current = new AbortController();
    }

    const instance = apiService(controller.current?.signal);

    const serviceConfig = { instance };

    type DeferredPromiseData = { useFetchId: typeof keyWithServiceName } & ContextData;
    const deferredPromise = new DeferredPromise<DeferredPromiseData>();

    if (isSSR) {
      // you can add process listener when your SSR is working,
      // and wait this promise, before render page
      process.emit('message', USE_FETCH_EMIT_KEY, deferredPromise.promise);
    }

    service(serviceConfig, payload).then((response) => {
      controller.current = null;

      if (!isMounted.current) {
        return;
      }

      const promiseData = { useFetchId: keyWithServiceName, ...response };

      switch (response.status) {
        case ResponseStatus.CANCEL_REQUEST:
          deferredPromise.reject(promiseData);
          return;

        case ResponseStatus.SUCCESS:
          deferredPromise.resolve(promiseData);
          return setState((currentState) => ({
            ...currentState,
            data: response.data,
            loading: false,
            requested: true,
          }));

        default:
          deferredPromise.reject(promiseData);
          setState((currentState) => ({
            ...currentState,
            error: response,
            loading: false,
            requested: true,
          }));
      }
    });
  }, []);

  useEffect(() => () => {
    isMounted.current = false;
    controller.current?.abort();
  }, []);

  return { ...state, makeRequest };
};


function getInitialState<Response extends Promise<Any>, Payload extends PayloadData = void>(
  context: Awaited<ReturnType<Service<Response, Payload>>> | null,
) {
  if (!context) {
    return INITIAL_STATE;
  }

  if (context.status !== ResponseStatus.SUCCESS) {
    return {
      ...INITIAL_STATE,
      error: context,
      requested: true,
    };
  }

  return {
    ...INITIAL_STATE,
    data: context.data,
    requested: true,
  };
}

export default useFetch;
