(() => {
  "use strict";
  const MODULE_URL = "https://ndserpsa.nds-sa.com/desk/nds-reports";
  const STYLE_ID = "nds-report-studio-log-card-style";
  const CARD_MARKER = "data-report-studio-card";

  const css = [
    ':is(#s11, #s5) #tasks .report-studio-log-card{position:relative;display:flex;flex-direction:column;gap:0;min-width:0;padding:0;overflow:hidden;border:1px solid var(--line,#e4dfd0);border-radius:18px;background:var(--card,#fff);box-shadow:var(--sh,0 16px 40px -22px rgba(10,74,58,.25))}',
    ':is(#s11, #s5) #tasks .report-studio-log-card:before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(90deg,var(--g8,#0a4a3a),var(--gold,#c9a84c),var(--g7,#0f6b50))}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-head{display:flex;align-items:center;gap:12px;padding:17px 19px 14px;background:linear-gradient(115deg,var(--g9,#062a1f),var(--g8,#0a4a3a));color:#f7f2e5;border-bottom:1px solid #c9a84c55}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .no{flex:0 0 auto;display:grid;place-items:center;width:38px;height:38px;border:1px solid #d9bd6c;border-radius:11px;background:#ffffff0c;color:#e6cd8b;font:700 12px "Space Grotesk",sans-serif}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-head h3{min-width:0;margin:0;color:#fff;font:600 15px/1.6 "Readex Pro",sans-serif}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-body{display:flex;flex-direction:column;padding:12px 19px 10px}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-row{display:grid;grid-template-columns:112px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid var(--line,#e4dfd0);align-items:start}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-row:last-child{border-bottom:0}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-label{font-size:12px;font-weight:700;color:var(--g8,#0a4a3a);white-space:nowrap}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-value{font-size:12px;line-height:1.75;color:var(--ink,#12261f);overflow-wrap:anywhere}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-foot{margin:0 19px;padding:12px 0 15px;border-top:1px solid var(--gold,#c9a84c);display:flex;flex-direction:column;gap:9px}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-proof{font-size:11.5px;color:var(--mut,#5d6b64)}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-proof a{color:var(--g8,#0a4a3a);font-weight:700;text-decoration:underline;text-underline-offset:3px}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-status{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;color:#9a6a00}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-status i{width:9px;height:9px;border-radius:50%;background:#d99a27;display:inline-block}',
    ':is(#s11, #s5) #tasks .report-studio-log-card .tk-row.studio-wide{grid-template-columns:1fr;gap:3px}',
    '@media(max-width:760px){:is(#s11, #s5) #tasks .report-studio-log-card .tk-head{padding:14px 15px 12px}:is(#s11, #s5) #tasks .report-studio-log-card .tk-body{padding:10px 15px}:is(#s11, #s5) #tasks .report-studio-log-card .tk-row{grid-template-columns:100px minmax(0,1fr);gap:8px;padding:7px 0}:is(#s11, #s5) #tasks .report-studio-log-card .tk-foot{margin-inline:15px}}'
  ].join("\n");

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createCard() {
    const card = document.createElement("article");
    card.className = "card tk report-studio-log-card";
    card.setAttribute(CARD_MARKER, "true");
    card.innerHTML = [
      '<header class="tk-head"><span class="no">RS</span><h3>مصمم التقارير — NDS Report Studio</h3></header>',
      '<div class="tk-body">',
      '<div class="tk-row"><span class="tk-label">المحور</span><span class="tk-value">التقارير والتحليل</span></div>',
      '<div class="tk-row"><span class="tk-label">الدور</span><span class="tk-value">تنظيم التقارير وحقولها وتشغيلها ومتابعة إصداراتها وسجل تنفيذها.</span></div>',
      '<div class="tk-row"><span class="tk-label">القدرات</span><span class="tk-value">تفعيل وإلغاء الحقول للعرض، والترتيب حسب العمود، وتحسين قراءة الجدول والإجماليات وحالات السجلات.</span></div>',
      '<div class="tk-row"><span class="tk-label">الحوكمة</span><span class="tk-value">قراءة البيانات عبر frappe.client.get_list وفق صلاحيات المستخدم.</span></div>',
      '<div class="tk-row studio-wide"><span class="tk-label">التحقق الفني</span><span class="tk-value">ثلاثة Doctypes وسجلات فعلية؛ تعديل NX3 وفحص JavaScript والبناء موثقة. تفعيل الكاش والفحص البصري النهائي لم يثبتا بعد.</span></div>',
      '</div>',
      '<footer class="tk-foot"><span class="tk-proof"><strong>الوحدة:</strong> <a href="' + MODULE_URL + '" target="_blank" rel="noopener">فتح مصمم التقارير ↗</a></span><span class="tk-status review"><i></i>مبني — بانتظار التفعيل والتحقق النهائي</span></footer>'
    ].join("");
    return card;
  }

  function mountCard(host) {
    if (!host || host.querySelector("[" + CARD_MARKER + "]")) return;
    host.appendChild(createCard());
  }

  function attach() {
    installStyle();
    const hosts = Array.from(document.querySelectorAll("#s11 #tasks, #s5 #tasks"));
    if (!hosts.length) return false;
    hosts.forEach((host) => {
      mountCard(host);
      if (!host.dataset.reportStudioCardObserver) {
        const observer = new MutationObserver(() => mountCard(host));
        observer.observe(host, { childList: true });
        host.dataset.reportStudioCardObserver = "1";
      }
    });
    return true;
  }

  function start() {
    if (attach()) return;
    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();