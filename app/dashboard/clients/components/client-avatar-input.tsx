'use client';

import { useRef, useState } from 'react';
import { EditIcon } from 'lucide-react';
import { createPresignedUploadAction } from '@/lib/actions/create-presigned-upload';
import { useToast } from '@/lib/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Spinner from '@/components/ui/spinner';
import { deleteFileAction } from '@/lib/actions/delete-file';
import { updateClient } from '../lib/actions/update-client';
import { Client } from '../lib/types/client.type';

export function ClientAvatarInput({ client }: { client: Client }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prevAvatar, setPrevAvatar] = useState(client.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const { data, isError, errorMessage } = await createPresignedUploadAction({
        contentType: file.type,
        folder: 'avatars',
      });

      if (isError) {
        toast({
          variant: 'destructive',
          title: 'Fehler beim Vorbereiten des Datei-Uploads.',
          description: errorMessage,
        });
      } else {
        const formData = new FormData();
        for (const key in data.fields) {
          formData.append(key, data.fields[key]);
        }
        formData.append('file', file);

        const res = await fetch(data.url, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          toast({
            variant: 'destructive',
            title: 'Fehler beim Hochladen der Datei.',
            description: 'Bitte versuchen Sie es später erneut.',
          });
        } else {
          const avatarUrl = data.url + data.fields.key;

          const updateClientRes = await updateClient(client._id, { avatar: avatarUrl });

          if (updateClientRes.isError) {
            toast({
              variant: 'destructive',
              title: 'Fehler beim Aktualisieren des Klienten-Avatars.',
              description: updateClientRes.errorMessage,
            });
          } else {
            toast({
              variant: 'default',
              title: 'Klienten-Avatar aktualisiert.',
            });

            if (prevAvatar) {
              const prevAvatarKey = ('avatars/' + prevAvatar.split('/').pop()) as string;
              const deleteRes = await deleteFileAction(prevAvatarKey);

              if (deleteRes.isSuccess) {
                setPrevAvatar(avatarUrl);
              }
            }
          }
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <Avatar
      className="h-16 w-16 cursor-pointer"
      onClick={handleAvatarClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AvatarImage src={client.avatar} alt={client.firstname} className="h-16 w-16" />
      <AvatarFallback>{client.firstname[0]}</AvatarFallback>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
          <EditIcon size={24} />
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
          <Spinner size={8} />
        </div>
      )}
    </Avatar>
  );
}
