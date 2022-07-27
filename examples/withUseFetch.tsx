import React from 'react';
import { useFetch, API } from '../api';

const ReactAndUseFetch = () => {
    const response = useFetch(API.goodService.getSomethingGood);

    const data = response.data; // TransformedData | null
    const error = response.error; // TransformedError | null

    return (
        <div>React and useFetch example</div>
    );
};