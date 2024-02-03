/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
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
export declare type UrlUpdateFormInputValues = {};
export declare type UrlUpdateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UrlUpdateFormOverridesProps = {
    UrlUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type UrlUpdateFormProps = React.PropsWithChildren<{
    overrides?: UrlUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    url?: any;
    onSubmit?: (fields: UrlUpdateFormInputValues) => UrlUpdateFormInputValues;
    onSuccess?: (fields: UrlUpdateFormInputValues) => void;
    onError?: (fields: UrlUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UrlUpdateFormInputValues) => UrlUpdateFormInputValues;
    onValidate?: UrlUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UrlUpdateForm(props: UrlUpdateFormProps): React.ReactElement;
