import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Image } from 'src/app/interfaces/image';
import { Action, createReducer, on } from '@ngrx/store';
import { ADD_SCREENSHOT, ADD_SCREENSHOTS, DELETE_SCREENSHOT } from 'src/app/store/images.actions';

export interface ImagesState extends EntityState<Image> {
}

const imagesAdapter = createEntityAdapter<Image>();
const initialImagesState = imagesAdapter.getInitialState();

const reducer = createReducer(
    initialImagesState,
    on(ADD_SCREENSHOT, (state, { image }) => {
        return imagesAdapter.addOne(image, state);
    }),
    on(ADD_SCREENSHOTS, (state, { images }) => {
        return imagesAdapter.addMany(images, state);
    }),
    on(DELETE_SCREENSHOT, (state, { id }) => {
        return imagesAdapter.removeOne(id, state);
    })
);

export function imagesReducer(state: ImagesState, action: Action): ImagesState {
    return reducer(state, action);
}

export const { selectAll, selectTotal } = imagesAdapter.getSelectors();
