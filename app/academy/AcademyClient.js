"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./academy.module.css";

const STORAGE_KEY = "forex4ever_academy_progress_v1";
const QUIZ_KEY = "forex4ever_academy_quizzes_v1";

export default function AcademyClient({ courses }) {
  const [activeCourseId, setActiveCourseId] = useState(courses[0]?.id);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const activeCourse =
    courses.find((course) => course.id === activeCourseId) || courses[0];

  const activeLesson = activeCourse?.chapters[activeLessonIndex];

  const totalLessons = useMemo(
    () =>
      courses.reduce(
        (total, course) => total + course.chapters.length,
        0
      ),
    [courses]
  );

  const overallProgress =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  const getLessonId = (courseId, lessonIndex) =>
    `${courseId}-${lessonIndex}`;

  const isLessonCompleted = (courseId, lessonIndex) =>
    completedLessons.includes(getLessonId(courseId, lessonIndex));

  const courseCompletedCount = activeCourse.chapters.filter(
    (_, index) => isLessonCompleted(activeCourse.id, index)
  ).length;

  const courseProgress = Math.round(
    (courseCompletedCount / activeCourse.chapters.length) * 100
  );

  useEffect(() => {
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const savedQuizzes = JSON.parse(
        localStorage.getItem(QUIZ_KEY) || "{}"
      );

      if (Array.isArray(savedProgress)) {
        setCompletedLessons(savedProgress);
      }

      if (savedQuizzes && typeof savedQuizzes === "object") {
        setQuizResults(savedQuizzes);
      }
    } catch (error) {
      console.error("تعذر تحميل تقدم الأكاديمية:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(completedLessons)
    );
  }, [completedLessons, loaded]);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizResults));
  }, [quizResults, loaded]);

  function openCourse(courseId) {
    setActiveCourseId(courseId);
    setActiveLessonIndex(0);
    setShowQuiz(false);

    window.setTimeout(() => {
      document
        .getElementById("learning-area")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function openLesson(index) {
    setActiveLessonIndex(index);
    setShowQuiz(false);
  }

  function toggleLessonCompleted() {
    const lessonId = getLessonId(
      activeCourse.id,
      activeLessonIndex
    );

    setCompletedLessons((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId]
    );
  }

  function goToNextLesson() {
    if (activeLessonIndex < activeCourse.chapters.length - 1) {
      setActiveLessonIndex((current) => current + 1);
      setShowQuiz(false);
      return;
    }

    setShowQuiz(true);
  }

  function goToPreviousLesson() {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex((current) => current - 1);
      setShowQuiz(false);
    }
  }

  function submitQuiz() {
    const selectedAnswer = selectedAnswers[activeCourse.id];

    if (selectedAnswer === undefined) return;

    const correct = selectedAnswer === activeCourse.quiz.answer;

    setQuizResults((current) => ({
      ...current,
      [activeCourse.id]: {
        correct,
        selectedAnswer,
      },
    }));
  }

  function resetProgress() {
    const confirmed = window.confirm(
      "هل تريد حذف تقدم الأكاديمية ونتائج الاختبارات؟"
    );

    if (!confirmed) return;

    setCompletedLessons([]);
    setQuizResults({});
    setSelectedAnswers({});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(QUIZ_KEY);
  }

  return (
    <main className={styles.page} dir="rtl">
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            أكاديمية Forex4Ever المجانية
          </span>

          <h1 className={styles.heroTitle}>
            تعلّم التداول
            <span> خطوة بخطوة</span>
          </h1>

          <p className={styles.heroDescription}>
            منهج عربي تفاعلي يساعدك على فهم التداول والتحليل
            وإدارة المخاطر من خلال شروحات وأمثلة ورسومات
            واختبارات قصيرة.
          </p>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() =>
                document
                  .getElementById("courses")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ابدأ التعلّم الآن
              <span aria-hidden="true">←</span>
            </button>

            <span className={styles.freeText}>
              ✓ مجاني بالكامل ولا يحتاج إلى اشتراك مدفوع
            </span>
          </div>

          <div className={styles.stats}>
            <Stat value="6" label="دورات تعليمية" />
            <Stat value="30" label="درسًا تفاعليًا" />
            <Stat value="100%" label="محتوى عربي" />
            <Stat value="مجانًا" label="بدون رسوم" />
          </div>

          <div className={styles.overallProgress}>
            <div className={styles.progressHeader}>
              <span>تقدمك في الأكاديمية</span>
              <strong>{overallProgress}%</strong>
            </div>

            <div className={styles.progressTrack}>
              <span style={{ width: `${overallProgress}%` }} />
            </div>

            <small>
              أكملت {completedLessons.length} من {totalLessons} درسًا
            </small>
          </div>
        </div>
      </section>

      <section id="courses" className={styles.coursesSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>المنهج التعليمي</span>
            <h2>اختر الدورة التي تريد دراستها</h2>
            <p>
              ابدأ بالأساسيات ثم انتقل تدريجيًا إلى التحليل
              وإدارة المخاطر والعمل المنظم.
            </p>
          </div>

          <button
            type="button"
            className={styles.resetButton}
            onClick={resetProgress}
          >
            إعادة ضبط التقدم
          </button>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((course) => {
            const completed = course.chapters.filter((_, index) =>
              isLessonCompleted(course.id, index)
            ).length;

            const progress = Math.round(
              (completed / course.chapters.length) * 100
            );

            return (
              <article
                className={`${styles.courseCard} ${
                  activeCourse.id === course.id
                    ? styles.activeCourseCard
                    : ""
                }`}
                key={course.id}
                style={{ "--course-color": course.color }}
              >
                <div className={styles.courseTop}>
                  <span className={styles.courseNumber}>
                    {course.number}
                  </span>

                  <span className={styles.courseIcon} aria-hidden="true">
                    {course.icon}
                  </span>
                </div>

                <span className={styles.level}>{course.level}</span>

                <h3>{course.title}</h3>
                <p>{course.description}</p>

                <div className={styles.courseMeta}>
                  <span>📚 {course.chapters.length} دروس</span>
                  <span>⏱️ {course.duration}</span>
                </div>

                <div className={styles.cardProgress}>
                  <div>
                    <span>التقدم</span>
                    <strong>{progress}%</strong>
                  </div>

                  <div className={styles.progressTrack}>
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.courseButton}
                  onClick={() => openCourse(course.id)}
                >
                  {progress > 0 ? "متابعة الدورة" : "ابدأ الدورة"}
                  <span aria-hidden="true">←</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section id="learning-area" className={styles.learningSection}>
        <div className={styles.learningHeader}>
          <div
            className={styles.largeCourseIcon}
            style={{ "--course-color": activeCourse.color }}
          >
            {activeCourse.icon}
          </div>

          <div>
            <span className={styles.eyebrow}>
              الدورة رقم {activeCourse.number}
            </span>
            <h2>{activeCourse.title}</h2>
            <p>{activeCourse.description}</p>
          </div>

          <div className={styles.courseProgressCircle}>
            <strong>{courseProgress}%</strong>
            <span>مكتمل</span>
          </div>
        </div>

        <div className={styles.learningLayout}>
          <aside className={styles.lessonsSidebar}>
            <div className={styles.sidebarTitle}>
              <strong>محتويات الدورة</strong>
              <span>
                {courseCompletedCount}/{activeCourse.chapters.length}
              </span>
            </div>

            <div className={styles.lessonButtons}>
              {activeCourse.chapters.map((chapter, index) => {
                const completed = isLessonCompleted(
                  activeCourse.id,
                  index
                );

                return (
                  <button
                    type="button"
                    key={`${activeCourse.id}-${chapter.title}`}
                    onClick={() => openLesson(index)}
                    className={`${styles.lessonButton} ${
                      index === activeLessonIndex && !showQuiz
                        ? styles.activeLesson
                        : ""
                    }`}
                  >
                    <span
                      className={`${styles.lessonStatus} ${
                        completed ? styles.completedStatus : ""
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </span>

                    <span>
                      <small>الدرس {index + 1}</small>
                      <strong>{chapter.title}</strong>
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                className={`${styles.lessonButton} ${
                  showQuiz ? styles.activeLesson : ""
                }`}
                onClick={() => setShowQuiz(true)}
              >
                <span className={styles.lessonStatus}>?</span>
                <span>
                  <small>الخطوة الأخيرة</small>
                  <strong>اختبار الدورة</strong>
                </span>
              </button>
            </div>
          </aside>

          <div className={styles.lessonContent}>
            {showQuiz ? (
              <Quiz
                course={activeCourse}
                selectedAnswer={selectedAnswers[activeCourse.id]}
                result={quizResults[activeCourse.id]}
                onSelect={(answerIndex) =>
                  setSelectedAnswers((current) => ({
                    ...current,
                    [activeCourse.id]: answerIndex,
                  }))
                }
                onSubmit={submitQuiz}
                onReturn={() => setShowQuiz(false)}
              />
            ) : (
              <article
                key={`${activeCourse.id}-${activeLessonIndex}`}
                className={styles.lessonArticle}
              >
                <div className={styles.lessonLabel}>
                  الدرس {activeLessonIndex + 1} من{" "}
                  {activeCourse.chapters.length}
                </div>

                <h2>{activeLesson.title}</h2>

                <p className={styles.lessonIntro}>
                  {activeLesson.intro}
                </p>

                <Illustration
                  type={activeCourse.illustration}
                  color={activeCourse.color}
                />

                <section className={styles.contentBlock}>
                  <h3>
                    <span>📌</span>
                    النقاط الأساسية
                  </h3>

                  <ul className={styles.pointsList}>
                    {activeLesson.points.map((point, index) => (
                      <li key={point}>
                        <span>{index + 1}</span>
                        <p>{point}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className={styles.exampleBox}>
                  <div className={styles.boxIcon}>💡</div>
                  <div>
                    <h3>مثال تعليمي</h3>
                    <p>{activeLesson.example}</p>
                  </div>
                </div>

                <div className={styles.warningBox}>
                  <div className={styles.boxIcon}>⚠️</div>
                  <div>
                    <h3>انتبه</h3>
                    <p>{activeLesson.warning}</p>
                  </div>
                </div>

                <div className={styles.educationalNote}>
                  <strong>ملاحظة تعليمية</strong>
                  <p>
                    هذا المحتوى لأغراض التعليم فقط ولا يُعد توصية
                    بالشراء أو البيع. التداول ينطوي على مخاطر وقد
                    يؤدي إلى خسارة رأس المال.
                  </p>
                </div>

                <div className={styles.completionArea}>
                  <button
                    type="button"
                    className={`${
                      isLessonCompleted(
                        activeCourse.id,
                        activeLessonIndex
                      )
                        ? styles.completedButton
                        : styles.completeButton
                    }`}
                    onClick={toggleLessonCompleted}
                  >
                    {isLessonCompleted(
                      activeCourse.id,
                      activeLessonIndex
                    )
                      ? "✓ تم إكمال الدرس"
                      : "تحديد الدرس كمكتمل"}
                  </button>
                </div>

                <div className={styles.navigation}>
                  <button
                    type="button"
                    onClick={goToPreviousLesson}
                    disabled={activeLessonIndex === 0}
                  >
                    → الدرس السابق
                  </button>

                  <button
                    type="button"
                    className={styles.nextButton}
                    onClick={goToNextLesson}
                  >
                    {activeLessonIndex ===
                    activeCourse.chapters.length - 1
                      ? "انتقل إلى الاختبار"
                      : "الدرس التالي"}
                    <span>←</span>
                  </button>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div className={styles.stat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Quiz({
  course,
  selectedAnswer,
  result,
  onSelect,
  onSubmit,
  onReturn,
}) {
  return (
    <article className={styles.quiz}>
      <span className={styles.quizIcon}>🧠</span>
      <span className={styles.eyebrow}>اختبار قصير</span>

      <h2>اختبر فهمك للدورة</h2>
      <p className={styles.quizDescription}>
        اختر الإجابة الصحيحة. يمكنك إعادة المحاولة في أي وقت.
      </p>

      <div className={styles.question}>
        <h3>{course.quiz.question}</h3>

        <div className={styles.options}>
          {course.quiz.options.map((option, index) => (
            <button
              type="button"
              key={option}
              onClick={() => onSelect(index)}
              className={
                selectedAnswer === index
                  ? styles.selectedOption
                  : ""
              }
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={
            result.correct
              ? styles.correctResult
              : styles.wrongResult
          }
        >
          <strong>
            {result.correct
              ? "🎉 إجابة صحيحة"
              : "❌ الإجابة غير صحيحة"}
          </strong>
          <p>{course.quiz.explanation}</p>
        </div>
      )}

      <div className={styles.quizActions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onReturn}
        >
          العودة إلى الدروس
        </button>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={onSubmit}
          disabled={selectedAnswer === undefined}
        >
          تحقق من الإجابة
        </button>
      </div>
    </article>
  );
}

function Illustration({ type, color }) {
  return (
    <div
      className={styles.illustration}
      style={{ "--illustration-color": color }}
      aria-hidden="true"
    >
      <div className={styles.illustrationText}>
        <span>رسم توضيحي تفاعلي</span>
        <strong>
          {type === "market" && "حركة الأسواق العالمية"}
          {type === "chart" && "قراءة حركة السعر"}
          {type === "shield" && "حماية رأس المال"}
          {type === "mind" && "القرار والانضباط"}
          {type === "economy" && "دورة الاقتصاد"}
          {type === "plan" && "خطة التداول"}
        </strong>
      </div>

      <svg
        viewBox="0 0 500 230"
        role="img"
        aria-label="رسم تعليمي متحرك"
      >
        <defs>
          <linearGradient id={`gradient-${type}`} x1="0" x2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <g className={styles.gridLines}>
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="20" y1={y} x2="480" y2={y} />
          ))}
          {[80, 160, 240, 320, 400].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="210" />
          ))}
        </g>

        <path
          className={styles.areaPath}
          fill={`url(#gradient-${type})`}
          d="M20 185 L75 155 L125 168 L180 110 L235 130 L290 76 L345 98 L405 45 L480 65 L480 210 L20 210 Z"
        />

        <path
          className={styles.chartPath}
          d="M20 185 L75 155 L125 168 L180 110 L235 130 L290 76 L345 98 L405 45 L480 65"
        />

        {[
          [20, 185],
          [75, 155],
          [125, 168],
          [180, 110],
          [235, 130],
          [290, 76],
          [345, 98],
          [405, 45],
          [480, 65],
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className={styles.chartPoint}
            cx={cx}
            cy={cy}
            r={index === 7 ? "7" : "4"}
          />
        ))}
      </svg>
    </div>
  );
}
