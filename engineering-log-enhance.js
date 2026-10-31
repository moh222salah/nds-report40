(() => {
const meta = [
['اختلاف حالة التطبيقات والخدمات وسجلات Git قبل التغيير.','غياب خط أساس موحد لفصل المشكلات السابقة عن أثر التعديل.','مراجعة التطبيقات والخدمات وسجلات Git والأخطاء قبل أي كتابة.','تكوين صورة أولية للحالة الفنية ومصادر المخاطر.'],
['تداخل محتمل بين تعريفات Workspaces وآليات مزامنتها.','تأثير Fixtures وafter_migrate على إعادة بناء المساحات.','تحليل مسار Fixtures وafter_migrate وعلاقتهما بمحتوى Workspaces.','تحديد نقاط التأثير التي يجب حمايتها قبل أي تعديل.'],
['ظهور روابط أو عناصر في مساحة عمل غير المساحة المتوقعة.','الاشتباه الأولي في ZATCA لم يطابق موضع الصفوف الفعلي.','تتبع مصدر الصفوف ومراجعة ارتباطها بمساحة Stock.','تضييق نطاق التشخيص إلى المساحة ذات الصلة.'],
['قائمة جانبية تقليدية مع تفاوت الألوان والأيقونات والمحاذاة.','تراكم تحسينات متفرقة دون نظام تنقل موحد.','تطوير Rail والمفضلة والأيقونات والمتغيرات عبر v2.4–v2.9.3.','تكوين نظام تنقل أكثر اتساقًا مع توثيق مراحل التطوير.'],
['الحاجة إلى وضوح سياق الصفحة وحالة المستند وأدوات التحكم.','توزع عناصر التوجيه والحالة بين مكونات الواجهة.','إضافة Breadcrumb ديناميكي ومؤشرات حالة وأزرار اللغة والثيم.','تجميع معلومات السياق والتحكم في مساحة أوضح.'],
['اختلاف تنظيم مساحات العمل بين وحدات النظام.','عدم وجود نمط عرض موحد عبر الوحدات.','مراجعة وتنظيم لوحات المبيعات والحسابات والمشتريات والمخازن والأصول والموارد البشرية ونقاط البيع.','تحسين اتساق تجربة العرض والتنقل بين الوحدات.'],
['أقسام وروابط تظهر بصورة غير ثابتة أثناء التحميل.','تعارض توقيت تحميل البيانات وإعادة الرسم (Race Conditions).','تحليل ومعالجة سلوك التحميل في workspace_sections.js.','تحديد مسار المعالجة؛ يلزم اختبار متكرر لإثبات الاستقرار.'],
['محدودية التحكم في تنظيم أقسام لوحة المشتريات.','غياب أدوات تحرير مرنة ضمن تجربة اللوحة.','تطوير مسار تحرير لإعادة التسمية والإضافة والحذف والسحب والإفلات.','توفير آلية إدارة أكثر مرونة؛ يلزم اختبار السيناريوهات.'],
['تفاوت بصري في الفواتير بين التبويبات والأيقونات والجداول.','الواجهة الافتراضية لا تقدم الهوية الموحدة المطلوبة.','إعادة تنظيم التبويبات والأيقونات والجداول وربطها بسكربتات سعودية مستقلة.','تحسين تجربة الفواتير مع توثيق مقارنة قبل/بعد.'],
['اقتراح كارت إجماليات مخصص قد يزيد تعقيد الاعتماد على الحقول الأصلية.','التصميم البديل لم يكن الأكثر توافقًا مع بنية الفاتورة.','اختبار الكارت المخصص ثم التراجع إلى الحقول الأصلية.','تقليل التعقيد والمحافظة على توافق النموذج الأصلي.'],
['تداخل أو بقايا تبعيات بين أدوات Excel للمبيعات والمشتريات.','اعتماد مسار المشتريات على أجزاء لا تخصه بالكامل.','فصل أداة NDS PINV Excel (Saudi) وفحص التبعيات.','نتيجة الفحص المسجلة leftovers: []؛ اختبار الملفات الفعلية مطلوب.'],
['الحاجة إلى ملف تصدير منظم يدعم الطباعة واللغتين.','التنسيق لا يغطي A4 وRTL/LTR ورأس الجدول وترقيم الصفحات.','تطوير إخراج XLSX بمقاس A4 واتجاهين وتكرار الرأس وترقيم الصفحات وبيانات الجهة.','توفير مواصفات تصدير أوضح؛ اختبار الملفات والطباعة مطلوب.'],
['عدم توحيد شكل الخط في تجربة الفواتير.','الاعتماد على تحميل خارجي قد يؤثر في ثبات العرض.','إضافة سبعة ملفات WOFF2 محلية ومفتاح nds_tajawal=off ضمن الفواتير.','إتاحة خط محلي قابل للتعطيل؛ القبول النهائي يتطلب مراجعة متعددة الأجهزة.'],
['فاتورة مدفوعة بالكامل قد لا تعكس حالة السداد المتوقعة.','غياب doc_events وpermission_query_conditions من hooks.py منع تشغيل الأحداث.','استعادة مفاتيح الربط وفحص الصياغة باستخدام ast.parse قبل إعادة التشغيل.','تحديد السبب وإصلاح الربط؛ اختبار دورة الفاتورة وPayment Entry مطلوب.'],
['عدم اتساق بين المبلغ المدفوع وطريقة الدفع عند ترك الطريقة فارغة.','عدم ضبط السلوك بحسب وجود Mode of Payment.','ربط nds_mode_of_payment وnds_paid_amount بمسار الاعتماد الاختياري.','توضيح مسار المسودة والاعتماد؛ الاختبار التشغيلي الكامل مطلوب.'],
['الحاجة إلى إدخال طريقة الدفع في موضع منطقي ضمن نافذة السداد.','موضع الحقل لا يراعي تسلسل مبلغ السداد والمرجع.','إضافة Mode of Payment بعد مبلغ السداد وقبل تاريخ المرجع.','تحسين تسلسل الإدخال؛ التحقق من حفظ القيمة وتمريرها مطلوب.'],
['عدم كفاية التحقق من ظهور التصميم على المستندات بعد حفظها.','المعاينة الأولية لا تثبت سلوك المستندات المحفوظة.','فحص الفواتير المحفوظة وحالات المستند وتأكيد ظهور التصميم بتاريخ 25 أكتوبر.','توثيق قبول الواجهة للحالات المفحوصة دون تعميم غير مثبت.'],
['الحاجة إلى مطابقة النسخة المحلية مع المصدر المستهدف.','احتمال اختلاف ملفات العمل أو الأصول عن GitHub main.','مقارنة HEAD وبصمات SHA256 والتحقق من تطابق المصدر السعودي.','توثيق حالة المصدر والبصمات عند الفحص المحدد.'],
['احتمال اختلاف ما بُني عما تقدمه الخدمة فعليًا.','نجاح البناء وحده لا يثبت وصول الأصول عبر HTTP.','مراجعة assets.json وSupervisor واستجابة HTTP والكاش.','توثيق استجابة الأصول والخدمات دون ادعاء قبول بصري.'],
['عدم ظهور بعض تغييرات NDS Nav بعد تعديل المصدر.','get_hooks يقرأ client_cache بينما المسح استهدف مفتاحًا مختلفًا.','تتبع مسار get_hooks ومفتاح الكاش الفعلي ومقارنته بمفتاح المسح.','تحديد سبب محتمل لعدم تحديث التخصيص؛ تحقق ما بعد المعالجة مطلوب.'],
['تذبذب في إتاحة الواجهة أو مكونات التشغيل.','قد يكون العطل في Web أو Workers أو Redis وليس CSS وحده.','فصل فحص الخدمة والعمّال وRedis عن فحص الواجهة.','تحسين دقة تحديد طبقة العطل وتجنب التشخيص الخاطئ.'],
['الحاجة إلى نقطة رجوع قبل التعديلات الحساسة.','التغيير دون خط أساس موثق يصعب معه تحديد الفروقات.','استخدام SHA256 وGit diff وتجهيز أوامر Rollback قبل التغيير.','توفير مسار مقارنة وتراجع أوضح.'],
['احتمال إعادة إنشاء أو تغيير مساحات العمل عند الترحيل.','Fixtures وMigration قد يعيدان تطبيق تعريفات Workspace.','مراجعة أثر Fixtures وآلية إعادة إنشاء العناصر قبل اعتماد الترحيل.','تحديد مخاطر الترحيل؛ لا يُسجل هنا تنفيذ Migration.'],
['خطر تداخل التعديلات بين النسختين السعودية والمصرية.','اشتراك أسماء أو مسارات التخصيص قد يسبب أثرًا خارج النطاق.','قصر التعديلات على ndserpsa.nds-sa.com واستخدام أسماء سعودية مستقلة.','تأكيد حدود النطاق وعدم توسيع التغيير إلى البيئة المصرية.'],
['الحاجة إلى سرعة التنفيذ دون تجاوز ضوابط الإنتاج.','العمل السريع دون تحقق أو تراجع يرفع مخاطر التغيير.','صياغة بروتوكول من ثلاث مراحل مع مؤشرات سلامة وتصنيف PASS وFAIL.','توحيد طريقة التنفيذ والتوثيق وفصل المثبت عن غير المختبر.'],
['الحاجة إلى نسخة استرجاع قبل أعمال النسخ والاستنساخ.','غياب نسخة كاملة قابلة للاستعادة يرفع مخاطر فقدان الحالة الأصلية.','إكمال النسخ الاحتياطي الكامل للنسخة السعودية قبل الاستنساخ.','توفير نقطة استرجاع سابقة للعملية وفق سجل المهمة.'],
['الحاجة إلى بيئة اختبار منفصلة عن الإنتاج.','الاختبار على الإنتاج قد يعرّض البيانات المالية والتشغيلية للمخاطر.','تجهيز مسار استنساخ إلى test.next.nds-technology.com مع استبعاد البيانات المالية.','تحديد بيئة اختبار مستقلة؛ إثبات اكتمال النسخ والتحقق التشغيلي مطلوب.']
];
const css = `
#tasks{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:stretch}
#tasks .tk{position:relative;display:flex;flex-direction:column;gap:0;padding:0;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--card);box-shadow:var(--sh);transition:transform .2s ease,box-shadow .2s ease}
#tasks .tk:before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(90deg,var(--g8),var(--gold),var(--g7))}
#tasks .tk-head{display:flex;align-items:center;gap:12px;padding:17px 19px 14px;background:linear-gradient(115deg,var(--g9),var(--g8));color:#f7f2e5;border-bottom:1px solid #c9a84c55}
#tasks .tk-head .no{flex:0 0 auto;display:grid;place-items:center;width:38px;height:38px;border:1px solid #d9bd6c;border-radius:11px;background:#ffffff0c;color:var(--gold2);font:700 13px 'Space Grotesk'}
#tasks .tk-head h3{font:600 16px/1.55 'Readex Pro',sans-serif;color:#fff;margin:0;flex:1}
#tasks .tk-body{padding:15px 19px 12px}
#tasks .tk-row{display:grid;grid-template-columns:112px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:start}
#tasks .tk-row:last-child{border-bottom:0}
#tasks .tk-label{font-size:12px;font-weight:700;color:var(--g8);white-space:nowrap}
#tasks .tk-value{font-size:12.5px;line-height:1.75;color:var(--ink);overflow-wrap:anywhere}
#tasks .tk-foot{margin:0 19px;padding:12px 0 15px;border-top:1px solid var(--gold);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
#tasks .tk-proof{font-size:11.5px;color:var(--mut)}
#tasks .tk-proof strong{color:var(--g8);font-weight:700}
#tasks .tk-status{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;white-space:nowrap}
#tasks .tk-status i{width:9px;height:9px;border-radius:50%;display:inline-block}
#tasks .tk-status.done{color:#23834d}#tasks .tk-status.done i{background:#23834d}
#tasks .tk-status.partial{color:#b7791f}#tasks .tk-status.partial i{background:#d99a27}
#tasks .tk-status.review{color:#b48620}#tasks .tk-status.review i{background:#e0ad32}
#tasks .tk-status.delayed{color:#c94a45}#tasks .tk-status.delayed i{background:#d94b45}
#tasks .tk-status.proposed{color:#287fc1}#tasks .tk-status.proposed i{background:#287fc1}
@media(max-width:760px){#tasks{grid-template-columns:1fr;gap:13px}#tasks .tk-head{padding:14px 15px 12px}#tasks .tk-body{padding:12px 15px 9px}#tasks .tk-row{grid-template-columns:100px minmax(0,1fr);gap:8px;padding:7px 0}#tasks .tk-foot{margin-inline:15px}}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const category=code=>ax.find(x=>x[0]===code)?.[1]||'—';
const render=filter=>{
  const host=document.getElementById('tasks');if(!host)return;
  host.innerHTML=T.map((t,i)=>({t,i})).filter(x=>filter==='all'||x.t[0]===filter).map(({t,i})=>{
    const evidence=lv[t[3]],status=t[3]===4?['done','مكتملة']:t[3]===0?['review','قيد التحقق']:['partial','مكتملة جزئيًا'];
    const rows=[['المحور',category(t[0])],['الحالة السابقة',meta[i][0]],['التشخيص',meta[i][1]],['الإجراء الهندسي',meta[i][2]],['النتيجة',meta[i][3]]];
    return `<article class="card tk"><header class="tk-head"><span class="no">#${String(i+1).padStart(2,'0')}</span><h3>${t[1]}</h3></header><div class="tk-body">${rows.map(r=>`<div class="tk-row"><span class="tk-label">${r[0]}</span><span class="tk-value">${r[1]}</span></div>`).join('')}</div><footer class="tk-foot"><span class="tk-proof"><strong>مستوى الإثبات:</strong> ${evidence[0]} — ${lvd[t[3]]}</span><span class="tk-status ${status[0]}"><i></i>${status[1]}</span></footer></article>`;
  }).join('');
};
render('all');
const filters=document.getElementById('flt');
if(filters){filters.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b)return;filters.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));render(b.dataset.a);});}
})();