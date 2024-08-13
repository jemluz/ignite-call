import { Button, TextInput } from '@ignite-ui/react';
import { ArrowRight } from 'phosphor-react';
import { Form } from './styles';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

const ClaimUsernameFormSchema = z.object({
  username: z.string(),
});

type ClaimUsernameFormData = z.infer<typeof ClaimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const { register, handleSubmit } = useForm<ClaimUsernameFormData>();

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data);
  }

  return (
    <Form as='form' onSubmit={handleSubmit(handleClaimUsername)}>
      <TextInput
        size='sm'
        prefix='ignite.com/'
        placeholder='seu-usuário'
        {...register('username')}
      />
      <Button size='sm' type='submit'>
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  );
}
