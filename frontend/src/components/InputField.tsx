import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  bg?: string;
  label?: string;
  name: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  bg,
  label,
  textarea,
  size: _,
  ...props
}) => {
  let InputOrTextarea: any = Input;
  if (textarea) {
    InputOrTextarea = Textarea;
  }
  const [field, { error }] = useField(props);

  if (!label) {
    return (
      <InputOrTextarea
        bg={bg}
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
    );
  }

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea
        bg={bg}
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
