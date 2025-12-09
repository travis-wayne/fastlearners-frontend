import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LessonsListResponse } from '@/lib/api/superadmin-lessons';
import { getUploadStats, getUploadList, UploadStats, UploadRecord } from '@/lib/api/superadmin-uploads';

export type UploadType =
  | "lessons"
  | "concepts"
  | "examples"
  | "exercises"
  | "general_exercises"
  | "check_markers"
  | "scheme_of_work";

interface UploadState {
  selectedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  success: boolean;
}

interface SuperadminState {
  // Individual Uploads
  uploadStates: Record<UploadType, UploadState>;
  setUploadState: (type: UploadType, state: Partial<UploadState> | ((prev: UploadState) => Partial<UploadState>)) => void;
  resetUploadState: (type: UploadType) => void;

  // Bulk Upload
  bulkFiles: {
    lessons_file: File | null;
    concepts_file: File | null;
    examples_file: File | null;
    exercises_file: File | null;
    general_exercises_file: File | null;
    check_markers_file: File | null;
  };
  isBulkUploading: boolean;
  bulkProgress: number;
  bulkError: string | null;
  bulkSuccess: boolean;
  setBulkFile: (field: keyof SuperadminState['bulkFiles'], file: File | null) => void;
  setBulkStatus: (status: Partial<{ isBulkUploading: boolean; bulkProgress: number; bulkError: string | null; bulkSuccess: boolean }> | ((prev: SuperadminState) => Partial<{ isBulkUploading: boolean; bulkProgress: number; bulkError: string | null; bulkSuccess: boolean }>)) => void;
  resetBulkState: () => void;

  // Upload History (not persisted)
  uploadStats: UploadStats | null;
  uploadRecords: UploadRecord[];
  uploadHistoryLoading: boolean;
  uploadHistoryError: string | null;
  setUploadHistory: (stats: UploadStats | null, records: UploadRecord[]) => void;
  setUploadHistoryLoading: (loading: boolean) => void;
  setUploadHistoryError: (error: string | null) => void;
  fetchUploadHistory: () => Promise<void>;

  // Browse Filters
  filters: {
    class: string;
    subject: string;
    term: string;
    week: string;
  };
  setFilter: (key: keyof SuperadminState['filters'], value: string) => void;
  clearFilters: () => void;
}

const initialUploadState: UploadState = {
  selectedFile: null,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  success: false,
};

const initialUploadStates: Record<UploadType, UploadState> = {
  lessons: { ...initialUploadState },
  concepts: { ...initialUploadState },
  examples: { ...initialUploadState },
  exercises: { ...initialUploadState },
  general_exercises: { ...initialUploadState },
  check_markers: { ...initialUploadState },
  scheme_of_work: { ...initialUploadState },
};

export const useSuperadminState = create<SuperadminState>()(
  persist(
    (set) => ({
      // Uploads
      uploadStates: initialUploadStates,
      setUploadState: (type, state) =>
        set((prev) => {
          const newState = typeof state === 'function' 
            ? state(prev.uploadStates[type]) 
            : state;
          return {
            uploadStates: {
              ...prev.uploadStates,
              [type]: { ...prev.uploadStates[type], ...newState },
            },
          };
        }),
      resetUploadState: (type) =>
        set((prev) => ({
          uploadStates: {
            ...prev.uploadStates,
            [type]: { ...initialUploadState },
          },
        })),

      // Bulk Upload
      bulkFiles: {
        lessons_file: null,
        concepts_file: null,
        examples_file: null,
        exercises_file: null,
        general_exercises_file: null,
        check_markers_file: null,
      },
      isBulkUploading: false,
      bulkProgress: 0,
      bulkError: null,
      bulkSuccess: false,
      setBulkFile: (field, file) =>
        set((prev) => ({
          bulkFiles: { ...prev.bulkFiles, [field]: file },
          bulkError: null,
        })),
      setBulkStatus: (status) =>
        set((prev) => {
          const newStatus = typeof status === 'function' ? status(prev) : status;
          return { ...prev, ...newStatus };
        }),
      resetBulkState: () =>
        set({
           bulkFiles: {
            lessons_file: null,
            concepts_file: null,
            examples_file: null,
            exercises_file: null,
            general_exercises_file: null,
            check_markers_file: null,
          },
          isBulkUploading: false,
          bulkProgress: 0,
          bulkError: null,
          bulkSuccess: false,
        }),

      // Upload History
      uploadStats: null,
      uploadRecords: [],
      uploadHistoryLoading: false,
      uploadHistoryError: null,
      setUploadHistory: (stats, records) =>
        set({
          uploadStats: stats,
          uploadRecords: records,
          uploadHistoryError: null,
        }),
      setUploadHistoryLoading: (loading) =>
        set({ uploadHistoryLoading: loading }),
      setUploadHistoryError: (error) =>
        set({ uploadHistoryError: error, uploadHistoryLoading: false }),
      fetchUploadHistory: async () => {
        set({ uploadHistoryLoading: true, uploadHistoryError: null });
        try {
          const [statsResponse, listResponse] = await Promise.all([
            getUploadStats(),
            getUploadList(),
          ]);

          if (statsResponse.success && listResponse.success) {
            set({
              uploadStats: statsResponse.content,
              uploadRecords: listResponse.content?.uploads || [],
              uploadHistoryLoading: false,
              uploadHistoryError: null,
            });
          } else {
            // Handle 501 or other errors gracefully
            const errorMsg = statsResponse.message || listResponse.message || "Failed to fetch upload history";
            set({
              uploadHistoryLoading: false,
              uploadHistoryError: errorMsg,
            });
          }
        } catch (error: any) {
          set({
            uploadHistoryLoading: false,
            uploadHistoryError: error.message || "An error occurred while fetching upload history",
          });
        }
      },

      // Filters
      filters: {
        class: "",
        subject: "",
        term: "",
        week: "",
      },
      setFilter: (key, value) =>
        set((prev) => ({
          filters: { ...prev.filters, [key]: value },
        })),
      clearFilters: () =>
        set({
          filters: {
            class: "",
            subject: "",
            term: "",
            week: "",
          },
        }),
    }),
    {
      name: 'superadmin-storage',
      partialize: (state) => ({ filters: state.filters }), // Only persist filters
    }
  )
);
