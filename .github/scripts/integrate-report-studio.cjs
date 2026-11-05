const fs = require("node:fs");

const INDEX_PATH = "index.html";
const FULL_PATH = "full-report.html";
const HELPER_PATH = "report-studio-enhance.js";
const MODULE_URL = "https://ndserpsa.nds-sa.com/desk/nds-reports";
const indexMarker = "<!-- NDS REPORT STUDIO PAGE -->";
const fullMarker = "<!-- NDS REPORT STUDIO FULL PAGE -->";

function countOf(source, needle) {
  return source.split(needle).length - 1;
}

function replaceExactlyOnce(source, needle, replacement, label) {
  const count = countOf(source, needle);
  if (count !== 1) throw new Error(label + ": expected one exact match; found " + count);
  return source.replace(needle, replacement);
}

function sectionBounds(source, id) {
  const pattern = new RegExp("<section\\b(?=[^>]*\\bid=[\"']" + id + "[\"'])[^>]*>", "g");
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 1) throw new Error("Section #" + id + ": expected one opening tag; found " + matches.length);
  const start = matches[0].index;
  const close = source.indexOf("</section>", start);
  if (close < 0) throw new Error("Section #" + id + ": closing tag not found");
  return { start: start, end: close + "</section>".length };
}

function patchSectionNumber(source, id, oldNumber, newNumber, oldPill, newPill) {
  const bounds = sectionBounds(source, id);
  let block = source.slice(bounds.start, bounds.end);
  const headingPattern = /<(span|div)\b[^>]*class="big num"[^>]*>(\d{2})<\/\1>/g;
  const headings = [...block.matchAll(headingPattern)];
  if (headings.length !== 1) throw new Error("#" + id + " heading number: expected one match; found " + headings.length);
  if (headings[0][2] !== oldNumber) throw new Error("#" + id + " heading number mismatch: expected " + oldNumber + "; found " + headings[0][2]);
  const heading = headings[0][0];
  block = block.replace(heading, heading.replace(">" + oldNumber + "</", ">" + newNumber + "</"));
  block = replaceExactlyOnce(block, '<span class="pill">' + oldPill + "</span>", '<span class="pill">' + newPill + "</span>", "#" + id + " page pill");
  return source.slice(0, bounds.start) + block + source.slice(bounds.end);
}

function insertBeforeInNav(source, navOpen, navClose, linkId, newAnchor, label) {
  const markerAt = source.indexOf(navOpen);
  const start = navOpen.startsWith("id=") ? source.lastIndexOf("<nav", markerAt) : markerAt;
  if (start < 0) throw new Error(label + ": nav opening not found");
  const close = source.indexOf(navClose, start);
  if (close < 0) throw new Error(label + ": nav closing not found");
  let block = source.slice(start, close + navClose.length);
  const pattern = new RegExp('<a\\b(?=[^>]*\\bhref="#' + linkId + '")[^>]*>[\\s\\S]*?<\\/a>', "g");
  const matches = [...block.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(label + ": target anchor #" + linkId + " expected once; found " + matches.length);
  block = block.replace(pattern, newAnchor + "$&");
  return source.slice(0, start) + block + source.slice(close + navClose.length);
}

function patchTocEntry(source, id, oldNo, newNo, oldPage, newPage) {
  const navOpen = '<nav class="toc sec">';
  const start = source.indexOf(navOpen);
  if (start < 0) throw new Error("Full report TOC not found");
  const close = source.indexOf("</nav>", start);
  if (close < 0) throw new Error("Full report TOC closing tag not found");
  let block = source.slice(start, close + 6);
  const pattern = new RegExp('<a\\b(?=[^>]*\\bhref="#' + id + '")[^>]*>[\\s\\S]*?<\\/a>', "g");
  const matches = [...block.matchAll(pattern)];
  if (matches.length !== 1) throw new Error("TOC #" + id + ": expected one item; found " + matches.length);
  let anchor = matches[0][0];
  anchor = replaceExactlyOnce(anchor, '<span class="n num">' + oldNo + "</span>", '<span class="n num">' + newNo + "</span>", "TOC #" + id + " chapter");
  anchor = replaceExactlyOnce(anchor, '<span class="p num">' + oldPage + "</span>", '<span class="p num">' + newPage + "</span>", "TOC #" + id + " printed page");
  block = block.replace(pattern, anchor);
  return source.slice(0, start) + block + source.slice(close + 6);
}

function patchDockEntry(source, id, oldNo, newNo) {
  const navOpen = 'id="dock"';
  const markerAt = source.indexOf(navOpen);
  const start = source.lastIndexOf("<nav", markerAt);
  if (start < 0) throw new Error("Full report dock not found");
  const close = source.indexOf("</nav>", start);
  if (close < 0) throw new Error("Full report dock closing tag not found");
  let block = source.slice(start, close + 6);
  const pattern = new RegExp('<a\\b(?=[^>]*\\bhref="#' + id + '")[^>]*>[\\s\\S]*?<\\/a>', "g");
  const matches = [...block.matchAll(pattern)];
  if (matches.length !== 1) throw new Error("Dock #" + id + ": expected one item; found " + matches.length);
  const anchor = replaceExactlyOnce(matches[0][0], ">" + oldNo + "</a>", ">" + newNo + "</a>", "Dock #" + id + " number");
  block = block.replace(pattern, anchor);
  return source.slice(0, start) + block + source.slice(close + 6);
}

function addPageLinkToIndex(source) {
  const pattern = /<a\b(?=[^>]*\bhref="#s11")[^>]*>[\s\S]*?السجل الهندسي[\s\S]*?<\/a>/g;
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 1) throw new Error("Main header engineering-log link expected once; found " + matches.length);
  const newAnchor = '<a href="#s13"><i></i><span>مصمم التقارير</span></a>';
  return source.replace(pattern, newAnchor + matches[0][0]);
}

const mainPage = [
  indexMarker,
  '<section class="ch alt report-studio-chapter" id="s13"><div class="w">',
  '<div class="chh rv"><span class="big num">07</span><span class="kick"><span class="pill">07</span>NDS Report Studio</span><h2>مصمم التقارير</h2>',
  '<p class="lead">مساحة تقارير داخل NDS ERP Saudi لتنظيم تعريفات التقارير وحقولها، وتشغيلها، ومتابعة إصداراتها وسجل تنفيذها، مع احترام صلاحيات المستخدم.</p>',
  '<div class="take"><i class="dot"></i><div><b>من بيانات النظام إلى رؤية أوضح:</b> تنظيم عملية إعداد التقرير وتشغيله داخل بيئة ERP بدل الاعتماد على تجميع يدوي متكرر للبيانات.</div></div></div>',
  '<div class="g sec report-studio-feature-grid">',
  '<article class="card hov rv"><div class="ico live" data-i="sheet"></div><h3>تعريف التقارير وتنظيمها</h3><p>مساحة موحدة لإدارة التقارير المحفوظة وسجلاتها، بما يساعد على إعادة استخدام تعريف التقرير ومراجعته بدل تكرار إعداداته في كل مرة.</p><div class="tech"><b>القيمة العملية</b><span>تقليل الأعمال اليدوية وتوحيد طريقة الوصول إلى التقارير المتكررة.</span></div></article>',
  '<article class="card hov rv"><div class="ico live" data-i="layout"></div><h3>الحقول وطريقة العرض</h3><p>تخصيص الحقول الظاهرة، وإظهار الأعمدة أو إخفاؤها للعرض، والترتيب بالضغط على عنوان العمود، مع تصميم جدول يسهّل متابعة البيانات والإجماليات.</p><div class="tech"><b>تحسين NX3</b><span>رأس كحلي ثابت، عمود أول ثابت، صف إجماليات ثابت، شارات حالة وتظليل متبادل.</span></div></article>',
  '<article class="card hov rv"><div class="ico live" data-i="card"></div><h3>الإصدارات والتشغيل</h3><p>توجد بنية مخصصة لإدارة تعريفات التقارير وإصداراتها وسجل تشغيلها، مع وجود سجلات تقارير فعلية ضمن النسخة السعودية.</p><div class="tech"><b>القيمة العملية</b><span>وضوح أكبر في متابعة التقرير وإصداراته وعمليات تشغيله.</span></div></article>',
  '<article class="card hov rv"><div class="ico live" data-i="lock"></div><h3>الصلاحيات وحوكمة البيانات</h3><p>قراءة بيانات التقارير تمر عبر frappe.client.get_list وفق صلاحيات المستخدم؛ فلا ينبغي أن تمنح شاشة التقارير وصولًا أوسع من أذونات الحساب.</p><div class="tech"><b>القيمة للعملاء</b><span>تقارير أقرب إلى احتياج كل دور، مع الحفاظ على ضوابط الوصول إلى البيانات.</span></div></article>',
  '</div>',
  '<div class="g2 sec"><article class="card rv"><h3>أثر المصمم داخل NDS ERP</h3><p>يجمع المصمم بين تنظيم التقارير، ومرونة الحقول، وتحسين قراءة النتائج، وتتبع الإصدارات والتشغيل. وتنعكس هذه الوظائف على سرعة الوصول للمعلومة، وتقليل تكرار إعداد التقارير، وتحسين قابلية مراجعة النتائج.</p></article>',
  '<article class="card rv"><h3>حالة التطوير والتحقق</h3><p>الفحص السابق أثبت وجود ثلاثة Doctypes مخصصة وسجلات تقارير فعلية. كما يثبت سجل NX3 تعديل المصدر، واجتياز فحص صياغة JavaScript، ونجاح بناء amir_theme_v16.</p><p class="mut" style="margin-top:10px">لم يثبت بعد تنفيذ clear-cache أو إجراء فحص بصري نهائي بعد التفعيل؛ لذلك تبقى هذه الخطوة قيد التحقق ولا تُسجّل كقبول تشغيلي مكتمل.</p><span class="sp warn"><i class="dot"></i>مبني — ينتظر التفعيل والتحقق النهائي</span></article></div>',
  '<div class="sec rv"><div class="tech report-studio-cta"><b>فتح الوحدة</b><span>مصمم التقارير في النسخة السعودية فقط — يفتح في نافذة مستقلة.</span><a class="sp info" href="' + MODULE_URL + '" target="_blank" rel="noopener"><i class="dot"></i>فتح مصمم التقارير ↗</a></div></div>',
  '</div></section>'
].join("\n");

const fullPage = [
  fullMarker,
  '<section class="pg report-studio-full-page" id="s11"><div class="wrap">',
  '<div class="big num">05</div><span class="kick"><span class="pill">05</span>NDS REPORT STUDIO</span><h2>مصمم التقارير</h2>',
  '<p class="lead">مساحة عمل داخل النسخة السعودية لتنظيم التقارير وحقولها وتشغيلها ومتابعة إصداراتها وسجل تنفيذها، مع مراعاة صلاحيات المستخدم.</p>',
  '<div class="g sec">',
  '<article class="card"><h3>تعريف التقارير</h3><p>إدارة سجلات التقارير المحفوظة وتنظيمها، بما يسهّل إعادة الاستخدام ومراجعة تعريف التقرير.</p></article>',
  '<article class="card"><h3>الحقول والجدول</h3><p>التحكم في الحقول الظاهرة، والترتيب حسب العمود، وتحسين قراءة النتائج من خلال رأس ثابت وعمود أول ثابت وإجماليات وشارات حالة.</p></article>',
  '<article class="card"><h3>الإصدارات وسجل التشغيل</h3><p>توجد ثلاثة Doctypes مخصصة وسجلات تقارير فعلية، مع فصل تعريف التقرير وإصداراته وسجل تشغيله ضمن بنية الوحدة.</p></article>',
  '<article class="card"><h3>الصلاحيات</h3><p>تُقرأ بيانات التقارير عبر frappe.client.get_list وفق صلاحيات المستخدم، بما يدعم حوكمة الوصول إلى المعلومات.</p></article>',
  '</div>',
  '<div class="card sec"><h3>القيمة التشغيلية</h3><p>يساعد المصمم على تقليل استخراج البيانات يدويًا، وتوحيد التقارير المتكررة، وتسريع متابعة المؤشرات، وتوفير مسار أوضح لمراجعة تعريفات التقارير وإصداراتها وعمليات تشغيلها.</p></div>',
  '<div class="chips sec"><span class="chip">تعريفات تقارير منظمة</span><span class="chip">حقول قابلة للتخصيص</span><span class="chip">تتبع الإصدارات والتشغيل</span><span class="chip">مراعاة صلاحيات المستخدم</span></div>',
  '<div class="card sec"><h3>حالة التنفيذ والتحقق</h3><p>سجل الفحص يثبت وجود ثلاثة Doctypes وسجلات تقارير فعلية، كما يثبت تعديل مصدر NX3 وفحص صياغة JavaScript ونجاح بناء تطبيق amir_theme_v16.</p><p class="mut">لم يثبت بعد تنفيذ clear-cache أو اختبار الواجهة بصريًا بعد التفعيل؛ لذلك تُصنّف تحسينات NX3 بأنها «مبنية — بانتظار التفعيل والتحقق النهائي»، لا قبولًا تشغيليًا مكتملًا.</p><p><a href="' + MODULE_URL + '" target="_blank" rel="noopener">فتح مصمم التقارير في النسخة السعودية ↗</a></p></div>',
  '</div></section>'
].join("\n");

function mainReportPatch(source) {
  if (source.includes(indexMarker)) throw new Error("Main report page marker already exists");
  source = addPageLinkToIndex(source);
  source = replaceExactlyOnce(source, '<section class="ch" id="s11">', mainPage + '<section class="ch" id="s11">', "Insert Report Studio page before engineering log");
  source = patchSectionNumber(source, "s11", "07", "08", "07", "08");
  source = patchSectionNumber(source, "s7", "08", "09", "08 · أ", "09 · أ");
  source = patchSectionNumber(source, "s7b", "08", "09", "08 · ب", "09 · ب");
  source = patchSectionNumber(source, "s8", "09", "10", "09", "10");
  source = patchSectionNumber(source, "s9", "10", "11", "10", "11");
  source = patchSectionNumber(source, "s10", "11", "12", "11", "12");
  return source;
}

function fullReportPatch(source) {
  if (source.includes(fullMarker)) throw new Error("Full report page marker already exists");
  source = replaceExactlyOnce(source, '<section class="pg" id="s5">', fullPage + '<section class="pg" id="s5">', "Insert Report Studio page before engineering log");
  source = insertBeforeInNav(source, '<nav class="toc sec">', "</nav>", "s5", '<a href="#s11"><span class="n num">05</span>مصمم التقارير — NDS Report Studio<span class="d"></span><span class="p num">07</span></a>', "Full report TOC");

  const tocNumbers = [
    ["s5","05","06","07","08"], ["s6","06","07","08","09"], ["s7","07","08","09","10"],
    ["s8","08","09","10","11"], ["s9","09","10","11","12"], ["s10","10","11","12","13"]
  ];
  for (const item of tocNumbers) source = patchTocEntry(source, item[0], item[1], item[2], item[3], item[4]);

  source = insertBeforeInNav(source, 'id="dock"', "</nav>", "s5", '<a class="num" href="#s11">05</a>', "Full report dock");
  const dockNumbers = [["s5","05","06"],["s6","06","07"],["s7","07","08"],["s8","08","09"],["s9","09","10"],["s10","10","11"]];
  for (const item of dockNumbers) source = patchDockEntry(source, item[0], item[1], item[2]);

  const chapterNumbers = [["s5","05","06"],["s6","06","07"],["s7","07","08"],["s8","08","09"],["s9","09","10"],["s10","10","11"]];
  for (const item of chapterNumbers) source = patchSectionNumber(source, item[0], item[1], item[2], item[1], item[2]);
  return source;
}

function run() {
  if (!fs.existsSync(INDEX_PATH) || !fs.existsSync(FULL_PATH) || !fs.existsSync(HELPER_PATH)) {
    throw new Error("Expected report source files and card enhancer were not found in repository root");
  }
  let index = fs.readFileSync(INDEX_PATH, "utf8");
  let full = fs.readFileSync(FULL_PATH, "utf8");
  const indexDone = index.includes(indexMarker);
  const fullDone = full.includes(fullMarker);

  if (!(indexDone && fullDone)) {
    if (indexDone || fullDone) throw new Error("Partial Report Studio integration detected; refusing to overwrite.");
    index = mainReportPatch(index);
    full = fullReportPatch(full);
    if (!index.includes('href="#s13"') || !index.includes('id="s13"')) throw new Error("Main report page/navigation verification failed");
    if (!full.includes('href="#s11"') || !full.includes('id="s11"')) throw new Error("Full report page/TOC verification failed");
    const scriptTag = '<script src="report-studio-enhance.js"></script>';
    if (!index.includes(scriptTag)) index = replaceExactlyOnce(index, "</body>", scriptTag + "\n</body>", "Install engineering log card enhancer");
    fs.writeFileSync(INDEX_PATH, index, "utf8");
    fs.writeFileSync(FULL_PATH, full, "utf8");
  } else {
    console.log("Report Studio HTML pages already exist.");
  }

  console.log("REPORT_STUDIO_PATCH=OK");
  console.log("MAIN_PAGE=07 | ENGINEERING_LOG=08");
  console.log("FULL_REPORT_PRINT_PAGE=07 | ENGINEERING_LOG_PRINT_PAGE=08");
  console.log("CARD_ENHANCER=report-studio-enhance.js");
}

try {
  run();
} catch (error) {
  console.error("REPORT_STUDIO_PATCH=FAILED");
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
}
