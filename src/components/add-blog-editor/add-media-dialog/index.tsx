import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
} from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import urlRegex from "url-regex-safe";

const schema = yup.object({
  src: yup.string().required(`This field is required`),
  alt: yup.string().required(`This field is required`),
});

interface IAddMediaDialogProps extends Omit<ModalProps, "children"> {
  title: string;
  primaryButtonHanler: (data: IAddMediaFormData) => void | Promise<void>;
}

export interface IAddMediaFormData {
  alt: string;
  src: string;
}

export default function AddMediaDialog(props: IAddMediaDialogProps) {
  const { primaryButtonHanler, title, ...others } = props;

  const { handleSubmit, control } = useForm<IAddMediaFormData>({
    defaultValues: {
      alt: "",
      src: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(() => {
    handleSubmit(async (data) => {
      await primaryButtonHanler(data);
    })();
  }, [handleSubmit, primaryButtonHanler]);

  return (
    <Modal {...others}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Controller
              control={control}
              name="alt"
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Alternative text</FormLabel>
                  <Input placeholder="Give some description" {...field} />
                  {!!error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="src"
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>URL</FormLabel>
                  <Input placeholder="https://..." {...field} />
                  {!!error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onSubmit} variant="solid" colorScheme={"blue"}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
