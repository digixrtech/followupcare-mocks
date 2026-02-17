(function() {
  var PASS_HASH = '2e4a8d6329d1d5104f212018f7549dc2edcc54cf936fe3984dbafb40e426c6ab';

  async function sha256(message) {
    var msgBuffer = new TextEncoder().encode(message);
    var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  if (sessionStorage.getItem('fc_auth') === 'true') return;

  // Hide page content immediately
  document.documentElement.style.visibility = 'hidden';

  document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.style.visibility = 'hidden';

    var overlay = document.createElement('div');
    overlay.id = 'fc-auth-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#f8f9fa;font-family:Inter,system-ui,sans-serif;visibility:visible';

    overlay.innerHTML =
      '<div style="text-align:center;max-width:360px;padding:24px">' +
        '<div style="width:56px;height:56px;margin:0 auto 20px;background:linear-gradient(135deg,#7CB97A,#5eaee4);border-radius:16px;display:flex;align-items:center;justify-content:center">' +
          '<svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' +
        '</div>' +
        '<h1 style="font-size:24px;font-weight:700;color:#111;margin:0 0 6px">FollowCare</h1>' +
        '<p style="font-size:14px;color:#888;margin:0 0 24px">Enter password to view prototypes</p>' +
        '<form id="fc-auth-form" style="display:flex;flex-direction:column;gap:12px">' +
          '<input id="fc-auth-input" type="password" placeholder="Password" autocomplete="off" style="width:100%;padding:12px 16px;border:1px solid #ddd;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;transition:border-color 0.2s" />' +
          '<button type="submit" style="width:100%;padding:12px;background:linear-gradient(135deg,#7CB97A,#5eaee4);color:white;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;transition:opacity 0.2s">Enter</button>' +
          '<p id="fc-auth-error" style="color:#e53e3e;font-size:13px;margin:0;display:none">Incorrect password</p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(overlay);

    var input = document.getElementById('fc-auth-input');
    var form = document.getElementById('fc-auth-form');
    var error = document.getElementById('fc-auth-error');

    input.focus();
    input.addEventListener('focus', function() { input.style.borderColor = '#5eaee4'; });
    input.addEventListener('blur', function() { input.style.borderColor = '#ddd'; });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      sha256(input.value).then(function(hash) {
        if (hash === PASS_HASH) {
          sessionStorage.setItem('fc_auth', 'true');
          overlay.remove();
          document.documentElement.style.visibility = 'visible';
        } else {
          error.style.display = 'block';
          input.style.borderColor = '#e53e3e';
          input.value = '';
          input.focus();
        }
      });
    });
  });
})();
