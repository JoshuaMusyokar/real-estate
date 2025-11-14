// services/noteApi.ts
import { baseApi } from "./baseApi";
import type {
  NoteResponse,
  NoteCreateRequest,
  NoteUpdateRequest,
  BaseResponse,
} from "../types";

// Response wrapper types from your API
interface NoteApiResponse {
  success: boolean;
  data: NoteResponse;
}

interface NotesApiResponse {
  success: boolean;
  data: NoteResponse[];
}

interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export const noteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create note
    createNote: builder.mutation<NoteResponse, NoteCreateRequest>({
      query: (noteData) => ({
        url: "/leads/notes",
        method: "POST",
        body: noteData,
      }),
      transformResponse: (response: NoteApiResponse) => response.data,
      invalidatesTags: ["Note", "Lead"],
    }),

    // Get notes for a lead
    getLeadNotes: builder.query<
      NoteResponse[],
      { leadId: string; includeInternal?: boolean }
    >({
      query: ({ leadId, includeInternal = true }) =>
        `/leads/notes/lead/${leadId}?includeInternal=${includeInternal}`,
      transformResponse: (response: NotesApiResponse) => response.data,
      providesTags: (result, error, { leadId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Note" as const, id })),
              { type: "Note", id: `LEAD-${leadId}` },
            ]
          : [{ type: "Note", id: `LEAD-${leadId}` }],
    }),

    // Update note
    updateNote: builder.mutation<
      NoteResponse,
      { id: string; data: NoteUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/leads/notes/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: NoteApiResponse) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: "Note", id }],
    }),

    // Delete note
    deleteNote: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/leads/notes/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: BaseApiResponse) => ({
        success: response.success,
        message: response.message!,
      }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetLeadNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;
