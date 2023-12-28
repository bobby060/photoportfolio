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
export declare type AlbumsUpdateFormInputValues = {
    title?: string;
    desc?: string;
    date?: string;
    privacy?: string;
};
export declare type AlbumsUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    desc?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    privacy?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AlbumsUpdateFormOverridesProps = {
    AlbumsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    desc?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    privacy?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AlbumsUpdateFormProps = React.PropsWithChildren<{
    overrides?: AlbumsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    albums?: any;
    onSubmit?: (fields: AlbumsUpdateFormInputValues) => AlbumsUpdateFormInputValues;
    onSuccess?: (fields: AlbumsUpdateFormInputValues) => void;
    onError?: (fields: AlbumsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AlbumsUpdateFormInputValues) => AlbumsUpdateFormInputValues;
    onValidate?: AlbumsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AlbumsUpdateForm(props: AlbumsUpdateFormProps): React.ReactElement;
