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
export declare type UrlCreateFormInputValues = {};
export declare type UrlCreateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UrlCreateFormOverridesProps = {
    UrlCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type UrlCreateFormProps = React.PropsWithChildren<{
    overrides?: UrlCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UrlCreateFormInputValues) => UrlCreateFormInputValues;
    onSuccess?: (fields: UrlCreateFormInputValues) => void;
    onError?: (fields: UrlCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UrlCreateFormInputValues) => UrlCreateFormInputValues;
    onValidate?: UrlCreateFormValidationValues;
} & React.CSSProperties>;
export default function UrlCreateForm(props: UrlCreateFormProps): React.ReactElement;
