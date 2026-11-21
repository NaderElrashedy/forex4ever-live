"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LivePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const channelId =
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ||
    "UCax4ecpWB01uD8DnN8tOiQA";

  const videoId = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID;

  const videoUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&rel=0`;

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setChecking(false);
    }

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) router.replace("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <section className="status-page">
        <div className="loader" />
        <p>جارٍ التحقق من الحساب...</p>
      </section>
    );
  }

  return (
    <section className="live-page container">
      <div className="live-heading">
        <div>
          <span className="live-badge"><i /> بث مباشر</span>
          <h1>بث Forex4Ever</h1>
          <p>مرحبًا، {user?.email}</p>
        </div>
      </div>

      <div className="video-wrapper">
        <iframe
          src={videoUrl}
          title="Forex4Ever Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="broadcast-note">
        <strong>📺 حالة البث</strong>
        <p>
          إذا لم يكن هناك بث عام يعمل حاليًا، سيعرض YouTube رسالة أن الفيديو
          غير متاح. ستظهر الصورة تلقائيًا عند بدء البث العام من القناة.
        </p>
      </div>
    </section>
  );
}
