'use strict';
// Lightweight navigation and Gregorian calendar: no dependencies, no polling.
document.querySelectorAll('.menu-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});
const calendarDays = document.getElementById('calendar-days');
if (calendarDays) {
  const title = document.getElementById('calendar-title');
  const selectedLabel = document.getElementById('selected-date-label');
  const today = new Date();
  const todayDay = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;
  const monthFormatter = new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'});
  const dateFormatter = new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  function renderCalendar(){
    title.textContent = monthFormatter.format(new Date(viewYear,viewMonth,1));
    calendarDays.replaceChildren();
    const firstDay = new Date(viewYear,viewMonth,1).getDay();
    const count = new Date(viewYear,viewMonth+1,0).getDate();
    const fragment = document.createDocumentFragment();
    for(let i=0;i<firstDay;i++){
      const blank=document.createElement('span');blank.className='calendar-day empty';blank.setAttribute('aria-hidden','true');fragment.append(blank);
    }
    for(let day=1;day<=count;day++){
      const date=new Date(viewYear,viewMonth,day);
      const button=document.createElement('button');button.type='button';button.className='calendar-day';button.textContent=String(day);
      button.setAttribute('aria-label',dateFormatter.format(date));
      if(date.getTime()===todayDay.getTime())button.classList.add('today');
      if(selectedDate&&date.getTime()===selectedDate.getTime())button.classList.add('selected');
      if(date<todayDay){button.disabled=true;button.classList.add('past');}
      else button.addEventListener('click',()=>{selectedDate=date;selectedLabel.textContent=dateFormatter.format(date);renderCalendar();});
      fragment.append(button);
    }
    calendarDays.append(fragment);
  }
  function changeMonth(delta){const d=new Date(viewYear,viewMonth+delta,1);viewYear=d.getFullYear();viewMonth=d.getMonth();renderCalendar();}
  document.getElementById('prev-month').addEventListener('click',()=>changeMonth(-1));
  document.getElementById('next-month').addEventListener('click',()=>changeMonth(1));
  renderCalendar();
  const form=document.getElementById('interest-form');
  if(form)form.addEventListener('submit',event=>{
    event.preventDefault();
    const name=document.getElementById('full-name').value.trim();
    const interest=document.getElementById('interest').value;
    const experience=document.getElementById('experience').value;
    const message=document.getElementById('form-message');
    if(!name||!interest){message.textContent='لطفاً نام و نوع علاقه‌مندی را تکمیل کن.';message.classList.add('show');return;}
    const dateText=selectedDate?dateFormatter.format(selectedDate):'No date selected';
    message.textContent=`ممنون ${name}! انتخابت: ${interest} / ${experience}. تاریخ پیشنهادی: ${dateText}. این فقط یک پیش‌نمایش است و هیچ رزروی ثبت نشده است.`;
    message.classList.add('show');
  });
}
