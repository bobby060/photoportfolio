/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AlbumsCreateFormInputValues = {
    title?: string;
    desc?: string;
    date?: string;
};
export declare type AlbumsCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    desc?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AlbumsCreateFormOverridesProps = {
    AlbumsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    desc?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AlbumsCreateFormProps = React.PropsWithChildren<{
    overrides?: AlbumsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AlbumsCreateFormInputValues) => AlbumsCreateFormInputValues;
    onSuccess?: (fields: AlbumsCreateFormInputValues) => void;
    onError?: (fields: AlbumsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AlbumsCreateFormInputValues) => AlbumsCreateFormInputValues;
    onValidate?: AlbumsCreateFormValidationValues;
} & React.CSSProperties>;
export default function AlbumsCreateForm(props: AlbumsCreateFormProps): React.ReactElement;
