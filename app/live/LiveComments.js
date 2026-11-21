'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function LiveComments() {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function initializeComments() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(currentUser);

      const { data, error: loadError } = await supabase
        .from('live_comments')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(200);

      if (!mounted) return;

      if (loadError) {
        setError('تعذر تحميل التعليقات.');
        console.error(loadError);
      } else {
        setComments(data || []);
      }

      setLoading(false);
    }

    initializeComments();

    const channel = supabase
      .channel('live-comments-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_comments',
        },
        (payload) => {
          setComments((currentComments) => {
            const alreadyExists = currentComments.some(
              (comment) => comment.id === payload.new.id
            );

            if (alreadyExists) return currentComments;

            return [...currentComments, payload.new];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'live_comments',
        },
        (payload) => {
          setComments((currentComments) =>
            currentComments.filter(
              (comment) => comment.id !== payload.old.id
            )
          );
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [comments]);

  async function sendComment(event) {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!user) {
      setError('يجب تسجيل الدخول لإرسال تعليق.');
      return;
    }

    if (!cleanMessage) return;

    if (cleanMessage.length > 500) {
      setError('الحد الأقصى للتعليق هو 500 حرف.');
      return;
    }

    setSending(true);
    setError('');

    const authorName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'مستخدم';

    const { error: insertError } = await supabase
      .from('live_comments')
      .insert({
        user_id: user.id,
        author_name: authorName,
        message: cleanMessage,
      });

    if (insertError) {
      setError('تعذر إرسال التعليق. حاول مرة أخرى.');
      console.error(insertError);
    } else {
      setMessage('');
    }

    setSending(false);
  }

  async function deleteComment(commentId) {
    const confirmed = window.confirm('هل تريد حذف هذا التعليق؟');

    if (!confirmed) return;

    setError('');

    const { error: deleteError } = await supabase
      .from('live_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      setError('تعذر حذف التعليق.');
      console.error(deleteError);
    }
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  return (
    <section className="commentsBox" dir="rtl">
      <div className="commentsHeader">
        <div>
          <h2>التعليقات المباشرة</h2>
          <p>شارك بتعليقك أثناء البث</p>
        </div>

        <span className="liveBadge">مباشر</span>
      </div>

      <div className="commentsList">
        {loading && (
          <p className="statusMessage">جاري تحميل التعليقات...</p>
        )}

        {!loading && comments.length === 0 && (
          <p className="statusMessage">
            لا توجد تعليقات بعد، كن أول من يعلّق.
          </p>
        )}

        {comments.map((comment) => (
          <article className="comment" key={comment.id}>
            <div className="commentTop">
              <strong>{comment.author_name}</strong>
              <time>{formatTime(comment.created_at)}</time>
            </div>

            <p>{comment.message}</p>

            {user?.id === comment.user_id && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => deleteComment(comment.id)}
              >
                حذف
              </button>
            )}
          </article>
        ))}

        <div ref={bottomRef} />
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <form className="commentForm" onSubmit={sendComment}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="اكتب تعليقك..."
          maxLength={500}
          rows={2}
          disabled={sending}
          aria-label="اكتب تعليقك"
        />

        <div className="formBottom">
          <span>{message.length}/500</span>

          <button
            type="submit"
            disabled={sending || !message.trim()}
          >
            {sending ? 'جارٍ الإرسال...' : 'إرسال'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .commentsBox {
          width: 100%;
          background: #111318;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 16px;
          overflow: hidden;
          color: #ffffff;
        }

        .commentsHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid #292c33;
        }

        .commentsHeader h2 {
          margin: 0 0 4px;
          color: #d4af37;
          font-size: 18px;
        }

        .commentsHeader p {
          margin: 0;
          color: #aeb3bd;
          font-size: 13px;
        }

        .liveBadge {
          padding: 5px 10px;
          border-radius: 20px;
          background: #b91c1c;
          color: white;
          font-size: 12px;
        }

        .commentsList {
          height: 390px;
          overflow-y: auto;
          padding: 14px;
        }

        .comment {
          margin-bottom: 12px;
          padding: 12px;
          background: #1a1d23;
          border-radius: 10px;
          overflow-wrap: anywhere;
        }

        .commentTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
        }

        .commentTop strong {
          color: #d4af37;
          font-size: 14px;
        }

        .commentTop time {
          color: #858b96;
          font-size: 11px;
        }

        .comment p {
          margin: 0;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .deleteButton {
          margin-top: 8px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #f87171;
          cursor: pointer;
        }

        .statusMessage {
          text-align: center;
          color: #aeb3bd;
          padding: 30px 10px;
        }

        .errorMessage {
          margin: 0;
          padding: 9px 14px;
          background: rgba(185, 28, 28, 0.2);
          color: #fca5a5;
          font-size: 13px;
        }

        .commentForm {
          padding: 14px;
          border-top: 1px solid #292c33;
        }

        .commentForm textarea {
          width: 100%;
          box-sizing: border-box;
          resize: none;
          padding: 11px;
          border: 1px solid #343842;
          border-radius: 9px;
          outline: none;
          background: #090b0e;
          color: white;
          font: inherit;
        }

        .commentForm textarea:focus {
          border-color: #d4af37;
        }

        .formBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 9px;
        }

        .formBottom span {
          color: #858b96;
          font-size: 12px;
        }

        .formBottom button {
          border: 0;
          border-radius: 8px;
          padding: 9px 20px;
          background: #d4af37;
          color: #111318;
          font-weight: bold;
          cursor: pointer;
        }

        .formBottom button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        @media (max-width: 700px) {
          .commentsList {
            height: 340px;
          }
        }
      `}</style>
    </section>
  );
}
