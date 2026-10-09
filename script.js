// منوی موبایل
document.querySelectorAll(".menu-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nav = document.querySelector(".nav");
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

// تقویم شمسی با استفاده از پشتیبانی تقویم فارسی مرورگر
const calendarDays = document.getElementById("calendar-days");
if (calendarDays) {
  const title = document.getElementById("calendar-title");
  const selectedLabel = document.getElementById("selected-date-label");
  const faDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric", month: "numeric", day: "numeric"
  });
  const faMonth = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric", month: "long"
  });
  const faNumber = (n) => new Intl.NumberFormat("fa-IR").format(n);
  const partsFor = (date) => {
    const parts = faDate.formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || "";
    return { year: Number(get("year").replace(/[^\d]/g, "")), month: Number(get("month").replace(/[^\d]/g, "")), day: Number(get("day").replace(/[^\d]/g, "")) };
  };
  const sameMonth = (a, b) => {
    const x = partsFor(a), y = partsFor(b);
    return x.year === y.year && x.month === y.month;
  };
  const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  };
  const startOfPersianMonth = (date) => {
    let d = new Date(date);
    while (partsFor(addDays(d, -1)).month === partsFor(date).month &&
           partsFor(addDays(d, -1)).year === partsFor(date).year) d = addDays(d, -1);
    return d;
  };
  const weekdaySaturdayFirst = (date) => (date.getDay() + 1) % 7;
  let today = new Date();
  let viewDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let selectedDate = null;

  function renderCalendar() {
    const first = startOfPersianMonth(viewDate);
    const firstParts = partsFor(first);
    title.textContent = faMonth.format(viewDate);
    calendarDays.innerHTML = "";
    const offset = weekdaySaturdayFirst(first);
    for (let i = 0; i < offset; i++) {
      const blank = document.createElement("span");
      blank.className = "calendar-day empty";
      blank.setAttribute("aria-hidden", "true");
      calendarDays.appendChild(blank);
    }
    let cursor = new Date(first);
    // هر ماه شمسی را با حرکت روزبه‌روز تا رسیدن به ماه بعد می‌سازیم.
    for (let dayCount = 0; dayCount < 32; dayCount++) {
      const p = partsFor(cursor);
      if (p.year !== firstParts.year || p.month !== firstParts.month) break;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = faNumber(p.day);
      button.setAttribute("aria-label", `${faNumber(p.day)} ${faMonth.format(cursor)}`);
      if (cursor.toDateString() === today.toDateString()) button.classList.add("today");
      if (selectedDate && cursor.toDateString() === selectedDate.toDateString()) button.classList.add("selected");
      button.addEventListener("click", () => {
        selectedDate = new Date(cursor);
        selectedLabel.textContent = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        }).format(selectedDate);
        renderCalendar();
      });
      calendarDays.appendChild(button);
      cursor = addDays(cursor, 1);
    }
  }
  document.getElementById("prev-month").addEventListener("click", () => {
    viewDate = addDays(startOfPersianMonth(viewDate), -1);
    renderCalendar();
  });
  document.getElementById("next-month").addEventListener("click", () => {
    let d = startOfPersianMonth(viewDate);
    while (sameMonth(d, viewDate)) d = addDays(d, 1);
    viewDate = d;
    renderCalendar();
  });
  renderCalendar();

  const form = document.getElementById("interest-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("full-name").value.trim();
    const interest = document.getElementById("interest").value;
    const experience = document.getElementById("experience").value;
    const message = document.getElementById("form-message");
    const dateText = selectedDate
      ? new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(selectedDate)
      : "هنوز تاریخی انتخاب نشده";
    message.textContent = `ممنون ${name}! علاقه‌مندی شما («${interest}»، ${experience}) ثبت نمایشی شد. تاریخ پیشنهادی: ${dateText}. این اطلاعات فقط در همین صفحه نمایش داده می‌شود.`;
    message.classList.add("show");
  });
}
