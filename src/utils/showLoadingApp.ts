import { store } from 'app/store';
import { SET_LOADING_APP } from 'features/apps/appsSlice';

export default function showLoadingApp(loading: boolean, title?: string) {
    store.dispatch({ type: SET_LOADING_APP.type, payload: { loading, title } });
}
