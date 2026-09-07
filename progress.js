/* =========================================
   مجال | نظام حفظ التقدم
   ========================================= */

const MajalProgress = {

  // إنشاء مفتاح خاص بكل درس
  lessonKey(field, level, lesson) {
    return `${field}_${level}_lesson_${lesson}`;
  },

  // إنشاء مفتاح خاص بالاختبار
  testKey(field, level) {
    return `${field}_${level}_test`;
  },


  // هل الدرس مكتمل؟
  isLessonCompleted(field, level, lesson) {
    return localStorage.getItem(
      this.lessonKey(field, level, lesson)
    ) === "completed";
  },


  // تسجيل الدرس كمكتمل
  completeLesson(field, level, lesson) {
    localStorage.setItem(
      this.lessonKey(field, level, lesson),
      "completed"
    );
  },


  // هل الاختبار مكتمل؟
  isTestCompleted(field, level) {
    return localStorage.getItem(
      this.testKey(field, level)
    ) === "completed";
  },


  // تسجيل الاختبار كمكتمل
  completeTest(field, level, score = null) {

    localStorage.setItem(
      this.testKey(field, level),
      "completed"
    );

    // حفظ النقطة إذا كانت موجودة
    if (score !== null) {
      localStorage.setItem(
        `${field}_${level}_test_score`,
        score
      );
    }
  },


  // جلب نقطة الاختبار
  getTestScore(field, level) {
    return localStorage.getItem(
      `${field}_${level}_test_score`
    );
  },


  // حساب عدد الدروس المكتملة
  getCompletedLessons(
    field,
    level,
    totalLessons = 5
  ) {

    let completed = 0;

    for (let i = 1; i <= totalLessons; i++) {

      if (
        this.isLessonCompleted(
          field,
          level,
          i
        )
      ) {
        completed++;
      }

    }

    return completed;
  },


  // حساب نسبة التقدم
  getLessonProgress(
    field,
    level,
    totalLessons = 5
  ) {

    const completed =
      this.getCompletedLessons(
        field,
        level,
        totalLessons
      );

    return Math.round(
      (completed / totalLessons) * 100
    );
  },


  // هل جميع الدروس مكتملة؟
  areAllLessonsCompleted(
    field,
    level,
    totalLessons = 5
  ) {

    return (
      this.getCompletedLessons(
        field,
        level,
        totalLessons
      ) === totalLessons
    );
  },


  // هل يمكن فتح الدرس؟
  canOpenLesson(
    field,
    level,
    lesson
  ) {

    // إذا كان مكتمل يمكن إعادة فتحه
    if (
      this.isLessonCompleted(
        field,
        level,
        lesson
      )
    ) {
      return true;
    }

    // الدرس الأول مفتوح
    if (lesson === 1) {
      return true;
    }

    // باقي الدروس تحتاج إكمال الدرس السابق
    return this.isLessonCompleted(
      field,
      level,
      lesson - 1
    );
  },


  // هل يمكن فتح الاختبار؟
  canOpenTest(
    field,
    level,
    totalLessons = 5
  ) {

    return this.areAllLessonsCompleted(
      field,
      level,
      totalLessons
    );
  },


  // إعادة مستوى كامل
  resetLevel(
    field,
    level,
    totalLessons = 5
  ) {

    for (let i = 1; i <= totalLessons; i++) {

      localStorage.removeItem(
        this.lessonKey(
          field,
          level,
          i
        )
      );

    }

    localStorage.removeItem(
      this.testKey(field, level)
    );

    localStorage.removeItem(
      `${field}_${level}_test_score`
    );
  },


  // إعادة مجال كامل
  resetField(
    field,
    levels = [
      "beginner",
      "intermediate",
      "advanced"
    ]
  ) {

    levels.forEach(level => {
      this.resetLevel(
        field,
        level
      );
    });

  },


  // حذف كل التقدم
  resetAll() {

    const keys = [];

    for (
      let i = 0;
      i < localStorage.length;
      i++
    ) {

      const key =
        localStorage.key(i);

      if (
        key &&
        (
          key.startsWith("geography_") ||
          key.startsWith("space_") ||
          key.startsWith("technology_") ||
          key.startsWith("tech_")
        )
      ) {

        keys.push(key);

      }

    }

    keys.forEach(key => {
      localStorage.removeItem(key);
    });

  }

};