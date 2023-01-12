import { useMutation } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

import { Discussion } from '../types';

export type CreateDiscussionDTO = {
  data: {
    title: string;
    body: string;
  };
};

export const createDiscussion = ({ data }: CreateDiscussionDTO): Promise<Discussion> => {
  return axios.post(`/discussions`, data);
};

type UseCreateDiscussionOptions = {
  config?: MutationConfig<typeof createDiscussion>;
};

export const useCreateDiscussion = ({ config }: UseCreateDiscussionOptions = {}) => {
  const { addNotification } = useNotificationStore();
  return useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['discussions'] });
      addNotification({
        type: 'success',
        title: 'Discussion Created',
      });
    },
    ...config,
    mutationFn: createDiscussion,
  });
};
