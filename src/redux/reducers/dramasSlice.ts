import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllDramas,
  getUserDramasList,
  IDrama,
  IReview,
  getReviews,
  handleUploadReview,
  handleUpdateReview,
  handleRemoveReview,
  getActors,
  IActor,
} from '../api/dramasAPI';

export const GET_ALL_DRAMAS = createAsyncThunk(
  'dramas/getAllDramas',
  async () => {
    return await getAllDramas();
  }
);

export const GET_USER_DRAMASLIST = createAsyncThunk(
  'dramas/getUserDramasList',
  async (dramasList: string[]) => {
    return await getUserDramasList(dramasList);
  }
);

export const GET_ACTORS = createAsyncThunk(
  'dramas/getActors',
  async (dramaID: string) => {
    const actors = await getActors(dramaID);
    return actors ?? [];
  }
);

export const GET_REVIEWS = createAsyncThunk(
  'dramas/getReviews',
  async ({ dramaID, userID }: { dramaID: string; userID: string }) => {
    return await getReviews(dramaID, userID);
  }
);

export const UPLOAD_REVIEW = createAsyncThunk(
  'reviews/uploadReview',
  async ({
    dramaID,
    userID,
    userRating,
    writtenReview,
  }: {
    dramaID: string;
    userID: string;
    userRating: number;
    writtenReview: string | undefined;
  }) => await handleUploadReview(dramaID, userID, userRating, writtenReview)
);

export const UPDATE_REVIEW = createAsyncThunk(
  'dramas/updateReview',
  async ({
    dramaID,
    userID,
    userRating,
    updatedUserReview,
  }: {
    dramaID: string;
    userID: string;
    userRating: number;
    updatedUserReview: string | undefined;
  }) => {
    await handleUpdateReview(dramaID, userID, userRating, updatedUserReview);
  }
);

export const REMOVE_REVIEW = createAsyncThunk(
  'dramas/removeReview',
  async ({ dramaID, userID }: { dramaID: string; userID: string }) => {
    await handleRemoveReview(dramaID, userID);
  }
);

interface DramasState {
  dramas: IDrama[];
  userDramasList: IDrama[];
  actors: IActor[];
  reviewsArr: IReview[];
  otherUserReviewsArr: IReview[];
  userReview: IReview;
  loading: boolean;
  error: string | null;
}

const initialState: DramasState = {
  dramas: [] as IDrama[],
  userDramasList: [] as IDrama[],
  actors: [] as IActor[],
  reviewsArr: [] as IReview[],
  otherUserReviewsArr: [] as IReview[],
  userReview: {} as IReview,
  loading: false,
  error: null,
};

const dramasSlice = createSlice({
  name: 'dramas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GET_ALL_DRAMAS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GET_ALL_DRAMAS.fulfilled, (state, action) => {
        state.loading = false;
        state.dramas = action.payload;
      })
      .addCase(GET_ALL_DRAMAS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(GET_USER_DRAMASLIST.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GET_USER_DRAMASLIST.fulfilled, (state, action) => {
        state.loading = false;
        state.userDramasList = action.payload as IDrama[];
      })
      .addCase(GET_USER_DRAMASLIST.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(GET_ACTORS.fulfilled, (state, action) => {
        state.loading = false;
        state.actors = action.payload;
      })
      .addCase(GET_ACTORS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(GET_REVIEWS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GET_REVIEWS.fulfilled, (state, action) => {
        state.loading = false;
        const { reviewsArr, otherUserReviewsArr, userReview } =
          action.payload || {};
        if (reviewsArr && otherUserReviewsArr && userReview) {
          state.reviewsArr = reviewsArr;
          state.otherUserReviewsArr = otherUserReviewsArr;
          state.userReview = userReview;
        }
      })
      .addCase(GET_REVIEWS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(UPLOAD_REVIEW.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UPLOAD_REVIEW.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(UPDATE_REVIEW.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UPDATE_REVIEW.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(REMOVE_REVIEW.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(REMOVE_REVIEW.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const {} = dramasSlice.actions;
export default dramasSlice.reducer;
