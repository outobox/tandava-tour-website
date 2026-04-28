import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminLoginRequest, AdminSession, DashboardStats, ErrorEnvelope, GalleryImage, GalleryImageInput, HealthStatus, InstagramPost, InstagramPostInput, ListInstagramPostsParams, ListPackagesParams, ListVehiclesParams, Package, PackageInput, Review, ReviewInput, Settings, SettingsInput, UploadUrlRequest, UploadUrlResponse, Vehicle, VehicleInput } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Request a presigned URL for file upload
 */
export declare const getRequestUploadUrlUrl: () => string;
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: RequestInit) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Request a presigned URL for file upload
 */
export declare const useRequestUploadUrl: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
/**
 * @summary Serve a public asset from PUBLIC_OBJECT_SEARCH_PATHS
 */
export declare const getGetPublicObjectUrl: (filePath: string) => string;
export declare const getPublicObject: (filePath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetPublicObjectQueryKey: (filePath: string) => readonly [`/api/storage/public-objects/${string}`];
export declare const getGetPublicObjectQueryOptions: <TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicObject>>>;
export type GetPublicObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve a public asset from PUBLIC_OBJECT_SEARCH_PATHS
 */
export declare function useGetPublicObject<TData = Awaited<ReturnType<typeof getPublicObject>>, TError = ErrorType<ErrorEnvelope>>(filePath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Serve an object entity from PRIVATE_OBJECT_DIR
 */
export declare const getGetStorageObjectUrl: (objectPath: string) => string;
export declare const getStorageObject: (objectPath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetStorageObjectQueryKey: (objectPath: string) => readonly [`/api/storage/objects/${string}`];
export declare const getGetStorageObjectQueryOptions: <TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStorageObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageObject>>>;
export type GetStorageObjectQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Serve an object entity from PRIVATE_OBJECT_DIR
 */
export declare function useGetStorageObject<TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<ErrorEnvelope>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List active tour packages
 */
export declare const getListPackagesUrl: (params?: ListPackagesParams) => string;
export declare const listPackages: (params?: ListPackagesParams, options?: RequestInit) => Promise<Package[]>;
export declare const getListPackagesQueryKey: (params?: ListPackagesParams) => readonly ["/api/packages", ...ListPackagesParams[]];
export declare const getListPackagesQueryOptions: <TData = Awaited<ReturnType<typeof listPackages>>, TError = ErrorType<unknown>>(params?: ListPackagesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPackagesQueryResult = NonNullable<Awaited<ReturnType<typeof listPackages>>>;
export type ListPackagesQueryError = ErrorType<unknown>;
/**
 * @summary List active tour packages
 */
export declare function useListPackages<TData = Awaited<ReturnType<typeof listPackages>>, TError = ErrorType<unknown>>(params?: ListPackagesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a tour package (admin)
 */
export declare const getCreatePackageUrl: () => string;
export declare const createPackage: (packageInput: PackageInput, options?: RequestInit) => Promise<Package>;
export declare const getCreatePackageMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPackage>>, TError, {
        data: BodyType<PackageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPackage>>, TError, {
    data: BodyType<PackageInput>;
}, TContext>;
export type CreatePackageMutationResult = NonNullable<Awaited<ReturnType<typeof createPackage>>>;
export type CreatePackageMutationBody = BodyType<PackageInput>;
export type CreatePackageMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Create a tour package (admin)
 */
export declare const useCreatePackage: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPackage>>, TError, {
        data: BodyType<PackageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPackage>>, TError, {
    data: BodyType<PackageInput>;
}, TContext>;
/**
 * @summary Update a tour package (admin)
 */
export declare const getUpdatePackageUrl: (id: number) => string;
export declare const updatePackage: (id: number, packageInput: PackageInput, options?: RequestInit) => Promise<Package>;
export declare const getUpdatePackageMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePackage>>, TError, {
        id: number;
        data: BodyType<PackageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePackage>>, TError, {
    id: number;
    data: BodyType<PackageInput>;
}, TContext>;
export type UpdatePackageMutationResult = NonNullable<Awaited<ReturnType<typeof updatePackage>>>;
export type UpdatePackageMutationBody = BodyType<PackageInput>;
export type UpdatePackageMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Update a tour package (admin)
 */
export declare const useUpdatePackage: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePackage>>, TError, {
        id: number;
        data: BodyType<PackageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePackage>>, TError, {
    id: number;
    data: BodyType<PackageInput>;
}, TContext>;
/**
 * @summary Delete a tour package (admin)
 */
export declare const getDeletePackageUrl: (id: number) => string;
export declare const deletePackage: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeletePackageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePackage>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePackage>>, TError, {
    id: number;
}, TContext>;
export type DeletePackageMutationResult = NonNullable<Awaited<ReturnType<typeof deletePackage>>>;
export type DeletePackageMutationError = ErrorType<unknown>;
/**
 * @summary Delete a tour package (admin)
 */
export declare const useDeletePackage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePackage>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePackage>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List vehicles
 */
export declare const getListVehiclesUrl: (params?: ListVehiclesParams) => string;
export declare const listVehicles: (params?: ListVehiclesParams, options?: RequestInit) => Promise<Vehicle[]>;
export declare const getListVehiclesQueryKey: (params?: ListVehiclesParams) => readonly ["/api/vehicles", ...ListVehiclesParams[]];
export declare const getListVehiclesQueryOptions: <TData = Awaited<ReturnType<typeof listVehicles>>, TError = ErrorType<unknown>>(params?: ListVehiclesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVehicles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listVehicles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListVehiclesQueryResult = NonNullable<Awaited<ReturnType<typeof listVehicles>>>;
export type ListVehiclesQueryError = ErrorType<unknown>;
/**
 * @summary List vehicles
 */
export declare function useListVehicles<TData = Awaited<ReturnType<typeof listVehicles>>, TError = ErrorType<unknown>>(params?: ListVehiclesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVehicles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a vehicle (admin)
 */
export declare const getCreateVehicleUrl: () => string;
export declare const createVehicle: (vehicleInput: VehicleInput, options?: RequestInit) => Promise<Vehicle>;
export declare const getCreateVehicleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createVehicle>>, TError, {
        data: BodyType<VehicleInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createVehicle>>, TError, {
    data: BodyType<VehicleInput>;
}, TContext>;
export type CreateVehicleMutationResult = NonNullable<Awaited<ReturnType<typeof createVehicle>>>;
export type CreateVehicleMutationBody = BodyType<VehicleInput>;
export type CreateVehicleMutationError = ErrorType<unknown>;
/**
 * @summary Create a vehicle (admin)
 */
export declare const useCreateVehicle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createVehicle>>, TError, {
        data: BodyType<VehicleInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createVehicle>>, TError, {
    data: BodyType<VehicleInput>;
}, TContext>;
/**
 * @summary Update a vehicle (admin)
 */
export declare const getUpdateVehicleUrl: (id: number) => string;
export declare const updateVehicle: (id: number, vehicleInput: VehicleInput, options?: RequestInit) => Promise<Vehicle>;
export declare const getUpdateVehicleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateVehicle>>, TError, {
        id: number;
        data: BodyType<VehicleInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateVehicle>>, TError, {
    id: number;
    data: BodyType<VehicleInput>;
}, TContext>;
export type UpdateVehicleMutationResult = NonNullable<Awaited<ReturnType<typeof updateVehicle>>>;
export type UpdateVehicleMutationBody = BodyType<VehicleInput>;
export type UpdateVehicleMutationError = ErrorType<unknown>;
/**
 * @summary Update a vehicle (admin)
 */
export declare const useUpdateVehicle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateVehicle>>, TError, {
        id: number;
        data: BodyType<VehicleInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateVehicle>>, TError, {
    id: number;
    data: BodyType<VehicleInput>;
}, TContext>;
/**
 * @summary Delete a vehicle (admin)
 */
export declare const getDeleteVehicleUrl: (id: number) => string;
export declare const deleteVehicle: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteVehicleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteVehicle>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteVehicle>>, TError, {
    id: number;
}, TContext>;
export type DeleteVehicleMutationResult = NonNullable<Awaited<ReturnType<typeof deleteVehicle>>>;
export type DeleteVehicleMutationError = ErrorType<unknown>;
/**
 * @summary Delete a vehicle (admin)
 */
export declare const useDeleteVehicle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteVehicle>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteVehicle>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List gallery images
 */
export declare const getListGalleryImagesUrl: () => string;
export declare const listGalleryImages: (options?: RequestInit) => Promise<GalleryImage[]>;
export declare const getListGalleryImagesQueryKey: () => readonly ["/api/gallery"];
export declare const getListGalleryImagesQueryOptions: <TData = Awaited<ReturnType<typeof listGalleryImages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGalleryImages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGalleryImages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGalleryImagesQueryResult = NonNullable<Awaited<ReturnType<typeof listGalleryImages>>>;
export type ListGalleryImagesQueryError = ErrorType<unknown>;
/**
 * @summary List gallery images
 */
export declare function useListGalleryImages<TData = Awaited<ReturnType<typeof listGalleryImages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGalleryImages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add gallery image (admin)
 */
export declare const getCreateGalleryImageUrl: () => string;
export declare const createGalleryImage: (galleryImageInput: GalleryImageInput, options?: RequestInit) => Promise<GalleryImage>;
export declare const getCreateGalleryImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
        data: BodyType<GalleryImageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
    data: BodyType<GalleryImageInput>;
}, TContext>;
export type CreateGalleryImageMutationResult = NonNullable<Awaited<ReturnType<typeof createGalleryImage>>>;
export type CreateGalleryImageMutationBody = BodyType<GalleryImageInput>;
export type CreateGalleryImageMutationError = ErrorType<unknown>;
/**
 * @summary Add gallery image (admin)
 */
export declare const useCreateGalleryImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
        data: BodyType<GalleryImageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
    data: BodyType<GalleryImageInput>;
}, TContext>;
/**
 * @summary Delete gallery image (admin)
 */
export declare const getDeleteGalleryImageUrl: (id: number) => string;
export declare const deleteGalleryImage: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteGalleryImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
    id: number;
}, TContext>;
export type DeleteGalleryImageMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGalleryImage>>>;
export type DeleteGalleryImageMutationError = ErrorType<unknown>;
/**
 * @summary Delete gallery image (admin)
 */
export declare const useDeleteGalleryImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List published reviews
 */
export declare const getListReviewsUrl: () => string;
export declare const listReviews: (options?: RequestInit) => Promise<Review[]>;
export declare const getListReviewsQueryKey: () => readonly ["/api/reviews"];
export declare const getListReviewsQueryOptions: <TData = Awaited<ReturnType<typeof listReviews>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listReviews>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListReviewsQueryResult = NonNullable<Awaited<ReturnType<typeof listReviews>>>;
export type ListReviewsQueryError = ErrorType<unknown>;
/**
 * @summary List published reviews
 */
export declare function useListReviews<TData = Awaited<ReturnType<typeof listReviews>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create review (admin)
 */
export declare const getCreateReviewUrl: () => string;
export declare const createReview: (reviewInput: ReviewInput, options?: RequestInit) => Promise<Review>;
export declare const getCreateReviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, {
        data: BodyType<ReviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, {
    data: BodyType<ReviewInput>;
}, TContext>;
export type CreateReviewMutationResult = NonNullable<Awaited<ReturnType<typeof createReview>>>;
export type CreateReviewMutationBody = BodyType<ReviewInput>;
export type CreateReviewMutationError = ErrorType<unknown>;
/**
 * @summary Create review (admin)
 */
export declare const useCreateReview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createReview>>, TError, {
        data: BodyType<ReviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createReview>>, TError, {
    data: BodyType<ReviewInput>;
}, TContext>;
/**
 * @summary Update review (admin)
 */
export declare const getUpdateReviewUrl: (id: number) => string;
export declare const updateReview: (id: number, reviewInput: ReviewInput, options?: RequestInit) => Promise<Review>;
export declare const getUpdateReviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateReview>>, TError, {
        id: number;
        data: BodyType<ReviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateReview>>, TError, {
    id: number;
    data: BodyType<ReviewInput>;
}, TContext>;
export type UpdateReviewMutationResult = NonNullable<Awaited<ReturnType<typeof updateReview>>>;
export type UpdateReviewMutationBody = BodyType<ReviewInput>;
export type UpdateReviewMutationError = ErrorType<unknown>;
/**
 * @summary Update review (admin)
 */
export declare const useUpdateReview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateReview>>, TError, {
        id: number;
        data: BodyType<ReviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateReview>>, TError, {
    id: number;
    data: BodyType<ReviewInput>;
}, TContext>;
/**
 * @summary Delete review (admin)
 */
export declare const getDeleteReviewUrl: (id: number) => string;
export declare const deleteReview: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteReviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteReview>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteReview>>, TError, {
    id: number;
}, TContext>;
export type DeleteReviewMutationResult = NonNullable<Awaited<ReturnType<typeof deleteReview>>>;
export type DeleteReviewMutationError = ErrorType<unknown>;
/**
 * @summary Delete review (admin)
 */
export declare const useDeleteReview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteReview>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteReview>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get site settings
 */
export declare const getGetSettingsUrl: () => string;
export declare const getSettings: (options?: RequestInit) => Promise<Settings>;
export declare const getGetSettingsQueryKey: () => readonly ["/api/settings"];
export declare const getGetSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>;
export type GetSettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get site settings
 */
export declare function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update site settings (admin)
 */
export declare const getUpdateSettingsUrl: () => string;
export declare const updateSettings: (settingsInput: SettingsInput, options?: RequestInit) => Promise<Settings>;
export declare const getUpdateSettingsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<SettingsInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<SettingsInput>;
}, TContext>;
export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>;
export type UpdateSettingsMutationBody = BodyType<SettingsInput>;
export type UpdateSettingsMutationError = ErrorType<unknown>;
/**
 * @summary Update site settings (admin)
 */
export declare const useUpdateSettings: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<SettingsInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<SettingsInput>;
}, TContext>;
/**
 * @summary List Instagram posts displayed on the public site
 */
export declare const getListInstagramPostsUrl: (params?: ListInstagramPostsParams) => string;
export declare const listInstagramPosts: (params?: ListInstagramPostsParams, options?: RequestInit) => Promise<InstagramPost[]>;
export declare const getListInstagramPostsQueryKey: (params?: ListInstagramPostsParams) => readonly ["/api/instagram-posts", ...ListInstagramPostsParams[]];
export declare const getListInstagramPostsQueryOptions: <TData = Awaited<ReturnType<typeof listInstagramPosts>>, TError = ErrorType<unknown>>(params?: ListInstagramPostsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInstagramPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listInstagramPosts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListInstagramPostsQueryResult = NonNullable<Awaited<ReturnType<typeof listInstagramPosts>>>;
export type ListInstagramPostsQueryError = ErrorType<unknown>;
/**
 * @summary List Instagram posts displayed on the public site
 */
export declare function useListInstagramPosts<TData = Awaited<ReturnType<typeof listInstagramPosts>>, TError = ErrorType<unknown>>(params?: ListInstagramPostsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInstagramPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create an Instagram post (admin)
 */
export declare const getCreateInstagramPostUrl: () => string;
export declare const createInstagramPost: (instagramPostInput: InstagramPostInput, options?: RequestInit) => Promise<InstagramPost>;
export declare const getCreateInstagramPostMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInstagramPost>>, TError, {
        data: BodyType<InstagramPostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createInstagramPost>>, TError, {
    data: BodyType<InstagramPostInput>;
}, TContext>;
export type CreateInstagramPostMutationResult = NonNullable<Awaited<ReturnType<typeof createInstagramPost>>>;
export type CreateInstagramPostMutationBody = BodyType<InstagramPostInput>;
export type CreateInstagramPostMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Create an Instagram post (admin)
 */
export declare const useCreateInstagramPost: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createInstagramPost>>, TError, {
        data: BodyType<InstagramPostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createInstagramPost>>, TError, {
    data: BodyType<InstagramPostInput>;
}, TContext>;
/**
 * @summary Update an Instagram post (admin)
 */
export declare const getUpdateInstagramPostUrl: (id: number) => string;
export declare const updateInstagramPost: (id: number, instagramPostInput: InstagramPostInput, options?: RequestInit) => Promise<InstagramPost>;
export declare const getUpdateInstagramPostMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInstagramPost>>, TError, {
        id: number;
        data: BodyType<InstagramPostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateInstagramPost>>, TError, {
    id: number;
    data: BodyType<InstagramPostInput>;
}, TContext>;
export type UpdateInstagramPostMutationResult = NonNullable<Awaited<ReturnType<typeof updateInstagramPost>>>;
export type UpdateInstagramPostMutationBody = BodyType<InstagramPostInput>;
export type UpdateInstagramPostMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Update an Instagram post (admin)
 */
export declare const useUpdateInstagramPost: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInstagramPost>>, TError, {
        id: number;
        data: BodyType<InstagramPostInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateInstagramPost>>, TError, {
    id: number;
    data: BodyType<InstagramPostInput>;
}, TContext>;
/**
 * @summary Delete an Instagram post (admin)
 */
export declare const getDeleteInstagramPostUrl: (id: number) => string;
export declare const deleteInstagramPost: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteInstagramPostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInstagramPost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteInstagramPost>>, TError, {
    id: number;
}, TContext>;
export type DeleteInstagramPostMutationResult = NonNullable<Awaited<ReturnType<typeof deleteInstagramPost>>>;
export type DeleteInstagramPostMutationError = ErrorType<unknown>;
/**
 * @summary Delete an Instagram post (admin)
 */
export declare const useDeleteInstagramPost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInstagramPost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteInstagramPost>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Admin login
 */
export declare const getAdminLoginUrl: () => string;
export declare const adminLogin: (adminLoginRequest: AdminLoginRequest, options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginRequest>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginRequest>;
export type AdminLoginMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Admin login
 */
export declare const useAdminLogin: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginRequest>;
}, TContext>;
/**
 * @summary Admin logout
 */
export declare const getAdminLogoutUrl: () => string;
export declare const adminLogout: (options?: RequestInit) => Promise<void>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
 * @summary Admin logout
 */
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
/**
 * @summary Get current admin session
 */
export declare const getAdminMeUrl: () => string;
export declare const adminMe: (options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminMeQueryKey: () => readonly ["/api/admin/me"];
export declare const getAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof adminMe>>>;
export type AdminMeQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Get current admin session
 */
export declare function useAdminMe<TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Aggregate stats for the admin dashboard
 */
export declare const getAdminDashboardStatsUrl: () => string;
export declare const adminDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getAdminDashboardStatsQueryKey: () => readonly ["/api/admin/dashboard-stats"];
export declare const getAdminDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof adminDashboardStats>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof adminDashboardStats>>>;
export type AdminDashboardStatsQueryError = ErrorType<ErrorEnvelope>;
/**
 * @summary Aggregate stats for the admin dashboard
 */
export declare function useAdminDashboardStats<TData = Awaited<ReturnType<typeof adminDashboardStats>>, TError = ErrorType<ErrorEnvelope>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map