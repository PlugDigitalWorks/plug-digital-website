'use client';

import { useState } from 'react';
import Modal from '@/components/tools/Modal'; // senin modal bileşenin varsa bunu kullan
import { toast } from 'react-toastify';

interface CommentModalProps {
  show: boolean;
  onClose: () => void;
  entityId: string;
  entityType: 'BLOG' | 'SERVICE' | 'REFERENCE';
}

export const CommentModal: React.FC<CommentModalProps> = ({
  show,
  onClose,
  entityId,
  entityType,
}) => {
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return toast.warning('Yorum içeriği boş olamaz!');

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityId,
          entityType,
          userName: userName || undefined,
          content,
        }),
      });

      if (!response.ok) throw new Error('Yorum gönderilemedi.');

      toast.success('Yorum başarıyla gönderildi. Onaylanmayı bekliyor.');
      setContent('');
      setUserName('');
      onClose(); // Modal'ı kapat
    } catch (err) {
      toast.error('Yorum gönderilirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Adınız (isteğe bağlı)"
          className="w-full rounded border px-3 py-2 text-sm"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <textarea
          rows={5}
          placeholder="Yorumunuz..."
          className="w-full rounded border px-3 py-2 text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
