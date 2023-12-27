/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AlbumTagsUpdateFormInputValues = {
    title?: string;
    privacy?: string;
};
export declare type AlbumTagsUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    privacy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AlbumTagsUpdateFormOverridesProps = {
    AlbumTagsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    privacy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AlbumTagsUpdateFormProps = React.PropsWithChildren<{
    overrides?: AlbumTagsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    albumTags?: any;
    onSubmit?: (fields: AlbumTagsUpdateFormInputValues) => AlbumTagsUpdateFormInputValues;
    onSuccess?: (fields: AlbumTagsUpdateFormInputValues) => void;
    onError?: (fields: AlbumTagsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AlbumTagsUpdateFormInputValues) => AlbumTagsUpdateFormInputValues;
    onValidate?: AlbumTagsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AlbumTagsUpdateForm(props: AlbumTagsUpdateFormProps): React.ReactElement;
